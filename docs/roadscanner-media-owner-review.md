# Phase 4C-3 RoadScanner 미디어 Owner 검토

- 작성일: 2026-07-18
- 대상 브랜치: `redesign/astro-v0`
- 원본 폴더: `<external-media-source>/roadscanner`
- 저장소: `<workspace>/cheezcyj.github.io`
- 콘텐츠 상태: `draft: true`, `featured: false`, `sourceStatus: verified`

이 문서는 저장소 밖 원본 폴더를 읽기 전용으로 조사한 결과다. 원본을 수정·이동·삭제하거나 저장소 안으로 복사하지 않았고, production `public` 경로와 RoadScanner frontmatter에도 연결하지 않았다.

## 1. 전체 요약

| 항목                |                             결과 |
| ------------------- | -------------------------------: |
| 전체 파일           |                             43개 |
| 이미지              | 30개: JPG 29개, animated GIF 1개 |
| 영상                |                         MP4 13개 |
| 기타 파일           |                              0개 |
| 전체 용량           |   30,870,583 bytes, 약 29.44 MiB |
| 정확한 SHA-256 중복 |                         0개 그룹 |
| near-duplicate 후보 |                              9쌍 |
| Safe                |                              0개 |
| Review              |           13개: MP4 frame 미검수 |
| Redaction Required  |          18개: JPG 17개, GIF 1개 |
| Exclude             |                   12개: JPG 12개 |

전체 metadata, 절대·상대 경로, MIME type, byte 크기, SHA-256, 생성·수정 시각은 다음 파일에 있다.

- [전체 JSON 인벤토리](media-review/roadscanner/source-inventory/inventory.json)
- [전체 CSV 인벤토리](media-review/roadscanner/source-inventory/inventory.csv)
- [장면·위험 분류](media-review/roadscanner/source-inventory/review-classifications.json)
- [재현용 읽기 전용 조사 도구](media-review/roadscanner/source-inventory/generate_review_assets.py)

## 2. 조사 도구와 한계

- 이미지: 기존 Pillow로 크기, 형식, orientation, alpha, animation, EXIF tag를 읽었다.
- 영상: 별도 설치 없이 ISO BMFF metadata를 읽어 해상도, duration, frame rate, codec과 audio track 존재를 확인했다.
- `ffmpeg`, `ffprobe`, ImageMagick은 설치되어 있지 않았다. 지시에 따라 설치하지 않았다.
- MP4의 10%, 30%, 50%, 70%, 90% frame, contact sheet와 poster는 생성하지 못했다.
- MP4 장면은 파일명으로 추측하지 않고 모두 `Unknown`, 시각적 개인정보 검수는 `Review`로 남겼다.
- animated GIF는 Pillow로 87개 frame과 7.26초 길이를 확인하고 직접 육안 검수했지만 `Redaction Required`이므로 frame 사본과 poster는 저장하지 않았다.

## 3. EXIF와 원본 보호

- JPG 29개는 모두 `1920×1080`, landscape, alpha 없음, animation 없음이다.
- JPG 29개에는 EXIF tag 6개가 있다.
- GPS IFD에는 GPS 날짜·시각 tag만 있고 위도·경도 좌표 tag는 발견되지 않았다.
- 원본 EXIF는 제거하거나 변경하지 않았다.
- 검토 결과 production 변환이 승인되면 최종 사본에서는 EXIF 전체 제거가 필요하다.
- `Redaction Required`와 `Exclude` 이미지는 민감정보를 Git 이력에 남기지 않기 위해 preview와 thumbnail을 저장하지 않았다.

## 4. 이미지 metadata와 화면 분류

| 원본 상대 경로                                              |      크기 | 형식·metadata                           | 장면                | 위험               |
| ----------------------------------------------------------- | --------: | --------------------------------------- | ------------------- | ------------------ |
| `images/VideoCapture_20231108-170028.jpg`                   | 1920×1080 | JPEG · EXIF 6 tags · GPS date/time only | Recognition Result  | Redaction Required |
| `images/VideoCapture_20231108-170100.jpg`                   | 1920×1080 | JPEG · EXIF 6 tags · GPS date/time only | Image Management    | Redaction Required |
| `images/VideoCapture_20231108-170130.jpg`                   | 1920×1080 | JPEG · EXIF 6 tags · GPS date/time only | Image Management    | Redaction Required |
| `images/VideoCapture_20231108-170136.jpg`                   | 1920×1080 | JPEG · EXIF 6 tags · GPS date/time only | Image Management    | Redaction Required |
| `images/VideoCapture_20231108-170206.jpg`                   | 1920×1080 | JPEG · EXIF 6 tags · GPS date/time only | Upload              | Redaction Required |
| `images/VideoCapture_20231108-170221.jpg`                   | 1920×1080 | JPEG · EXIF 6 tags · GPS date/time only | Member              | Exclude            |
| `images/VideoCapture_20231108-170240.jpg`                   | 1920×1080 | JPEG · EXIF 6 tags · GPS date/time only | Member              | Exclude            |
| `images/VideoCapture_20231108-170259.jpg`                   | 1920×1080 | JPEG · EXIF 6 tags · GPS date/time only | Member              | Exclude            |
| `images/VideoCapture_20231108-170334.jpg`                   | 1920×1080 | JPEG · EXIF 6 tags · GPS date/time only | Login               | Redaction Required |
| `images/VideoCapture_20231108-170349.jpg`                   | 1920×1080 | JPEG · EXIF 6 tags · GPS date/time only | Login               | Redaction Required |
| `images/VideoCapture_20231108-170410.jpg`                   | 1920×1080 | JPEG · EXIF 6 tags · GPS date/time only | Login               | Exclude            |
| `images/VideoCapture_20231108-170507.jpg`                   | 1920×1080 | JPEG · EXIF 6 tags · GPS date/time only | My Page             | Exclude            |
| `images/VideoCapture_20231108-170523.jpg`                   | 1920×1080 | JPEG · EXIF 6 tags · GPS date/time only | Login               | Redaction Required |
| `images/VideoCapture_20231108-170540.jpg`                   | 1920×1080 | JPEG · EXIF 6 tags · GPS date/time only | Login               | Exclude            |
| `images/VideoCapture_20231108-170610.jpg`                   | 1920×1080 | JPEG · EXIF 6 tags · GPS date/time only | Feedback Statistics | Redaction Required |
| `images/VideoCapture_20231108-170625.jpg`                   | 1920×1080 | JPEG · EXIF 6 tags · GPS date/time only | Feedback Statistics | Redaction Required |
| `images/VideoCapture_20231108-170658.jpg`                   | 1920×1080 | JPEG · EXIF 6 tags · GPS date/time only | Q&A List            | Redaction Required |
| `images/VideoCapture_20231108-170717.jpg`                   | 1920×1080 | JPEG · EXIF 6 tags · GPS date/time only | Q&A Answer          | Redaction Required |
| `images/VideoCapture_20231108-170748.jpg`                   | 1920×1080 | JPEG · EXIF 6 tags · GPS date/time only | Q&A Detail          | Redaction Required |
| `images/VideoCapture_20231108-170845.jpg`                   | 1920×1080 | JPEG · EXIF 6 tags · GPS date/time only | Q&A List            | Redaction Required |
| `images/VideoCapture_20231108-170909.jpg`                   | 1920×1080 | JPEG · EXIF 6 tags · GPS date/time only | Admin               | Exclude            |
| `images/VideoCapture_20231108-170921.jpg`                   | 1920×1080 | JPEG · EXIF 6 tags · GPS date/time only | Admin               | Exclude            |
| `images/VideoCapture_20231108-171009.jpg`                   | 1920×1080 | JPEG · EXIF 6 tags · GPS date/time only | Q&A Detail          | Redaction Required |
| `images/VideoCapture_20231108-171016.jpg`                   | 1920×1080 | JPEG · EXIF 6 tags · GPS date/time only | Q&A Answer          | Redaction Required |
| `images/VideoCapture_20231108-171036.jpg`                   | 1920×1080 | JPEG · EXIF 6 tags · GPS date/time only | Q&A Answer          | Redaction Required |
| `images/VideoCapture_20231108-171053.jpg`                   | 1920×1080 | JPEG · EXIF 6 tags · GPS date/time only | Admin               | Exclude            |
| `images/VideoCapture_20231108-171117.jpg`                   | 1920×1080 | JPEG · EXIF 6 tags · GPS date/time only | Admin               | Exclude            |
| `images/VideoCapture_20231108-171137.jpg`                   | 1920×1080 | JPEG · EXIF 6 tags · GPS date/time only | Admin               | Exclude            |
| `images/VideoCapture_20231108-171408.jpg`                   | 1920×1080 | JPEG · EXIF 6 tags · GPS date/time only | Member              | Exclude            |
| `videos/263704183-d9e78da4-732d-4f06-8a29-d00c654763cd.gif` |   800×407 | GIF · alpha · 87 frames · 7.26s         | Main                | Redaction Required |

## 5. 영상 metadata

모든 MP4는 landscape, rotation 0°, H.264/AVC `avc1`, 30fps이며 audio track이 있다. audio track의 실제 내용과 무음 여부는 재생 검수 전이라 확정하지 않는다.

| 원본 상대 경로              |     용량 |    해상도 |    길이 |    FPS | codec              | audio track |
| --------------------------- | -------: | --------: | ------: | -----: | ------------------ | ----------- |
| `videos/게시글CRUD.mp4`     | 2.99 MiB | 1920×1080 | 16.619s | 30.000 | H.264/AVC (`avc1`) | 있음        |
| `videos/게시판 관리.mp4`    | 1.57 MiB | 1920×1080 | 17.515s | 30.000 | H.264/AVC (`avc1`) | 있음        |
| `videos/공지CRUD.mp4`       | 1.47 MiB | 1920×1080 | 19.413s | 30.000 | H.264/AVC (`avc1`) | 있음        |
| `videos/내글보기.mp4`       | 0.23 MiB | 1920×1080 |  3.051s | 30.000 | H.264/AVC (`avc1`) | 있음        |
| `videos/답변CRUD.mp4`       | 0.91 MiB | 1920×1080 | 11.179s | 30.000 | H.264/AVC (`avc1`) | 있음        |
| `videos/데이터통계.mp4`     | 0.64 MiB | 1920×1080 |  8.320s | 30.000 | H.264/AVC (`avc1`) | 있음        |
| `videos/로그인화면.mp4`     | 0.30 MiB | 1920×1080 |  6.528s | 30.000 | H.264/AVC (`avc1`) | 있음        |
| `videos/마이페이지.mp4`     | 0.63 MiB | 1920×1080 | 11.115s | 30.000 | H.264/AVC (`avc1`) | 있음        |
| `videos/아이디비번찾기.mp4` | 0.90 MiB | 1920×1080 | 16.448s | 30.000 | H.264/AVC (`avc1`) | 있음        |
| `videos/유저관리.mp4`       | 2.20 MiB | 1920×1080 | 36.245s | 30.000 | H.264/AVC (`avc1`) | 있음        |
| `videos/이미지관리.mp4`     | 2.12 MiB | 1920×1080 | 18.645s | 30.000 | H.264/AVC (`avc1`) | 있음        |
| `videos/파일인식.mp4`       | 0.92 MiB | 1920×1080 | 10.496s | 30.000 | H.264/AVC (`avc1`) | 있음        |
| `videos/회원가입.mp4`       | 1.02 MiB | 1920×1080 | 17.387s | 30.000 | H.264/AVC (`avc1`) | 있음        |

[영상 metadata overview](media-review/roadscanner/contact-sheets/videos-overview.jpg)는 frame 대신 위 metadata와 시각 검수 대기 상태만 표시한다.

## 6. 정확한 중복과 near-duplicate

SHA-256이 같은 정확한 중복 파일은 없다. perceptual dHash 거리 6 이하의 near-duplicate 후보는 다음 9쌍이다. 이는 자동 삭제 근거가 아니며, 유사한 단계의 화면을 Owner가 고르기 위한 참고값이다.

| 파일 A       | 파일 B       | dHash 거리 | 장면 관계                                           |
| ------------ | ------------ | ---------: | --------------------------------------------------- |
| `170221.jpg` | `170240.jpg` |          2 | 회원·관리자 목록의 가까운 상태                      |
| `170349.jpg` | `170410.jpg` |          6 | 비밀번호 재설정 전후, 두 번째 파일은 인증 정보 포함 |
| `170523.jpg` | `170540.jpg` |          0 | 로그인 빈 입력과 입력 완료 상태                     |
| `170909.jpg` | `171053.jpg` |          6 | 관리자 Q&A 목록 상태                                |
| `170909.jpg` | `171117.jpg` |          5 | 관리자 Q&A 목록과 확인 dialog 상태                  |
| `170909.jpg` | `171137.jpg` |          2 | 관리자 Q&A 목록의 서로 다른 데이터 page             |
| `171009.jpg` | `171016.jpg` |          4 | Q&A 상세와 답변 상태                                |
| `171009.jpg` | `171036.jpg` |          1 | Q&A 상세와 답변 수정 상태                           |
| `171016.jpg` | `171036.jpg` |          3 | 답변 표시와 수정 상태                               |

## 7. 개인정보·민감 정보 검수

### 공통 노출

- JPG 29개 모두 브라우저 chrome, `localhost:8080` URL과 Bandicam watermark가 보인다.
- 여러 로그인 이후 화면에 계정명이 보인다.
- 일부 Q&A 화면에 작성자 식별값, 게시물 제목·본문, 조회 수와 답변 상태가 보인다.
- 피드백 화면에는 서비스 통계 원본 데이터가 보인다.
- GIF에는 localhost browser UI가 보인다.

### Exclude 근거

- 회원·관리자 목록: `170221`, `170240`, `170259`
- 이메일·인증번호·마스킹 비밀번호 또는 계정 입력값: `170410`, `170507`, `170540`, `171408`
- 관리자 게시물 목록과 작성자 데이터: `170909`, `170921`, `171053`, `171117`, `171137`

문서에는 실제 이메일·인증번호 값을 옮겨 적지 않았다. Exclude 원본은 향후에도 공개 후보로 사용하지 않는 것을 권장한다.

## 8. 저작권·사용 허가 위험

- 교통표지판 사진과 그래픽의 출처, 데이터셋 라이선스와 공개 재사용 가능 여부가 미확인이다.
- animated GIF의 자동차·도로 영상, 교통표지판 이미지와 RoadScanner 그래픽 제작자가 미확인이다.
- RoadScanner는 8인 팀 프로젝트이므로 UI 캡처, 로고와 팀원이 만든 그래픽의 포트폴리오 사용 동의를 확인해야 한다.
- 원본 제공 사실만으로 제3자 이미지의 공개 권리를 확정하지 않는다.
- Bandicam watermark가 포함된 화면은 production 후보로 사용하지 않는다.

## 9. Cover 후보

현재 상태 그대로 공개 가능한 Cover는 없다. 아래 순위는 안전한 재캡처 또는 승인된 비식별화가 먼저 수행된다는 전제다.

### 1순위: `images/VideoCapture_20231108-170028.jpg`

- 장면: 업로드한 우회전 교통표지판과 인식 결과가 한 화면에 보임
- 원본 크기: `1920×1080`, 이미 16:9
- 카드 가독성: 높음. 좌우 비교와 결과명이 축소 상태에서도 구분됨
- 유지 영역: 왼쪽 업로드 이미지, 오른쪽 결과명·결과 이미지·피드백 버튼
- crop 제안: 단순 crop만으로 상단 alert와 개발 환경을 모두 제거하기 어려워 clean 재캡처 우선
- 위험: localhost, Bandicam, alert의 localhost 문구, 업로드 이미지 권리
- Owner 확인: 같은 상태를 browser chrome·alert·계정 정보 없이 재캡처할 수 있는지, 표지판 이미지 사용 권리
- 권장 production 이름: `cover.webp`

### 2순위: animated GIF의 90% 지점, 약 `6.42s`

- 원본: `videos/263704183-d9e78da4-732d-4f06-8a29-d00c654763cd.gif`
- 장면: 주행 장면 위에 “교통표지판 인식 AI 웹서비스” 설명이 표시됨
- 원본 크기: `800×407`
- 16:9 crop 제안: `x=64`, `y=29`, `width=672`, `height=378`; 실제 crop은 하지 않음
- 카드 가독성: 중간. 작은 본문은 카드에서 읽기 어려우나 서비스 정체성은 보임
- 위험: localhost browser UI, 자동차·도로 footage와 그래픽 권리, GIF 자체 9.56MiB
- Owner 확인: 영상·로고 제작자와 사용 동의, browser UI 없는 원본 export 존재 여부
- 권장 production 이름: `service-intro-poster.webp`

### 3순위: `images/VideoCapture_20231108-170100.jpg`

- 장면: 여러 교통표지판과 선택 상태가 있는 이미지 관리 grid
- 원본 크기: `1920×1080`, 이미 16:9
- 카드 가독성: 중간. 이미지 grid는 보이지만 작은 관리 UI text는 축소 시 읽기 어려움
- 유지 영역: 중앙 이미지 grid와 선택 상태
- crop 제안: browser chrome과 계정 header를 제외한 clean 재캡처가 우선이며 현 원본의 단순 crop은 권장하지 않음
- 위험: 계정명, localhost, Bandicam, 교통표지판 이미지 권리
- Owner 확인: 이미지 source와 안전한 dummy data로 재캡처 가능 여부
- 권장 production 이름: `image-management.webp`

## 10. Gallery 후보와 순서

Cover 1순위를 선택한다는 전제이며 같은 원본은 중복하지 않았다. 다섯 후보 모두 현재는 `Redaction Required`다.

| 순서 | 원본                   | 장면                | 기능 설명                               | 공개 전 조치                                        | 권장 파일명                 |
| ---: | ---------------------- | ------------------- | --------------------------------------- | --------------------------------------------------- | --------------------------- |
|    1 | `170206.jpg`           | Upload              | 교통표지판형 CLICK 버튼으로 업로드 시작 | browser chrome·계정명 없는 재캡처, 그래픽 권리 확인 | `upload-entry.webp`         |
|    2 | `170610.jpg`           | Feedback Statistics | 오류 유형별 누적 피드백 막대그래프      | 계정명·localhost 제거, 통계 공개 승인               | `feedback-statistics.webp`  |
|    3 | `170658.jpg`           | Q&A List            | 공지·답변 상태, 검색과 pagination       | 작성자·게시물 dummy data 재캡처                     | `qna-list.webp`             |
|    4 | `170100.jpg`           | Image Management    | 이미지 grid와 선택·관리 상태            | 계정명 제거, 표지판 이미지 권리 확인                | `image-management.webp`     |
|    5 | animated GIF 90% frame | Main                | 서비스 정체성과 인트로                  | browser UI 없는 원본, 팀·제3자 권리 확인            | `service-intro-poster.webp` |

## 11. 추천 alt 초안

- `cover.webp`: 업로드한 우회전 교통표지판과 RoadScanner의 인식 결과를 나란히 보여 주는 화면
- `upload-entry.webp`: 교통표지판 모양의 버튼으로 이미지 업로드를 시작하는 RoadScanner 화면
- `feedback-statistics.webp`: 인식 결과 피드백 오류 유형별 누적 건수를 막대그래프로 보여 주는 화면
- `qna-list.webp`: 공지와 답변 상태, 검색과 페이지네이션을 제공하는 RoadScanner Q&A 목록
- `image-management.webp`: 여러 교통표지판 이미지와 선택 상태를 격자로 보여 주는 이미지 관리 화면
- `service-intro-poster.webp`: 주행 장면 위에 RoadScanner 로고와 교통표지판 인식 AI 웹서비스 설명을 표시한 인트로

alt는 clean 재캡처·crop 이후 실제 남은 정보에 맞춰 다시 승인해야 한다.

## 12. Video 후보와 핵심 timestamp

MP4의 frame을 확인하지 못했으므로 실제 Video 후보는 아직 0개다. `파일인식.mp4`, `데이터통계.mp4`, `답변CRUD.mp4`는 파일명상 우선 검수 queue로만 기록하며 후보 선정이나 장면 분류로 간주하지 않는다.

animated GIF는 직접 확인한 대체 animation 후보다.

| 지점 | timestamp | 확인한 장면                       |
| ---: | --------: | --------------------------------- |
|  10% |     0.75s | 도로 위 차량과 RoadScanner logo   |
|  30% |     2.17s | 차량·교통표지판 인식 motif와 logo |
|  50% |     3.58s | 차량 내부 시점과 logo             |
|  70% |     5.00s | 야간 주행 차량과 logo             |
|  90% |     6.42s | 서비스 설명 text overlay          |

권장 poster는 1순위 `6.42s`, 2순위 `5.00s`지만 민감·권리 위험 때문에 poster 파일은 저장하지 않았다.

## 13. 영상 production 제안

- MP4 장면 검수와 Owner 승인 후 핵심 기능 하나당 최대 10~15초로 제한한다.
- source의 H.264를 무조건 재사용하지 말고 민감 frame과 앞뒤 불필요 구간을 먼저 확정한다.
- 승인 후 MP4 H.264, `yuv420p`, `faststart`, 시각 품질 기준 CRF 22~24를 검토한다.
- WebM VP9 또는 AV1은 선택 사항이다.
- audio track이 모두 있으므로 공개본은 audio 내용을 먼저 확인하고 기본 `muted` 또는 audio 제거를 권장한다.
- UI 속성: `controls`, `playsinline`, `preload="metadata"`; autoplay 금지, loop는 짧은 단일 기능 시연에만 검토한다.
- 권장 경로: `public/videos/projects/roadscanner/`
- 후보 파일명은 시각 검수 뒤 `recognition-flow.mp4`, `feedback-statistics.mp4`, `qna-answer-flow.mp4`처럼 기능 기준으로 확정한다.

## 14. 권장 production 경로

아직 생성하지 않은 제안 경로다.

- Cover와 gallery: `public/images/projects/roadscanner/`
- Video: `public/videos/projects/roadscanner/`
- 검토 문서: `docs/media-review/roadscanner/`

이번 단계에서는 `public` 추가, WebP 변환, video 변환과 frontmatter 연결을 하지 않았다.

## 15. 검토 자료

- [Safe/Review 이미지 contact sheet](media-review/roadscanner/contact-sheets/images-overview.jpg): 대상 0개임을 표시한 보호용 sheet
- [영상 metadata overview](media-review/roadscanner/contact-sheets/videos-overview.jpg): frame 없이 13개 MP4 metadata와 검수 대기 상태 표시
- [preview 보호 기록](media-review/roadscanner/previews/README.md)
- [poster 보호 기록](media-review/roadscanner/posters/README.md)

검토 자료에는 개인정보가 보이는 원본·thumbnail·frame을 포함하지 않았다.

## 16. Owner 승인 체크리스트

- [ ] Cover 원본 승인
- [ ] Cover clean 재캡처 또는 crop 방향 승인
- [ ] Gallery 원본 승인
- [ ] Gallery 순서 승인
- [ ] Video 사용 여부 승인
- [ ] MP4 frame 추출 도구 사용 또는 별도 contact sheet 제공 승인
- [ ] Video 공개 구간 승인
- [ ] Poster 승인
- [ ] 개인정보 없음 확인
- [ ] 비식별화 대상 확인
- [ ] 팀 이미지·UI·로고 사용 동의 확인
- [ ] 제3자 교통표지판 이미지와 자동차·도로 footage 권리 확인
- [ ] 파일명 승인
- [ ] alt 승인
- [ ] WebP 설정 승인
- [ ] 영상 인코딩·audio 설정 승인
- [ ] frontmatter 연결 승인
- [ ] `draft` 상태 별도 승인

위 항목은 아직 승인되지 않았으며 완료로 체크하지 않는다.

## 17. Phase 4C-3.1 비식별화 검토 결과

- 허용된 JPG 5개와 animated GIF 1개만 읽어 검토용 결과 8개를 `docs/media-review/roadscanner/revision-2/`에 생성했다.
- 원본 43개의 SHA-256을 기존 inventory와 다시 비교했으며 불일치가 없다. 원본 수정·복사와 `public` 추가도 없다.
- Safe Review Candidate는 Feedback Statistics와 Q&A List 2개다. 이는 기술적 비식별화 검토 등급이며 production 승인이나 권리 승인이 아니다.
- Rights Review Required는 Cover 2개, Upload, Image Management, GIF 5.00초 frame의 5개다.
- GIF 6.42초 frame은 미확인 정량 성능 문구 때문에 Further Redaction Required이며 최종 poster 후보에서 제외했다.
- `ffmpeg`, `ffprobe`, Python OpenCV, `imageio`, `imageio-ffmpeg`가 없어 MP4 frame과 contact sheet는 0개다. 우선 MP4 3개를 포함한 13개 모두 시각 검수가 미완료다.
- MP4 13개는 audio track 존재와 duration만 확인됐고 실제 음성·음악·시스템 소리·무음 여부는 Unknown이다.
- 팀 UI·로고, 교통표지판·데이터셋 이미지, GIF 그래픽과 자동차·도로 footage 권리는 모두 Pending이다.
- 상세 crop, 마스크, 후보 순서와 alt는 [Phase 4C-3.1 비식별화·영상 검토](roadscanner-media-redaction-review.md)에 기록했다.

Owner는 기존 체크리스트에 더해 Cover crop, Statistics 수치, Q&A 마스킹, GIF 5.00초 poster와 추후 MP4 frame·audio 검수를 승인해야 한다. production, frontmatter, `draft`와 `featured` 항목은 완료 처리하지 않는다.
