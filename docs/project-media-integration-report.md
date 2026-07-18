# Phase 4B-4 프로젝트 미디어 연결 보고서

- 작성일: 2026-07-18
- 대상 브랜치: `redesign/astro-v0`
- 대상 프로젝트: `CHEEZCYJ Portfolio Redesign`
- 공개 상태: `draft: true`, `featured: false`, `sourceStatus: verified`

## 1. 승인 입력 PNG

모든 입력은 `docs/media-review/cheezcyj-portfolio-redesign/revision-2/`에 보존했다. 파일을 삭제하거나 덮어쓰지 않았다.

| 입력 파일                       | 용도       | 크기     | 파일 크기 |
| ------------------------------- | ---------- | -------- | --------- |
| `02-project-detail-desktop.png` | cover 원본 | 1440×900 | 168,233 B |
| `01-project-rail-desktop.png`   | gallery 1  | 1440×900 | 135,469 B |
| `03-mobile-menu-open.png`       | gallery 2  | 390×844  | 15,776 B  |
| `04-project-detail-mobile.png`  | gallery 3  | 390×844  | 93,060 B  |

Revision 1, Revision 2의 다른 이미지, v0/Jekyll 샘플 이미지와 외부 다운로드 이미지는 production 자산으로 사용하지 않았다. AI 이미지 생성도 수행하지 않았다.

## 2. Cover crop

`02-project-detail-desktop.png`에서 `x=80`, `y=90`, `width=1280`, `height=720`을 정확히 추출했다. 결과는 16:9 `1280×720`이며 확대, 회전, 비율 왜곡과 추가 합성을 하지 않았다.

## 3. WebP 변환 설정과 결과

`scripts/process-project-media.mjs`가 `scripts/project-media-config.mjs`의 고정 매핑을 읽는다. Sharp `0.35.3`, WebP `quality: 90`, `effort: 6`을 사용한다. 입력 PNG 형식과 크기를 먼저 검증하고, 각 출력의 경로·크기·바이트·MIME·SHA-256을 출력한다. 같은 명령을 반복하면 같은 파일과 해시가 생성된다.

| 출력 파일                    | 출력 경로                                                                       | 크기     | 파일 크기 | SHA-256                                                            |
| ---------------------------- | ------------------------------------------------------------------------------- | -------- | --------- | ------------------------------------------------------------------ |
| `cover.webp`                 | `public/images/projects/cheezcyj-portfolio-redesign/cover.webp`                 | 1280×720 | 25,404 B  | `5c22317a49eb91e37a76a019d10b323a218bf8d595fb2dd3f31f4bda57397108` |
| `project-rail-desktop.webp`  | `public/images/projects/cheezcyj-portfolio-redesign/project-rail-desktop.webp`  | 1440×900 | 28,322 B  | `35a88b0c404991e02e78279b1e80f96cd42e66fa602a42489d5cdd59a9579e85` |
| `mobile-navigation.webp`     | `public/images/projects/cheezcyj-portfolio-redesign/mobile-navigation.webp`     | 390×844  | 10,772 B  | `0dafad15070cb6c4aa86565e09db07a36d5f922b1f8ad5c52d22c23601569f5b` |
| `project-detail-mobile.webp` | `public/images/projects/cheezcyj-portfolio-redesign/project-detail-mobile.webp` | 390×844  | 20,288 B  | `3b5e031d215b652ba9d41d88c124d3e3ad82c3f452cdc2b8f44caac355e88432` |

실제 출력 네 장을 확인했으며 quality 90에서 UI 글자가 심하게 뭉개지거나 gradient banding이 증가하지 않아 92로 올리지 않았다. 모든 출력 MIME은 `image/webp`다.

## 4. Frontmatter 연결

`src/content/projects/cheezcyj-portfolio-redesign.md`에 cover 한 장과 승인 순서의 gallery 세 장을 연결했다. 각 항목은 root-relative `src`, 비어 있지 않은 한국어 `alt`, 실제 `width`와 `height`를 가진다. cover와 gallery에는 중복 경로가 없고 gallery 내부 경로도 모두 고유하다.

`draft: true`, `featured: false`, `sourceStatus: verified`, `status: in-progress`, `startedAt`, repository, tags, stack, roles와 highlights는 변경하지 않았다. `demoUrl`, `completedAt`, `slug`와 `legacyUrls`도 추가하지 않았다.

## 5. Projects schema와 publication 검증

프로젝트 전용 image metadata는 width와 height를 필수 positive integer로 검증하며 `gallery` 기본값은 빈 배열이다. 공통 publication policy에서 다음을 확인한다.

- root-relative media 경로
- 비어 있지 않은 alt
- positive integer width와 height
- gallery 내부 src 중복 금지
- cover와 gallery src 중복 금지
- placeholder asset 차단

`scripts/verify-content.mjs`는 실제 `public` 파일 존재와 Sharp로 읽은 실제 dimensions까지 frontmatter와 비교한다. 기존 design gallery schema와 동작은 변경하지 않았다.

## 6. 미디어 전용 검증

`scripts/verify-project-media.mjs`와 `pnpm verify:media`를 추가했다. 승인된 네 파일만 production 디렉터리에 있는지, 0 byte·MIME·크기·중복 hash·source mapping·frontmatter 경로·dimensions·alt를 검증한다. Owner review에 Revision 2와 `Draft Preview` 미노출 근거가 남아 있는지도 확인한다.

검증 결과:

- 승인 WebP: 4
- 누락 파일: 0
- 잘못된 MIME: 0
- dimension 불일치: 0
- 중복 hash: 0
- frontmatter media 불일치: 0
- 미승인 sample 파일: 0

## 7. ProjectCard cover 처리

기존 공통 `ProjectMedia.astro`가 frontmatter cover를 자동 렌더링하므로 프로젝트별 하드코딩 분기는 추가하지 않았다. 홈 rail과 `/projects/` 카드 모두 실제 `cover.webp`, alt와 고정 dimensions를 사용한다. 16:9 공간, lazy loading, `object-fit: cover`, 500ms 확대, focus 상태와 reduced-motion 규칙을 유지한다. cover가 없는 다른 프로젝트의 neutral fallback도 유지된다.

## 8. ProjectLayout gallery

상세 hero는 같은 공통 `ProjectMedia`로 승인 cover를 표시한다. 새 `화면 구성` gallery는 Markdown 본문 다음, 프로젝트 목록 복귀 footer 이전에 위치한다.

- 첫 desktop rail 이미지는 전체 너비
- 768px 이상에서 모바일 이미지 두 장을 2열로 배치
- 768px 미만에서 모든 이미지를 1열로 배치
- semantic `figure`와 `img`
- lazy loading, alt, 실제 width와 height 제공
- 원본 비율 유지, 강제 crop 없음
- 기존 border, radius와 surface token 사용
- modal, 클릭 확대와 추가 장식 프레임 없음

## 9. Heading hierarchy

layout의 프로젝트 제목이 유일한 `h1`이다. Markdown 첫 heading을 `# 프로젝트 개요`에서 `## 프로젝트 개요`로 바꿨고, 나머지 본문 문장과 section 내용은 변경하지 않았다. `주요 구현`, 본문 section과 gallery의 `화면 구성`은 `h2`, 기존 세부 구현은 `h3`를 유지한다.

## 10. Development QA

인앱 브라우저에서 `/`, `/projects/`, `/projects/cheezcyj-portfolio-redesign/`을 확인했다. viewport는 `320`, `375`, `390`, `768`, `1024`, `1280`, `1440px`를 사용했다.

| 검증 항목                          | 결과                             |
| ---------------------------------- | -------------------------------- |
| 홈 draft 카드 실제 cover           | 통과                             |
| `/projects/` draft 카드 실제 cover | 통과                             |
| 상세 cover와 gallery 3장           | 통과                             |
| 현재 프로젝트 fallback 표시        | 0건                              |
| 768px 미만 gallery                 | 1열                              |
| 768px 이상 gallery                 | 첫 이미지 전체 너비 + 모바일 2열 |
| 페이지 전체 가로 overflow          | 0                                |
| 상세 `h1`                          | 1개                              |
| 빈 alt                             | 0건                              |
| 깨진 이미지·404                    | 0건                              |
| Console error                      | 0건                              |

검수 전용 viewport override와 Astro devToolbar 선호도는 작업 후 원복했고 임시 개발 서버도 종료했다.

## 11. Production draft 차단

production build는 5개 공개 페이지만 생성했다. `draft: true` 프로젝트의 상세 route는 없고 홈·`/projects/` HTML, 생성된 JavaScript와 JSON에서 프로젝트 제목·설명·본문이 검색되지 않았다.

Owner가 공개를 승인한 정적 WebP 네 장은 `public` 자산이므로 동일 SHA-256으로 `dist/images/projects/cheezcyj-portfolio-redesign/`에 복사된다. `docs/media-review`의 검토 PNG는 `dist`에 포함되지 않는다.

## 12. 명령 검증

- `pnpm media:project-redesign`: 통과
- `pnpm format:check`: 통과
- `pnpm check`: 통과, Astro 진단 0 errors·0 warnings·0 hints
- `pnpm verify:assets`: 통과, legacy 9개 무결성 유지
- `pnpm verify:media`: 통과
- `pnpm verify:content`: 통과, scanned 1·published 0
- `pnpm build`: 통과
- `git diff --check`: 커밋 전 최종 확인

샌드박스 내부 build는 `esbuild` 자식 프로세스 실행이 `spawn EPERM`으로 차단됐고, 동일 명령을 허용된 로컬 환경에서 재실행해 통과했다. 비어 있는 design·study·posts 컬렉션 안내는 현재 콘텐츠 상태에 따른 기존 경고다.

## 13. 남은 공개 조건

다음은 Phase 4B-4에서 완료로 간주하지 않는다.

- 공개 가능한 정량 성과 승인
- `featured` 활성화 여부 결정
- `draft: false` 승인
- Linux 원격 CI 실행과 성공 확인
- GitHub Pages 배포
- main 병합
- 최종 공개 승인

원격 push, PR, merge와 배포를 수행하지 않았으므로 Linux CI 성공도 주장하지 않는다.
