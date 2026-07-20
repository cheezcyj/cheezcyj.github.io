from __future__ import annotations

import argparse
import hashlib
import json
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageOps


EXTERNAL_MEDIA_ROOT = "<external-media-source>/roadscanner"
REPOSITORY_ROOT = Path(__file__).resolve().parents[5]


def portable_manifest_value(value: object, source_root: Path) -> object:
    if isinstance(value, dict):
        return {
            key: portable_manifest_value(item, source_root)
            for key, item in value.items()
        }
    if isinstance(value, list):
        return [portable_manifest_value(item, source_root) for item in value]
    if not isinstance(value, str):
        return value

    candidate = Path(value)
    if not candidate.is_absolute():
        portable_value = value
        for actual_root, label in (
            (source_root.resolve(), EXTERNAL_MEDIA_ROOT),
            (REPOSITORY_ROOT, "<repository-root>"),
        ):
            for representation in {str(actual_root), actual_root.as_posix()}:
                portable_value = portable_value.replace(representation, label)
        return (
            portable_value.replace("\\", "/")
            if portable_value != value
            else value
        )

    resolved = candidate.resolve()
    try:
        relative = resolved.relative_to(source_root)
        return (
            EXTERNAL_MEDIA_ROOT
            if relative == Path(".")
            else f"{EXTERNAL_MEDIA_ROOT}/{relative.as_posix()}"
        )
    except ValueError:
        pass

    try:
        return resolved.relative_to(REPOSITORY_ROOT).as_posix()
    except ValueError:
        return f"<external-output>/{resolved.name}"


@dataclass(frozen=True)
class Rectangle:
    x: int
    y: int
    width: int
    height: int

    @property
    def box(self) -> tuple[int, int, int, int]:
        return (self.x, self.y, self.x + self.width, self.y + self.height)

    def as_dict(self) -> dict[str, int]:
        return {
            "x": self.x,
            "y": self.y,
            "width": self.width,
            "height": self.height,
        }


@dataclass(frozen=True)
class Mask:
    label: str
    rectangle: Rectangle
    fill: str


SOURCE_FILES = {
    "cover": "images/VideoCapture_20231108-170028.jpg",
    "upload": "images/VideoCapture_20231108-170206.jpg",
    "statistics": "images/VideoCapture_20231108-170610.jpg",
    "qna": "images/VideoCapture_20231108-170658.jpg",
    "image_management": "images/VideoCapture_20231108-170100.jpg",
    "gif": "videos/263704183-d9e78da4-732d-4f06-8a29-d00c654763cd.gif",
}

CONTENT_CROP = Rectangle(0, 96, 1920, 964)
HEADER_ACCOUNT_MASK = Mask(
    "signed-in account name and account menu",
    Rectangle(1360, 96, 555, 81),
    "#e3e3e3",
)
STATUS_BAR_MASK = Mask(
    "browser status localhost URL",
    Rectangle(0, 1028, 190, 32),
    "#ffffff",
)
ALERT_MASK = Mask(
    "localhost alert/dialog",
    Rectangle(710, 90, 500, 145),
    "#ffffff",
)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def intersection(mask: Rectangle, crop: Rectangle) -> Rectangle | None:
    left = max(mask.x, crop.x)
    top = max(mask.y, crop.y)
    right = min(mask.x + mask.width, crop.x + crop.width)
    bottom = min(mask.y + mask.height, crop.y + crop.height)
    if right <= left or bottom <= top:
        return None
    return Rectangle(left - crop.x, top - crop.y, right - left, bottom - top)


def save_review(
    source: Path,
    destination: Path,
    crop: Rectangle,
    masks: Iterable[Mask],
) -> dict[str, object]:
    with Image.open(source) as image:
        frame = ImageOps.exif_transpose(image).convert("RGB")
        if frame.size != (1920, 1080):
            raise ValueError(f"unexpected source dimensions for {source}: {frame.size}")
        applied_masks = []
        draw = ImageDraw.Draw(frame)
        for mask in masks:
            draw.rectangle(mask.rectangle.box, fill=mask.fill)
            relative = intersection(mask.rectangle, crop)
            if relative:
                applied_masks.append(
                    {
                        "label": mask.label,
                        "source_coordinates": mask.rectangle.as_dict(),
                        "output_coordinates": relative.as_dict(),
                        "fill": mask.fill,
                        "method": "fully opaque solid mask",
                    }
                )
        output = frame.crop(crop.box)
        destination.parent.mkdir(parents=True, exist_ok=True)
        output.save(
            destination,
            "JPEG",
            quality=92,
            subsampling=0,
            optimize=True,
            exif=b"",
        )
    return {
        "source": source.as_posix(),
        "source_sha256": sha256(source),
        "output": destination.as_posix(),
        "output_sha256": sha256(destination),
        "crop": crop.as_dict(),
        "output_width": crop.width,
        "output_height": crop.height,
        "masks": applied_masks,
        "metadata_removed": True,
    }


def qna_masks() -> list[Mask]:
    masks = [HEADER_ACCOUNT_MASK]
    for row in range(13):
        top = 374 + row * 38
        masks.extend(
            [
                Mask("Q&A internal number", Rectangle(306, top, 112, 27), "#ffffff"),
                Mask("Q&A post title", Rectangle(548, top, 500, 27), "#ffffff"),
                Mask("Q&A author identifier", Rectangle(1040, top, 220, 27), "#ffffff"),
            ]
        )
    return masks


def gif_timestamp_frame(image: Image.Image, seconds: float) -> Image.Image:
    elapsed_ms = 0
    target_ms = round(seconds * 1000)
    frame_index = 0
    for index in range(int(getattr(image, "n_frames", 1))):
        image.seek(index)
        duration = int(image.info.get("duration", 0))
        if elapsed_ms + duration > target_ms:
            frame_index = index
            break
        elapsed_ms += duration
        frame_index = index
    image.seek(frame_index)
    frame = image.convert("RGB")
    return frame, frame_index, elapsed_ms / 1000


def save_gif_frame(
    source: Path,
    destination: Path,
    requested_seconds: float,
    percentage: int,
) -> dict[str, object]:
    crop = Rectangle(56, 20, 688, 387)
    with Image.open(source) as image:
        frame, frame_index, actual_seconds = gif_timestamp_frame(image, requested_seconds)
        if frame.size != (800, 407):
            raise ValueError(f"unexpected GIF dimensions: {frame.size}")
        output = frame.crop(crop.box)
        destination.parent.mkdir(parents=True, exist_ok=True)
        output.save(
            destination,
            "JPEG",
            quality=92,
            subsampling=0,
            optimize=True,
            exif=b"",
        )
    return {
        "source": source.as_posix(),
        "source_sha256": sha256(source),
        "output": destination.as_posix(),
        "output_sha256": sha256(destination),
        "requested_timestamp_seconds": requested_seconds,
        "actual_frame_start_seconds": actual_seconds,
        "frame_index": frame_index,
        "percentage_label": percentage,
        "crop": crop.as_dict(),
        "output_width": crop.width,
        "output_height": crop.height,
        "masks": [],
        "metadata_removed": True,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source_root", type=Path)
    parser.add_argument("output_root", type=Path)
    arguments = parser.parse_args()
    source_root = arguments.source_root.resolve()
    output_root = arguments.output_root.resolve()
    if not source_root.is_dir():
        raise SystemExit(f"source directory does not exist: {source_root}")
    if output_root == source_root or output_root.is_relative_to(source_root):
        raise SystemExit("output must not be inside the source directory")

    crops_directory = output_root / "proposed-crops"
    previews_directory = output_root / "redacted-previews"
    frames_directory = output_root / "video-frames"
    reports_directory = output_root / "reports"
    for directory in (
        crops_directory,
        previews_directory,
        frames_directory,
        reports_directory,
    ):
        directory.mkdir(parents=True, exist_ok=True)

    sources = {name: source_root / relative for name, relative in SOURCE_FILES.items()}
    missing = [str(path) for path in sources.values() if not path.is_file()]
    if missing:
        raise SystemExit("missing source files: " + ", ".join(missing))

    outputs = []
    outputs.append(
        {
            "id": "cover-function",
            "classification": "Rights Review Required",
            "rights": ["uploaded traffic-sign image: Pending", "team UI: Pending"],
            **save_review(
                sources["cover"],
                crops_directory / "videocapture-20231108-170028-function-crop-preview.jpg",
                Rectangle(160, 176, 1440, 810),
                [ALERT_MASK],
            ),
        }
    )
    outputs.append(
        {
            "id": "cover-context",
            "classification": "Rights Review Required",
            "rights": ["uploaded traffic-sign image: Pending", "team UI: Pending"],
            **save_review(
                sources["cover"],
                crops_directory / "videocapture-20231108-170028-context-crop-preview.jpg",
                Rectangle(96, 96, 1728, 972),
                [ALERT_MASK],
            ),
        }
    )
    outputs.append(
        {
            "id": "gallery-upload",
            "classification": "Rights Review Required",
            "rights": ["upload graphic: Pending", "team UI: Pending"],
            **save_review(
                sources["upload"],
                previews_directory / "videocapture-20231108-170206-redacted-review.jpg",
                CONTENT_CROP,
                [HEADER_ACCOUNT_MASK, STATUS_BAR_MASK],
            ),
        }
    )
    outputs.append(
        {
            "id": "gallery-statistics",
            "classification": "Safe Review Candidate",
            "rights": ["team UI: Pending", "aggregate statistics publication: Pending"],
            **save_review(
                sources["statistics"],
                previews_directory / "videocapture-20231108-170610-redacted-review.jpg",
                CONTENT_CROP,
                [HEADER_ACCOUNT_MASK],
            ),
        }
    )
    outputs.append(
        {
            "id": "gallery-qna",
            "classification": "Safe Review Candidate",
            "rights": ["team UI: Pending"],
            **save_review(
                sources["qna"],
                previews_directory / "videocapture-20231108-170658-redacted-review.jpg",
                CONTENT_CROP,
                qna_masks(),
            ),
        }
    )
    outputs.append(
        {
            "id": "gallery-image-management",
            "classification": "Rights Review Required",
            "rights": ["traffic-sign images: Pending", "team UI: Pending"],
            **save_review(
                sources["image_management"],
                previews_directory / "videocapture-20231108-170100-redacted-review.jpg",
                CONTENT_CROP,
                [HEADER_ACCOUNT_MASK, ALERT_MASK],
            ),
        }
    )
    outputs.append(
        {
            "id": "gif-poster-70",
            "classification": "Rights Review Required",
            "rights": ["RoadScanner logo: Pending", "road/car footage: Pending", "team graphics: Pending"],
            **save_gif_frame(
                sources["gif"],
                frames_directory / "263704183-d9e78da4-732d-4f06-8a29-d00c654763cd-frame-70.jpg",
                5.00,
                70,
            ),
        }
    )
    outputs.append(
        {
            "id": "gif-poster-90",
            "classification": "Further Redaction Required",
            "rights": [
                "RoadScanner logo: Pending",
                "road/car footage: Pending",
                "team graphics: Pending",
                "quantitative performance claim publication: Pending",
            ],
            **save_gif_frame(
                sources["gif"],
                frames_directory / "263704183-d9e78da4-732d-4f06-8a29-d00c654763cd-frame-90.jpg",
                6.42,
                90,
            ),
        }
    )

    manifest = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "source_root": str(source_root),
        "output_root": str(output_root),
        "source_protection": {
            "source_files_modified": False,
            "source_files_copied": False,
            "source_metadata_modified": False,
        },
        "method": {
            "image_library": f"Pillow {Image.__version__}",
            "crop_before_mask_priority": True,
            "mask_type": "fully opaque solid rectangles",
            "blur_used": False,
            "generative_editing_used": False,
            "fake_data_inserted": False,
        },
        "outputs": outputs,
    }
    public_manifest = portable_manifest_value(manifest, source_root)
    (reports_directory / "redaction-manifest.json").write_text(
        json.dumps(public_manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(json.dumps({"output_count": len(outputs)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
