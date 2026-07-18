# Phase 4C-4 RoadScanner production 미디어 연결

- 작성일: 2026-07-18
- 대상 브랜치: `redesign/astro-v0`
- 콘텐츠 상태: `draft: true`, `featured: false`, `sourceStatus: verified`
- 변환 도구: Sharp 0.35.3
- WebP 설정: `quality: 90`, `effort: 6`

## 1. 승인된 최종 이미지

Owner가 갤러리 검토본 세 장과 RoadScanner GIF 첫 프레임을 production 변환 대상으로 승인했다. 최초 승인 Cover였던 context crop JPEG는 이후 Owner 요청에 따라 GIF 첫 프레임으로 교체했다.

1. Cover: `263704183-d9e78da4-732d-4f06-8a29-d00c654763cd.gif` 첫 프레임
2. Gallery 1: `videocapture-20231108-170610-redacted-review.jpg`
3. Gallery 2: `videocapture-20231108-170658-redacted-review.jpg`
4. Gallery 3: `videocapture-20231108-170206-redacted-review.jpg`

원본 GIF는 저장소 밖 로컬 source 폴더에 그대로 유지했으며 수정·이동·Git 추적하지 않았다. 갤러리 검토 JPEG는 `.git/info/exclude`의 로컬 전용 규칙을 유지했다. Production에는 원본 GIF나 JPEG를 복사하지 않고 승인 source로부터 인코딩한 정지 WebP 네 장만 추가했다.

## 2. 제외된 이미지와 미디어

- 교체 전 Cover `videocapture-20231108-170028-context-crop-preview.jpg`
- 기능 중심 Cover 대안 `videocapture-20231108-170028-function-crop-preview.jpg`
- 조건부 Image Management `videocapture-20231108-170100-redacted-review.jpg`
- GIF animation 전체(첫 프레임만 Cover 정지 이미지로 사용)
- MP4 전체

제외 후보는 `public`에 복사하거나 frontmatter에 연결하지 않았다. `video`와 `poster` 필드도 추가하지 않았다.

## 3. Production 파일명과 source 매핑

| 용도      | 승인 source                                                                                                   | Production output                                             |
| --------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Cover     | `../roadscanner-media-source/videos/263704183-d9e78da4-732d-4f06-8a29-d00c654763cd.gif` 첫 프레임             | `public/images/projects/roadscanner/cover.webp`               |
| Gallery 1 | `docs/media-review/roadscanner/revision-2/redacted-previews/videocapture-20231108-170610-redacted-review.jpg` | `public/images/projects/roadscanner/feedback-statistics.webp` |
| Gallery 2 | `docs/media-review/roadscanner/revision-2/redacted-previews/videocapture-20231108-170658-redacted-review.jpg` | `public/images/projects/roadscanner/qna-list.webp`            |
| Gallery 3 | `docs/media-review/roadscanner/revision-2/redacted-previews/videocapture-20231108-170206-redacted-review.jpg` | `public/images/projects/roadscanner/upload-entry.webp`        |

새 crop, 확대, 추가 마스크와 색상 변경 없이 source dimensions와 비율을 유지했다. Cover는 GIF 첫 프레임만 정지 WebP로 인코딩했고 animation 자체는 public에 추가하지 않았다. Sharp 기본 동작으로 source metadata를 production WebP에 복사하지 않았다.

## 4. 출력 metadata

| 파일                       | Dimensions |     용량 | SHA-256                                                            |
| -------------------------- | ---------- | -------: | ------------------------------------------------------------------ |
| `cover.webp`               | 800×407    | 60,976 B | `b20d701f546a3541ed4269e41103a1ccb0042cca227bacc9757e677176e0cf46` |
| `feedback-statistics.webp` | 1920×964   | 27,468 B | `dfb9309f1416d9b803f4bfaa3ebc6bf8e617d09e984c5981a5be132a77de59a2` |
| `qna-list.webp`            | 1920×964   | 36,504 B | `e59fbbe09b00e8fadbc02bb4075139d420a9038a80cfbc95ab906a8577a9e6c9` |
| `upload-entry.webp`        | 1920×964   | 26,568 B | `4ad0e17cf93f63f21c205ae5ec9cb21a09b3f855fa4c93a9d70e3bac3b7c9882` |

네 파일 모두 MIME `image/webp`, 비어 있지 않은 파일, 설정과 일치하는 dimensions로 확인했다. Cover WebP를 원본 크기로 열어 GIF 첫 프레임과 시각적으로 일치하는지 확인했다. 갤러리 WebP도 승인 검토본의 crop·불투명 마스크가 유지되고 추가 왜곡이 없는지 확인했다.

## 5. Frontmatter 연결 결과

`src/content/projects/roadscanner.md`에 다음을 연결했다.

- Cover: `/images/projects/roadscanner/cover.webp`, `800×407`
- Gallery 1: `/images/projects/roadscanner/feedback-statistics.webp`, `1920×964`
- Gallery 2: `/images/projects/roadscanner/qna-list.webp`, `1920×964`
- Gallery 3: `/images/projects/roadscanner/upload-entry.webp`, `1920×964`
- 각 항목의 화면 내용에 맞는 비어 있지 않은 한국어 alt

Cover alt는 차량, 전방 감지 카메라 그래픽과 RoadScanner 로고가 보이는 시작 화면을 설명하도록 교체했다. `draft: true`, `featured: false`, `sourceStatus: verified`, `status: completed`, 기간, 역할, stack, 저장소 URL과 highlights는 유지했다.

## 6. UI 검증 결과

Codex 인앱 브라우저의 실제 `window.innerWidth`를 각각 320, 375, 768, 1024, 1280, 1440으로 맞춘 뒤 홈, `/projects/`, `/projects/roadscanner/`의 18개 조합을 검수했다.

- 홈 project rail과 `/projects/` 카드에서 RoadScanner Draft Preview와 새 Cover가 표시됨
- 개발 환경 상세 페이지에서 새 Cover와 Gallery 세 장이 지정 순서로 표시됨
- 모든 조합에서 깨진 이미지 0, 빈 alt 0, document 가로 overflow 0
- Cover의 실제 로드 dimensions는 800×407, Gallery는 각각 1920×964
- 320과 1440에서 페이지 끝까지 스크롤해 지연 로딩 Gallery 세 장의 `complete`와 `naturalWidth`를 확인
- Console error 0

Production 파일은 원본 비율을 유지한다. 기존 Cover UI는 16:9 프레임을 사용하므로 화면에서는 `object-fit` 기반으로 프레임 가장자리가 일부 잘릴 수 있지만 픽셀 비율이 늘어나거나 찌그러지지는 않는다.

## 7. 자동 검증 결과

| 명령                  | 결과                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------- |
| `pnpm format:check`   | 성공                                                                                  |
| `pnpm check`          | 성공, Astro 진단 0 errors / 0 warnings / 0 hints                                      |
| `pnpm verify:assets`  | 성공, legacy 9, SHA-256 mismatch 0, duplicate/collision 0                             |
| `pnpm verify:media`   | 성공, 승인 프로젝트 2, WebP 8, missing/MIME/dimensions/hash/frontmatter/sample 오류 0 |
| `pnpm verify:content` | 성공, content entries 2, published entries 0, URL/placeholder/date 오류 0             |
| `pnpm build`          | 성공, 정적 페이지 6개 생성                                                            |
| `git diff --check`    | 성공                                                                                  |

`verify:media`는 이번 로컬 검증에서 승인 source 네 장과 production 출력의 결정적 변환 결과를 모두 대조했으며 local source mapping skip은 0이었다. RoadScanner source는 Git에 포함하지 않는 로컬 전용 자료이므로, source가 없는 CI에서는 config에 고정한 승인 SHA-256으로 production WebP를 검증하고 source 대조만 명시적으로 건너뛴다. 기존 첫 프로젝트의 source 대조는 계속 필수다.

제한된 실행 환경의 첫 build는 esbuild child process의 `spawn EPERM`으로 중단됐고, 동일 명령을 허용된 실행 환경에서 다시 실행해 성공했다. 빈 `design`, `study`, `posts` 컬렉션 경고는 기존 Phase 4A foundation 상태이며 build 실패가 아니다.

Build 결과 `dist/images/projects/roadscanner/`에는 WebP 네 장이 복사됐고 `dist/projects/roadscanner/index.html`은 생성되지 않았다.

## 8. 기존 프로젝트 보존 확인

기존 CHEEZCYJ Portfolio Redesign production WebP 네 장의 SHA-256은 변경 전 기준과 일치한다.

- `cover.webp`: `5c22317a49eb91e37a76a019d10b323a218bf8d595fb2dd3f31f4bda57397108`
- `mobile-navigation.webp`: `0dafad15070cb6c4aa86565e09db07a36d5f922b1f8ad5c52d22c23601569f5b`
- `project-detail-mobile.webp`: `3b5e031d215b652ba9d41d88c124d3e3ad82c3f452cdc2b8f44caac355e88432`
- `project-rail-desktop.webp`: `35a88b0c404991e02e78279b1e80f96cd42e66fa602a42489d5cdd59a9579e85`

## 9. Draft와 production 공개 상태

RoadScanner는 계속 `draft: true`다. 개발 환경에서는 카드와 상세 preview가 보이지만 production query와 상세 static route에서는 제외한다. WebP는 root-relative public 자산이므로 build 시 `dist/images/projects/roadscanner/`에 복사되지만 콘텐츠 본문과 route 공개를 의미하지 않는다.

## 10. 공개 전 남은 단계

- RoadScanner `draft` 해제 여부에 대한 별도 Owner 승인
- `featured` 여부 별도 승인
- production 상세 route와 외부 링크 최종 검수
- main 병합·PR·Pages 배포에 대한 별도 승인

이번 단계에서는 `draft`, `featured`, source status를 변경하거나 영상 미디어를 추가하지 않았다.
