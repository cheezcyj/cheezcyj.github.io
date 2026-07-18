from __future__ import annotations

import argparse
import csv
import hashlib
import json
import mimetypes
import shutil
import struct
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable

from PIL import Image, ImageDraw, ImageFont, ImageOps, UnidentifiedImageError


IMAGE_EXTENSIONS = {
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".gif",
    ".bmp",
    ".tif",
    ".tiff",
}
VIDEO_EXTENSIONS = {".mp4", ".mov", ".webm", ".m4v", ".avi", ".mkv"}
CODEC_LABELS = {
    "avc1": "H.264/AVC",
    "avc3": "H.264/AVC",
    "hev1": "H.265/HEVC",
    "hvc1": "H.265/HEVC",
    "vp08": "VP8",
    "vp09": "VP9",
    "av01": "AV1",
    "mp4v": "MPEG-4 Visual",
}


def iso_datetime(timestamp: float) -> str:
    return datetime.fromtimestamp(timestamp, timezone.utc).astimezone().isoformat()


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def iter_boxes(data: bytes, start: int = 0, end: int | None = None):
    cursor = start
    limit = len(data) if end is None else min(end, len(data))
    while cursor + 8 <= limit:
        size = struct.unpack_from(">I", data, cursor)[0]
        box_type = data[cursor + 4 : cursor + 8].decode("latin-1")
        header_size = 8
        if size == 1:
            if cursor + 16 > limit:
                break
            size = struct.unpack_from(">Q", data, cursor + 8)[0]
            header_size = 16
        elif size == 0:
            size = limit - cursor
        if size < header_size or cursor + size > limit:
            break
        yield box_type, cursor + header_size, cursor + size
        cursor += size


def child_box(data: bytes, start: int, end: int, wanted: str):
    return next(
        ((payload_start, payload_end) for kind, payload_start, payload_end in iter_boxes(data, start, end) if kind == wanted),
        None,
    )


def parse_tkhd(data: bytes, start: int, end: int) -> dict[str, Any]:
    payload = data[start:end]
    version = payload[0] if payload else 0
    track_id_offset = 20 if version == 1 else 12
    track_id = struct.unpack_from(">I", payload, track_id_offset)[0] if len(payload) >= track_id_offset + 4 else None
    width = struct.unpack_from(">I", payload, len(payload) - 8)[0] / 65536 if len(payload) >= 8 else None
    height = struct.unpack_from(">I", payload, len(payload) - 4)[0] / 65536 if len(payload) >= 4 else None
    rotation = 0
    if len(payload) >= 44:
        matrix_offset = len(payload) - 44
        a, b, _, c, d = struct.unpack_from(">iiiii", payload, matrix_offset)
        if a == 0 and b > 0 and c < 0 and d == 0:
            rotation = 90
        elif a < 0 and b == 0 and c == 0 and d < 0:
            rotation = 180
        elif a == 0 and b < 0 and c > 0 and d == 0:
            rotation = 270
    return {
        "track_id": track_id,
        "width": round(width) if width is not None else None,
        "height": round(height) if height is not None else None,
        "rotation_degrees": rotation,
    }


def parse_mdhd(data: bytes, start: int, end: int) -> tuple[int | None, int | None]:
    payload = data[start:end]
    if not payload:
        return None, None
    if payload[0] == 1 and len(payload) >= 32:
        return struct.unpack_from(">I", payload, 20)[0], struct.unpack_from(">Q", payload, 24)[0]
    if len(payload) >= 20:
        return struct.unpack_from(">I", payload, 12)[0], struct.unpack_from(">I", payload, 16)[0]
    return None, None


def parse_handler(data: bytes, start: int, end: int) -> str | None:
    payload = data[start:end]
    return payload[8:12].decode("latin-1") if len(payload) >= 12 else None


def parse_codec_and_frame_rate(
    data: bytes, mdia_start: int, mdia_end: int, timescale: int | None
) -> tuple[str | None, float | None]:
    minf = child_box(data, mdia_start, mdia_end, "minf")
    if not minf:
        return None, None
    stbl = child_box(data, minf[0], minf[1], "stbl")
    if not stbl:
        return None, None
    codec = None
    stsd = child_box(data, stbl[0], stbl[1], "stsd")
    if stsd and stsd[0] + 16 <= stsd[1]:
        codec = data[stsd[0] + 12 : stsd[0] + 16].decode("latin-1")
    frame_rate = None
    stts = child_box(data, stbl[0], stbl[1], "stts")
    if stts and timescale and stts[0] + 8 <= stts[1]:
        entry_count = struct.unpack_from(">I", data, stts[0] + 4)[0]
        total_samples = 0
        total_ticks = 0
        cursor = stts[0] + 8
        for _ in range(entry_count):
            if cursor + 8 > stts[1]:
                break
            sample_count, sample_delta = struct.unpack_from(">II", data, cursor)
            total_samples += sample_count
            total_ticks += sample_count * sample_delta
            cursor += 8
        if total_ticks:
            frame_rate = total_samples * timescale / total_ticks
    return codec, frame_rate


def mp4_metadata(path: Path) -> dict[str, Any]:
    data = path.read_bytes()
    moov = child_box(data, 0, len(data), "moov")
    if not moov:
        return {"parse_status": "moov box not found"}
    tracks = []
    for kind, trak_start, trak_end in iter_boxes(data, moov[0], moov[1]):
        if kind != "trak":
            continue
        tkhd = child_box(data, trak_start, trak_end, "tkhd")
        mdia = child_box(data, trak_start, trak_end, "mdia")
        if not mdia:
            continue
        handler_box = child_box(data, mdia[0], mdia[1], "hdlr")
        mdhd_box = child_box(data, mdia[0], mdia[1], "mdhd")
        handler = parse_handler(data, *handler_box) if handler_box else None
        timescale, duration_ticks = parse_mdhd(data, *mdhd_box) if mdhd_box else (None, None)
        codec, frame_rate = parse_codec_and_frame_rate(data, mdia[0], mdia[1], timescale)
        track = parse_tkhd(data, *tkhd) if tkhd else {}
        track.update(
            {
                "handler": handler,
                "timescale": timescale,
                "duration_seconds": round(duration_ticks / timescale, 3)
                if duration_ticks is not None and timescale
                else None,
                "codec_fourcc": codec,
                "codec": CODEC_LABELS.get(codec or "", codec),
                "frame_rate": round(frame_rate, 3) if frame_rate else None,
            }
        )
        tracks.append(track)
    video_tracks = [track for track in tracks if track.get("handler") == "vide"]
    audio_tracks = [track for track in tracks if track.get("handler") == "soun"]
    primary = video_tracks[0] if video_tracks else {}
    width = primary.get("width")
    height = primary.get("height")
    rotation = primary.get("rotation_degrees") or 0
    display_width, display_height = width, height
    if rotation in {90, 270}:
        display_width, display_height = height, width
    durations = [track["duration_seconds"] for track in tracks if track.get("duration_seconds") is not None]
    return {
        "parse_status": "ok",
        "width": display_width,
        "height": display_height,
        "encoded_width": width,
        "encoded_height": height,
        "duration_seconds": max(durations) if durations else None,
        "frame_rate": primary.get("frame_rate"),
        "codec_fourcc": primary.get("codec_fourcc"),
        "codec": primary.get("codec"),
        "audio_present": bool(audio_tracks),
        "audio_track_count": len(audio_tracks),
        "rotation_degrees": rotation,
        "orientation": "portrait" if display_width and display_height and display_height > display_width else "landscape",
        "tracks": tracks,
    }


def dhash(image: Image.Image) -> int:
    gray = ImageOps.grayscale(ImageOps.exif_transpose(image)).resize((9, 8), Image.Resampling.LANCZOS)
    pixels = list(gray.get_flattened_data())
    result = 0
    for row in range(8):
        for column in range(8):
            result = (result << 1) | (pixels[row * 9 + column] > pixels[row * 9 + column + 1])
    return result


def image_metadata(path: Path) -> tuple[dict[str, Any], int | None]:
    try:
        with Image.open(path) as image:
            exif = image.getexif()
            orientation_value = exif.get(274)
            mode = image.mode
            has_alpha = "A" in mode or "transparency" in image.info
            animated = bool(getattr(image, "is_animated", False))
            frames = int(getattr(image, "n_frames", 1))
            duration_ms = None
            if animated:
                durations = []
                for frame_index in range(frames):
                    image.seek(frame_index)
                    durations.append(int(image.info.get("duration", 0)))
                duration_ms = sum(durations)
                image.seek(0)
            gps_ifd = exif.get_ifd(34853) if 34853 in exif else {}
            gps_present = bool(gps_ifd)
            gps_coordinate_present = 2 in gps_ifd or 4 in gps_ifd
            metadata = {
                "format": image.format,
                "width": image.width,
                "height": image.height,
                "orientation": "portrait" if image.height > image.width else "landscape",
                "exif_orientation": orientation_value,
                "alpha_channel": has_alpha,
                "animated": animated,
                "frame_count": frames,
                "animation_duration_ms": duration_ms,
                "metadata_keys": sorted(str(key) for key in image.info.keys()),
                "exif_tag_count": len(exif),
                "gps_metadata_present": gps_present,
                "gps_metadata_tag_ids": sorted(gps_ifd.keys()),
                "gps_coordinate_present": gps_coordinate_present,
            }
            return metadata, dhash(image)
    except (UnidentifiedImageError, OSError) as error:
        return {"parse_error": str(error)}, None


def safe_name(path: Path) -> str:
    name = path.stem
    cleaned = "".join(character.lower() if character.isalnum() else "-" for character in name)
    while "--" in cleaned:
        cleaned = cleaned.replace("--", "-")
    return cleaned.strip("-") or "media"


def create_preview(source: Path, destination: Path) -> dict[str, Any]:
    with Image.open(source) as image:
        image.seek(0)
        frame = ImageOps.exif_transpose(image.convert("RGBA") if image.mode in {"P", "LA"} else image.copy())
        frame.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
        destination.parent.mkdir(parents=True, exist_ok=True)
        if "A" in frame.mode:
            background = Image.new("RGB", frame.size, "#f5f2e8")
            background.paste(frame, mask=frame.getchannel("A"))
            frame = background
        else:
            frame = frame.convert("RGB")
        frame.save(destination, "JPEG", quality=88, optimize=True, exif=b"")
        return {"path": destination.as_posix(), "width": frame.width, "height": frame.height}


def sample_gif_frames(source: Path, output_directory: Path) -> list[dict[str, Any]]:
    samples = []
    with Image.open(source) as image:
        frame_count = int(getattr(image, "n_frames", 1))
        cumulative_durations = []
        elapsed = 0
        for frame_index in range(frame_count):
            image.seek(frame_index)
            cumulative_durations.append(elapsed)
            elapsed += int(image.info.get("duration", 0))
        for percentage in (10, 30, 50, 70, 90):
            frame_index = min(frame_count - 1, round((frame_count - 1) * percentage / 100))
            image.seek(frame_index)
            frame = image.convert("RGB")
            frame.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
            destination = output_directory / f"{safe_name(source)}-frame-{percentage:02d}.jpg"
            frame.save(destination, "JPEG", quality=88, optimize=True, exif=b"")
            samples.append(
                {
                    "percentage": percentage,
                    "frame_index": frame_index,
                    "timestamp_seconds": round(cumulative_durations[frame_index] / 1000, 3),
                    "path": destination.as_posix(),
                    "width": frame.width,
                    "height": frame.height,
                }
            )
    return samples


def get_font(size: int, bold: bool = False):
    candidates = [
        Path("C:/Windows/Fonts/malgunbd.ttf" if bold else "C:/Windows/Fonts/malgun.ttf"),
        Path("C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default()


def make_image_contact_sheets(
    entries: list[dict[str, Any]],
    output_directory: Path,
    classifications: dict[str, dict[str, str]],
) -> list[str]:
    included = [
        entry
        for entry in entries
        if entry["kind"] == "image"
        and classifications.get(entry["relative_path"], {}).get("risk", "Review")
        in {"Safe", "Review"}
        and entry.get("review_preview", {}).get("absolute_path")
    ]
    page_paths = []
    columns, rows = 3, 3
    page_size = (1920, 1160)
    cell_width, cell_height = 620, 345
    title_font = get_font(32, bold=True)
    label_font = get_font(19)
    small_font = get_font(17)
    if not included:
        canvas = Image.new("RGB", page_size, "#07101d")
        draw = ImageDraw.Draw(canvas)
        draw.text((50, 45), "RoadScanner 이미지 검토용 contact sheet", fill="#f1e9d2", font=title_font)
        draw.text(
            (50, 130),
            "Safe 또는 Review 등급 정적 이미지: 0개",
            fill="#ef9a76",
            font=get_font(30, bold=True),
        )
        draw.text(
            (50, 195),
            "민감정보와 개발 환경이 보이는 Redaction Required/Exclude 이미지는 사본과 thumbnail을 저장하지 않았습니다.",
            fill="#b7c0ca",
            font=get_font(23),
        )
        destination = output_directory / "images-overview.jpg"
        canvas.save(destination, "JPEG", quality=90, optimize=True)
        return [destination.as_posix()]
    for page_index in range(0, len(included), columns * rows):
        page_entries = included[page_index : page_index + columns * rows]
        canvas = Image.new("RGB", page_size, "#07101d")
        draw = ImageDraw.Draw(canvas)
        draw.text((30, 20), "RoadScanner 이미지 검토용 contact sheet", fill="#f1e9d2", font=title_font)
        for index, entry in enumerate(page_entries):
            row, column = divmod(index, columns)
            left = 30 + column * cell_width
            top = 80 + row * cell_height
            preview_path = Path(entry["review_preview"]["absolute_path"])
            with Image.open(preview_path) as preview:
                thumbnail = preview.convert("RGB")
                thumbnail.thumbnail((580, 245), Image.Resampling.LANCZOS)
                x = left + (580 - thumbnail.width) // 2
                y = top + (245 - thumbnail.height) // 2
                canvas.paste(thumbnail, (x, y))
            classification = classifications.get(entry["relative_path"], {})
            draw.text((left, top + 252), entry["filename"], fill="#f1e9d2", font=label_font)
            draw.text(
                (left, top + 281),
                f'{entry.get("width")}×{entry.get("height")} · {classification.get("scene", "Unknown")}',
                fill="#b7c0ca",
                font=small_font,
            )
            risk = classification.get("risk", "Review")
            risk_color = {"Safe": "#8fd694", "Review": "#f1c75b", "Redaction Required": "#ff9b71"}.get(risk, "#ef6f6c")
            draw.text((left, top + 307), risk, fill=risk_color, font=small_font)
        page_number = page_index // (columns * rows) + 1
        destination = output_directory / f"images-overview-{page_number:02d}.jpg"
        canvas.save(destination, "JPEG", quality=90, optimize=True)
        page_paths.append(destination.as_posix())
    return page_paths


def make_gif_contact_sheet(
    source: Path, samples: list[dict[str, Any]], destination: Path
) -> str:
    canvas = Image.new("RGB", (1920, 520), "#07101d")
    draw = ImageDraw.Draw(canvas)
    draw.text((30, 18), f"Animated GIF: {source.name}", fill="#f1e9d2", font=get_font(28, bold=True))
    label_font = get_font(18)
    for index, sample in enumerate(samples):
        with Image.open(sample["path"]) as frame:
            thumbnail = frame.convert("RGB")
            thumbnail.thumbnail((350, 350), Image.Resampling.LANCZOS)
            left = 25 + index * 380
            top = 75 + (350 - thumbnail.height) // 2
            canvas.paste(thumbnail, (left + (350 - thumbnail.width) // 2, top))
        draw.text(
            (left, 438),
            f'{sample["percentage"]}% · {sample["timestamp_seconds"]:.2f}s · frame {sample["frame_index"]}',
            fill="#b7c0ca",
            font=label_font,
        )
    canvas.save(destination, "JPEG", quality=90, optimize=True)
    return destination.as_posix()


def make_video_metadata_sheet(entries: list[dict[str, Any]], destination: Path) -> str:
    videos = [entry for entry in entries if entry["kind"] == "video"]
    canvas = Image.new("RGB", (1920, 1220), "#07101d")
    draw = ImageDraw.Draw(canvas)
    draw.text((40, 25), "RoadScanner 영상 metadata overview", fill="#f1e9d2", font=get_font(32, bold=True))
    draw.text(
        (40, 75),
        "ffmpeg/ffprobe 미설치: frame·poster·화면 분류는 생성하지 않음",
        fill="#f1c75b",
        font=get_font(21),
    )
    name_font = get_font(21, bold=True)
    metadata_font = get_font(18)
    for index, entry in enumerate(videos):
        top = 125 + index * 80
        if index % 2:
            draw.rectangle((30, top - 8, 1890, top + 64), fill="#101c2c")
        draw.text((50, top), entry["filename"], fill="#f1e9d2", font=name_font)
        duration = entry.get("duration_seconds")
        metadata = (
            f'{entry.get("width")}×{entry.get("height")} · '
            f'{duration:.3f}s · {entry.get("frame_rate")} fps · '
            f'{entry.get("codec")} · audio track: {"yes" if entry.get("audio_present") else "no"}'
        )
        draw.text((690, top + 2), metadata, fill="#b7c0ca", font=metadata_font)
        draw.text((690, top + 31), "Scene: Unknown · visual privacy review pending", fill="#ef9a76", font=metadata_font)
    canvas.save(destination, "JPEG", quality=90, optimize=True)
    return destination.as_posix()


def write_csv(entries: list[dict[str, Any]], destination: Path) -> None:
    fields = [
        "relative_path",
        "absolute_path",
        "filename",
        "kind",
        "extension",
        "mime_type",
        "size_bytes",
        "sha256",
        "created_at",
        "modified_at",
        "width",
        "height",
        "duration_seconds",
        "frame_rate",
        "codec",
        "codec_fourcc",
        "audio_present",
        "orientation",
        "rotation_degrees",
        "alpha_channel",
        "animated",
        "frame_count",
        "animation_duration_ms",
        "exif_orientation",
        "gps_metadata_present",
        "gps_coordinate_present",
    ]
    with destination.open("w", encoding="utf-8-sig", newline="") as target:
        writer = csv.DictWriter(target, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(entries)


def build_inventory(source_root: Path, output_root: Path) -> dict[str, Any]:
    preview_directory = output_root.parent / "previews"
    contact_sheet_directory = output_root.parent / "contact-sheets"
    poster_directory = output_root.parent / "posters"
    for directory in (output_root, preview_directory, contact_sheet_directory, poster_directory):
        directory.mkdir(parents=True, exist_ok=True)

    classification_path = output_root / "review-classifications.json"
    classifications = (
        json.loads(classification_path.read_text(encoding="utf-8"))
        if classification_path.exists()
        else {}
    )
    entries = []
    hashes: defaultdict[str, list[str]] = defaultdict(list)
    sha_by_path: dict[str, str] = {}
    perceptual_hashes: dict[str, int] = {}
    gif_samples: dict[str, list[dict[str, Any]]] = {}

    for path in sorted((item for item in source_root.rglob("*") if item.is_file()), key=lambda item: item.as_posix().lower()):
        relative_path = path.relative_to(source_root).as_posix()
        extension = path.suffix.lower()
        kind = "image" if extension in IMAGE_EXTENSIONS else "video" if extension in VIDEO_EXTENSIONS else "other"
        stat = path.stat()
        digest = sha256(path)
        hashes[digest].append(relative_path)
        sha_by_path[relative_path] = digest
        entry: dict[str, Any] = {
            "absolute_path": str(path.resolve()),
            "relative_path": relative_path,
            "filename": path.name,
            "extension": extension,
            "mime_type": mimetypes.guess_type(path.name)[0] or "application/octet-stream",
            "kind": kind,
            "size_bytes": stat.st_size,
            "sha256": digest,
            "created_at": iso_datetime(stat.st_ctime),
            "modified_at": iso_datetime(stat.st_mtime),
        }
        if kind == "image":
            metadata, perceptual_hash = image_metadata(path)
            entry.update(metadata)
            if perceptual_hash is not None:
                perceptual_hashes[relative_path] = perceptual_hash
                entry["dhash"] = f"{perceptual_hash:016x}"
            risk = classifications.get(relative_path, {}).get("risk", "Review")
            if risk in {"Safe", "Review"}:
                preview_name = f"{safe_name(path)}-preview.jpg"
                preview_path = preview_directory / preview_name
                preview = create_preview(path, preview_path)
                preview["absolute_path"] = str(preview_path.resolve())
                entry["review_preview"] = preview
            else:
                entry["review_preview"] = {
                    "status": f"not generated: {risk} source is metadata-only"
                }
            if entry.get("animated") and risk in {"Safe", "Review"}:
                samples = sample_gif_frames(path, preview_directory)
                for sample in samples:
                    sample["absolute_path"] = str(Path(sample["path"]).resolve())
                gif_samples[relative_path] = samples
                contact_sheet_path = contact_sheet_directory / f"{safe_name(path)}-animation-contact-sheet.jpg"
                entry["animation_contact_sheet"] = make_gif_contact_sheet(path, samples, contact_sheet_path)
                entry["poster_candidates"] = []
                for poster_index, percentage in enumerate((90, 70), start=1):
                    sample = next(item for item in samples if item["percentage"] == percentage)
                    poster_path = poster_directory / f"{safe_name(path)}-poster-{poster_index:02d}.jpg"
                    shutil.copyfile(sample["path"], poster_path)
                    entry["poster_candidates"].append(
                        {
                            "rank": poster_index,
                            "source_percentage": percentage,
                            "timestamp_seconds": sample["timestamp_seconds"],
                            "path": poster_path.as_posix(),
                            "absolute_path": str(poster_path.resolve()),
                        }
                    )
        elif kind == "video":
            if extension in {".mp4", ".m4v", ".mov"}:
                entry.update(mp4_metadata(path))
            else:
                entry["parse_status"] = "unsupported without ffprobe"
            entry["frame_extraction_status"] = "not generated: ffmpeg/ffprobe unavailable"
        entries.append(entry)

    exact_duplicates = [paths for paths in hashes.values() if len(paths) > 1]
    near_duplicates = []
    image_paths = sorted(perceptual_hashes)
    for index, first in enumerate(image_paths):
        for second in image_paths[index + 1 :]:
            distance = (perceptual_hashes[first] ^ perceptual_hashes[second]).bit_count()
            if distance <= 6 and sha_by_path[first] != sha_by_path[second]:
                near_duplicates.append({"files": [first, second], "dhash_distance": distance})

    image_contact_sheets = make_image_contact_sheets(entries, contact_sheet_directory, classifications)
    video_contact_sheet = make_video_metadata_sheet(
        entries, contact_sheet_directory / "videos-overview.jpg"
    )
    inventory = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "source_root": str(source_root.resolve()),
        "output_root": str(output_root.resolve()),
        "tooling": {
            "image_tool": f"Pillow {Image.__version__}",
            "video_metadata_tool": "read-only ISO BMFF parser in generate_review_assets.py",
            "ffmpeg_available": False,
            "ffprobe_available": False,
            "video_frames_generated": False,
        },
        "summary": {
            "file_count": len(entries),
            "image_count": sum(entry["kind"] == "image" for entry in entries),
            "video_count": sum(entry["kind"] == "video" for entry in entries),
            "other_count": sum(entry["kind"] == "other" for entry in entries),
            "total_size_bytes": sum(entry["size_bytes"] for entry in entries),
            "exact_duplicate_group_count": len(exact_duplicates),
            "near_duplicate_candidate_count": len(near_duplicates),
        },
        "exact_duplicates": exact_duplicates,
        "near_duplicate_candidates": near_duplicates,
        "gif_samples": gif_samples,
        "image_contact_sheets": image_contact_sheets,
        "video_contact_sheets": [video_contact_sheet],
        "files": entries,
    }
    (output_root / "inventory.json").write_text(
        json.dumps(inventory, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    write_csv(entries, output_root / "inventory.csv")
    (poster_directory / "README.md").write_text(
        "# RoadScanner poster 후보\n\n"
        "`ffmpeg`와 `ffprobe`가 없어 MP4 frame 및 poster는 생성하지 않았다. "
        "영상 원본을 수정하거나 재인코딩하지 않았으며, Owner 승인 전 별도 도구 설치도 수행하지 않았다.\n\n"
        "애니메이션 GIF는 `Redaction Required`로 분류되어 정지 frame과 poster 사본을 저장하지 않았다. "
        "직접 육안 검수한 90%와 70% 지점은 문서에서만 poster 후보로 기록한다.\n",
        encoding="utf-8",
    )
    (preview_directory / "README.md").write_text(
        "# RoadScanner 검토용 preview\n\n"
        "Safe 또는 Review 등급의 정적 이미지가 없어 preview 사본을 저장하지 않았다. "
        "Redaction Required와 Exclude 원본은 metadata와 위험 분류만 기록한다.\n",
        encoding="utf-8",
    )
    return inventory


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source_root", type=Path)
    parser.add_argument("output_root", type=Path)
    arguments = parser.parse_args()
    if not arguments.source_root.is_dir():
        raise SystemExit(f"source directory does not exist: {arguments.source_root}")
    inventory = build_inventory(arguments.source_root.resolve(), arguments.output_root.resolve())
    print(json.dumps(inventory["summary"], ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
