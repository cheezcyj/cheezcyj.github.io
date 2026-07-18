# Phase 4C-3.1 RoadScanner 비식별화·영상 검토

- 작성일: 2026-07-18
- 대상 브랜치: `redesign/astro-v0`
- 원본: `C:\Users\user\Desktop\portfolio-workspace\roadscanner-media-source`
- 검토 산출물: `docs/media-review/roadscanner/revision-2/`
- 공개 상태: `draft: true`, `featured: false`, `sourceStatus: verified`

이 문서는 검토용 crop과 불투명 마스크 결과를 기록한다. 생성한 파일은 production 승인이 아니며 `public`, frontmatter, cover, gallery, video에 연결하지 않는다.

## 1. 처리한 원본

허용된 정적 원본만 읽었다.

- Cover: `images/VideoCapture_20231108-170028.jpg`
- Gallery: `images/VideoCapture_20231108-170206.jpg`, `170610.jpg`, `170658.jpg`
- 조건부 Gallery: `images/VideoCapture_20231108-170100.jpg`
- GIF: `videos/263704183-d9e78da4-732d-4f06-8a29-d00c654763cd.gif`

Exclude 범주의 원본은 처리하거나 복사하지 않았다. MP4는 decoder 확인만 했고 frame은 읽거나 생성하지 못했다.

## 2. 원본 보호 확인

- 원본 43개의 현재 SHA-256을 Phase 4C-3 inventory와 다시 대조했으며 불일치 0개다.
- 원본을 수정·이동·삭제하지 않았고 원본 폴더 안에 파일을 만들지 않았다.
- 원본 자체를 Git 저장소에 복사하지 않았다.
- 검토용 결과만 `docs/media-review/roadscanner/revision-2/` 아래에 저장했다.
- EXIF를 넘기지 않은 새 JPEG로 저장했으며 생성 결과의 metadata를 제거했다.
- 권리가 `Pending`인 JPEG 8개는 Owner 승인 전 Git index와 commit에서 제외하고 로컬 검토본으로만 유지한다. 생성 스크립트와 crop·mask·hash 기록은 문서로 남긴다.

## 3. 사용한 도구

- 정적 이미지·GIF: Python 3.12.13, Pillow 12.2.0
- 생성 도구: [`generate_redacted_reviews.py`](media-review/roadscanner/revision-2/reports/generate_redacted_reviews.py)
- 기록: [`redaction-manifest.json`](media-review/roadscanner/revision-2/reports/redaction-manifest.json)
- decoder 확인: [`decoder-check.json`](media-review/roadscanner/revision-2/reports/decoder-check.json)
- 사용하지 않음: blur, AI 생성, 인페인팅, 생성형 채우기, 가짜 데이터 합성

## 4. 생성한 비식별화 검토본

| ID                       | 검토본                                                                                                                              | 크기     | 등급                       |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- | -------- | -------------------------- |
| cover-context            | [`170028 context crop`](media-review/roadscanner/revision-2/proposed-crops/videocapture-20231108-170028-context-crop-preview.jpg)   | 1728×972 | Rights Review Required     |
| cover-function           | [`170028 function crop`](media-review/roadscanner/revision-2/proposed-crops/videocapture-20231108-170028-function-crop-preview.jpg) | 1440×810 | Rights Review Required     |
| gallery-statistics       | [`170610 redacted`](media-review/roadscanner/revision-2/redacted-previews/videocapture-20231108-170610-redacted-review.jpg)         | 1920×964 | Safe Review Candidate      |
| gallery-qna              | [`170658 redacted`](media-review/roadscanner/revision-2/redacted-previews/videocapture-20231108-170658-redacted-review.jpg)         | 1920×964 | Safe Review Candidate      |
| gallery-upload           | [`170206 redacted`](media-review/roadscanner/revision-2/redacted-previews/videocapture-20231108-170206-redacted-review.jpg)         | 1920×964 | Rights Review Required     |
| gallery-image-management | [`170100 redacted`](media-review/roadscanner/revision-2/redacted-previews/videocapture-20231108-170100-redacted-review.jpg)         | 1920×964 | Rights Review Required     |
| gif-poster-70            | [`GIF 5.00s`](media-review/roadscanner/revision-2/video-frames/263704183-d9e78da4-732d-4f06-8a29-d00c654763cd-frame-70.jpg)         | 688×387  | Rights Review Required     |
| gif-poster-90            | [`GIF 6.42s`](media-review/roadscanner/revision-2/video-frames/263704183-d9e78da4-732d-4f06-8a29-d00c654763cd-frame-90.jpg)         | 688×387  | Further Redaction Required |

사람이 원본 크기로 8개를 다시 확인했다. 계정명, 브라우저 chrome, `localhost`, Bandicam, Q&A 제목·작성자·내부 번호는 결과에 노출되지 않는다.

## 5. 각 검토본의 crop 좌표

좌표는 원본의 왼쪽 위를 `(0, 0)`으로 한 `x, y, width, height`다.

| 검토본                           | crop                  | 의도                                                         |
| -------------------------------- | --------------------- | ------------------------------------------------------------ |
| Cover 기능 중심                  | `160, 176, 1440, 810` | 16:9. 입력 표지판과 인식 결과에 집중                         |
| Cover 서비스 맥락                | `96, 96, 1728, 972`   | 16:9. 입력·결과·서비스 화면 구조를 더 넓게 유지              |
| Upload·Statistics·Q&A·Image 관리 | `0, 96, 1920, 964`    | 브라우저 탭·주소창·Bandicam을 위쪽 crop으로 제거             |
| GIF 5.00초·6.42초                | `56, 20, 688, 387`    | 약 16:9. GIF 바깥의 browser UI와 `localhost`를 crop으로 제거 |

## 6. 적용한 불투명 마스크 영역

모든 마스크는 원본 좌표 기준이며 확대·대비 조정으로 복원할 수 없는 완전 불투명 단색이다.

- 공통 로그인 영역: `1360, 96, 555, 81`, `#e3e3e3`
- alert/dialog: `710, 90, 500, 145`, `#ffffff`
- Upload 하단 browser status의 `localhost`: `0, 1028, 190, 32`, `#ffffff`
- Q&A 13개 행의 내부 번호: `x=306, width=112, height=27`
- Q&A 13개 행의 제목: `x=548, width=500, height=27`
- Q&A 13개 행의 작성자 식별값: `x=1040, width=220, height=27`
- Q&A 행 `y`: `374`부터 `830`까지 38px 간격

Cover와 Image Management의 alert 영역은 crop과 겹치는 부분만 결과에 남고, 그 부분을 단색으로 가렸다. GIF frame은 crop만으로 browser UI를 제거할 수 있어 마스크를 사용하지 않았다.

## 7. 남은 민감 정보

- 생성한 8개 검토본에서 육안으로 식별 가능한 개인정보·계정명·로컬 주소는 발견하지 못했다.
- Statistics에는 원래 집계 수치가 그대로 남아 있다. 개인정보로 보이지 않지만 공개 승인이 필요하다.
- Q&A는 제목·작성자·내부 번호를 모두 가렸고 검색·pagination·공지·답변 상태 구조만 남겼다.
- MP4 13개는 frame과 audio 내용을 확인하지 못했으므로 개인정보·계정·실제 서비스 데이터 위험이 `Unknown`이다.
- 권리 미확인 교통표지판 이미지, 로고, 팀 UI, 자동차·도로 footage는 개인정보와 별개의 공개 차단 사유다.

## 8. Cover 후보 1~2순위

1. `cover-context`: 입력과 인식 결과의 전체 맥락이 보이며 텍스트 잘림이 적다. 업로드 교통표지판과 팀 UI 권리가 `Pending`이므로 `Rights Review Required`다.
2. `cover-function`: 기능 초점이 강하고 16:9 카드에 적합하다. 오른쪽 설명 일부가 crop 경계에 가까우며 동일한 권리 확인이 필요하다.

두 후보 모두 기술적으로 비식별화됐지만 production 승인은 아니다.

## 9. Gallery 후보와 순서

1. Feedback Statistics — 차트 구조가 선명하다. 집계 수치 공개와 팀 UI 승인 대기.
2. Q&A List — 검색·pagination·상태 구조가 남아 있다. 마스킹 범위가 넓지만 기능 설명은 가능하며 Owner의 비식별화 승인 대기.
3. Upload — 업로드 진입과 CLICK 그래픽이 보인다. 그래픽 권리 승인 대기.
4. Image Management — grid·선택 상태가 보이는 조건부 후보. 교통표지판 이미지 권리 승인 전에는 Safe가 아니다.

Cover와 같은 `170028` 원본은 Gallery에서 중복 사용하지 않는다.

## 10. 제외 후보와 이유

- GIF 6.42초 frame은 `98%` 등 검증되지 않은 정량 성능 문구가 보여 poster·gallery 최종 후보에서 제외한다. 근거와 공개 승인을 받기 전에는 값 변경이나 마스킹으로 의미를 왜곡하지 않는다.
- GIF 5.00초 frame은 권리 검토용 대체 poster일 뿐 최종 Gallery에는 포함하지 않는다.
- MP4 13개는 frame 검수 미완료이므로 Cover·Gallery·Video 후보로 승격하지 않는다.
- Phase 4C-3의 Exclude 원본은 이번 단계에서 열거나 처리하지 않았다.

## 11. GIF poster 평가

- 5.00초, 실제 frame index 60: crop 후 browser UI와 `localhost`가 없다. 야간 도로·차량과 RoadScanner 로고가 남아 `Rights Review Required`다.
- 6.42초, 실제 frame index 77: crop은 가능하지만 도로 footage, 로고, 팀 그래픽 외에 검증되지 않은 학습·시험·정확도 문구가 남아 `Further Redaction Required`다.
- GIF 전체 변환이나 production animation은 만들지 않았다.

## 12. MP4 frame 추출 결과

지정된 순서로 확인했으나 `ffmpeg`, `ffprobe`, Python OpenCV, `imageio`, `imageio-ffmpeg`가 모두 없었다. 설치·다운로드 금지 조건에 따라 추출을 시도하지 않았다.

- MP4 frame: 0개
- MP4 contact sheet: 0개
- MP4 frame 검수: 미완료
- 필요 도구: 기존 `ffmpeg`/`ffprobe`, 또는 OpenCV `VideoCapture`나 `imageio-ffmpeg`가 준비된 Python 환경

GIF frame 2개는 MP4 검수 수에 포함하지 않는다.

## 13. MP4 영상별 장면 분류

| 우선순위 | MP4              | metadata                          | 실제 장면 분류 |
| -------: | ---------------- | --------------------------------- | -------------- |
|        1 | `파일인식.mp4`   | 10.496초, 1920×1080, H.264, 30fps | Unknown        |
|        2 | `데이터통계.mp4` | 8.320초, 1920×1080, H.264, 30fps  | Unknown        |
|        3 | `답변CRUD.mp4`   | 11.179초, 1920×1080, H.264, 30fps | Unknown        |

파일명은 검수 queue를 정하는 참고일 뿐 실제 장면의 근거로 사용하지 않는다. 나머지 MP4 10개의 metadata는 기존 inventory에 유지했으며 frame은 추출하지 않았다.

## 14. MP4 개인정보 위험

세 우선 MP4를 포함한 13개 모두 frame 미확인으로 다음 항목이 `Unknown`이다.

- 이메일·계정명·사용자 식별값
- Q&A 제목·작성자·본문
- 관리자·회원 데이터
- `localhost`, 브라우저 chrome, Bandicam
- 업로드 이미지와 제3자 자료

따라서 MP4는 공개 후보가 아니다.

## 15. MP4 audio 확인 상태

기존 metadata parser에서 MP4 13개 모두 audio track 1개와 각 영상 duration을 확인했다. 재생 decoder가 없어 음성, 개인정보가 포함된 음성, 음악, 시스템 소리, 사실상 무음 여부는 모두 `Unknown`이다. 추후 production 후보는 기본적으로 audio 제거를 권장한다.

## 16. Video 후보 0~2개

현재 Video 후보는 0개다. `파일인식.mp4`, `데이터통계.mp4`, `답변CRUD.mp4`는 우선 검수 queue일 뿐 후보가 아니다. 10%·30%·50%·70%·90% frame과 audio 검수 후 최대 2개만 다시 선정한다.

## 17. 권리 확인 상태

| 대상                               | 상태    |
| ---------------------------------- | ------- |
| 8인 팀 UI 디자인과 화면            | Pending |
| RoadScanner 로고                   | Pending |
| 업로드 교통표지판 이미지           | Pending |
| Image Management의 데이터셋 이미지 | Pending |
| 자동차·도로 footage                | Pending |
| GIF 그래픽과 영상                  | Pending |
| 다른 팀원이 캡처·제작한 화면       | Pending |

파일 존재와 Owner의 원본 제공 사실만으로 공개 권리나 팀 동의를 승인하지 않았다.

## 18. 권장 production 파일명

아직 생성하지 않은 제안이다.

- Cover: `recognition-result-context.webp`, 대안 `recognition-result-function.webp`
- Gallery: `feedback-statistics.webp`, `qna-list.webp`, `upload-entry.webp`, `image-management.webp`
- GIF poster 대안: `service-intro-poster.webp`
- Video 재검수 후: `recognition-flow.mp4`, `feedback-statistics.mp4`, `qna-answer-flow.mp4`

## 19. alt 초안

- Cover context: 업로드한 우회전 교통표지판과 RoadScanner의 인식 결과를 서비스 화면 안에서 나란히 보여 주는 화면
- Cover function: 업로드한 교통표지판과 인식된 표지판 이름·결과를 중심으로 보여 주는 화면
- Feedback Statistics: 인식 결과 피드백의 오류 유형별 누적 건수를 막대그래프로 보여 주는 화면
- Q&A List: 실제 제목과 작성자 정보를 가리고 검색·답변 상태·페이지네이션 구조를 보여 주는 Q&A 목록
- Upload: 교통표지판 모양 CLICK 버튼으로 이미지 업로드를 시작하는 화면
- Image Management: 교통표지판 이미지와 선택 상태를 격자로 보여 주는 관리 화면
- GIF 5.00초: 야간 도로를 달리는 차량 위에 RoadScanner 로고가 표시된 서비스 인트로

## 20. 영상 구간 제안

- GIF poster는 권리 승인 시 5.00초 frame만 우선 검토한다. 6.42초 frame은 정량 문구 근거가 확인될 때까지 제외한다.
- MP4는 frame 미확인으로 시작·종료 timestamp를 제안하지 않는다.
- decoder가 준비되면 우선 3개의 10%·30%·50%·70%·90% frame을 검수하고, 승인 장면은 기능당 최대 10~15초로 제한한다.
- 공개본은 audio 제거, H.264 `yuv420p`, `faststart`, `controls`, `playsinline`, `preload="metadata"`를 기본 제안하며 autoplay는 사용하지 않는다.

## 21. Owner 승인 체크리스트

- [ ] Cover 검토본 승인
- [ ] Cover crop 승인
- [ ] Gallery 검토본 승인
- [ ] Gallery 순서 승인
- [ ] 마스킹 범위 승인
- [ ] 통계 수치 공개 승인
- [ ] Q&A 비식별화 승인
- [ ] 교통표지판 이미지 권리 확인
- [ ] 팀 UI·로고 사용 동의 확인
- [ ] GIF·도로 footage 권리 확인
- [ ] Video 사용 여부 승인
- [ ] Video 공개 구간 승인
- [ ] audio 제거 승인
- [ ] 파일명과 alt 승인
- [ ] production 변환 승인
- [ ] frontmatter 연결 승인
- [ ] draft 상태 별도 승인
