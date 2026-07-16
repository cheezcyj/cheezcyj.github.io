# Asset Preservation Report

## 작업 범위

- 브랜치: `redesign/astro-v0`
- 범위: migration Phase 3 — asset preservation
- 수행일: 2026-07-16
- 제외: 콘텐츠 컬렉션, 목록·상세 페이지, 실제 프로젝트 데이터, Jekyll 제거, favicon/OG 제작, 배포 전환

## 보존한 자산과 URL

기존 Jekyll 원본 9개를 삭제·이동·변환하지 않고 Astro `public`에 바이트 그대로 복사했다.

| 원본                          | public 복사본                        | 보존 URL                       |
| ----------------------------- | ------------------------------------ | ------------------------------ |
| `img/profile.png`             | `public/img/profile.png`             | `/img/profile.png`             |
| `img/profile2.png`            | `public/img/profile2.png`            | `/img/profile2.png`            |
| `img/portfolio/cabin.png`     | `public/img/portfolio/cabin.png`     | `/img/portfolio/cabin.png`     |
| `img/portfolio/cake.png`      | `public/img/portfolio/cake.png`      | `/img/portfolio/cake.png`      |
| `img/portfolio/circus.png`    | `public/img/portfolio/circus.png`    | `/img/portfolio/circus.png`    |
| `img/portfolio/game.png`      | `public/img/portfolio/game.png`      | `/img/portfolio/game.png`      |
| `img/portfolio/safe.png`      | `public/img/portfolio/safe.png`      | `/img/portfolio/safe.png`      |
| `img/portfolio/submarine.png` | `public/img/portfolio/submarine.png` | `/img/portfolio/submarine.png` |
| `screenshot.png`              | `public/screenshot.png`              | `/screenshot.png`              |

정적 빌드 후 `dist`에도 같은 9개 경로가 생성됐다. 로컬 preview에서 각 URL은 모두 HTTP 200과 `image/png`를 반환했으며 응답 크기는 manifest와 일치했다.

## Manifest 결과

- machine-readable manifest: `docs/asset-migration-manifest.json`
- human-readable manifest: `docs/asset-migration-manifest.md`
- legacy 보존 record: 9개
- v0 참조 전용 record: 17개
- record 필드: 원본·public 경로, URL, SHA-256, byte 크기, MIME type, width/height, source status, 참조 상태, 표시 안전성, notes
- 중복 public URL: 0
- 대소문자 무시 public 경로 충돌: 0
- manifest에서 누락된 legacy `img` 또는 `screenshot.png`: 0
- manifest에서 누락된 v0 public 이미지: 0

## SHA-256와 원본/복사본 비교

`pnpm verify:assets`가 legacy 원본, `public` 복사본과 manifest 값을 다시 계산했다.

- source/public SHA-256 일치: 9/9
- source/public byte 크기 일치: 9/9
- source/public MIME type 일치: 9/9
- source/public width·height 일치: 9/9
- public에 복사된 v0 sample SHA-256: 0건

이미지는 최적화, 압축, resize, format 변환을 하지 않았다.

## Legacy placeholder 판정

다음은 `LICENCE`의 Start Bootstrap 계열 MIT 라이선스, legacy frontmatter의 `client: Start Bootstrap`과 placeholder 문구, 실제 이미지 검토를 근거로 `legacy-template-placeholder`로 분류했다.

- `profile.png`, `profile2.png`
- `cabin.png`, `cake.png`, `circus.png`, `game.png`, `safe.png`, `submarine.png`

URL 호환 때문에 public 복사본은 유지하지만 `safeToDisplay: false`이며 새 홈·목록·상세 콘텐츠에 노출하면 안 된다. `screenshot.png`는 `documentation-baseline`으로 분류하고 역시 새 콘텐츠에는 노출하지 않는다.

실제 frontmatter 기준으로 post 5는 `submarine.png`, post 6은 `safe.png`를 참조한다. 이전 inventory 표의 두 항목 설명과 다른 부분은 새 manifest에 실제 원본 기준으로 기록했다.

## v0 sample assets

`../cheezcyj-blog-redesign/public`의 이미지 17개를 해시와 참조 위치까지 기록했지만 Astro `public`에는 복사하지 않았다.

- 샘플 design/project 이미지: 8개
- v0 icon 후보: 4개
- placeholder 이미지: 5개

모두 `v0-sample-placeholder`, `safeToDisplay: false`다. 원본 v0 저장소는 변경하지 않았다.

## 공개 사용 가능한 자산과 owner 검토

현재 owner 승인 근거가 있는 `verified-user-asset` 또는 `approved-brand-asset` 이미지는 없다. 다음 항목은 owner 검토가 필요하다.

- 실제 profile/About 이미지
- 실제 design/project cover와 gallery
- 최종 favicon과 Apple touch icon
- 기본 OG 이미지
- 기존 legacy URL을 장기 유지할지 여부

따라서 Phase 4에서 template·v0 sample을 실제 작품 이미지처럼 공개하지 않는 draft/sourceStatus gate가 필요하다.

## Favicon·OG TODO

후보 경로만 문서화했고 파일은 생성하지 않았다.

- `public/favicon.svg`
- `public/favicon-32x32.png`
- `public/apple-touch-icon.png`
- `public/og/default.png`

BaseLayout은 현재 favicon과 `og:image` 없이도 빌드된다. 승인된 브랜드 자산이 제공된 뒤에만 위 경로와 metadata를 연결한다.

## 반응형 회귀 검증

Astro production preview에서 다음 viewport를 확인했다.

|     폭 | 결과                                                                |
| -----: | ------------------------------------------------------------------- |
|  320px | 모바일 헤더, Hero 줄바꿈, section·Footer 적층 정상; 넘치는 요소 0개 |
|  375px | 모바일 헤더와 Hero 유동형 크기 정상; 가로 overflow 없음             |
|  768px | 데스크톱 내비게이션으로 전환되고 햄버거 숨김                        |
| 1024px | Hero·section spacing과 Footer 정상                                  |
| 1280px | 최대 콘텐츠 폭과 좌우 여백 정상                                     |
| 1440px | 1280px 콘텐츠 container 유지, Header·Footer 정렬 정상               |

추가 확인:

- 모바일 메뉴 열기, body scroll lock, 본문 inert 처리
- 첫 focus를 닫기 버튼으로 이동
- 마지막 링크에서 Tab 시 닫기 버튼으로 순환
- Escape 종료와 햄버거 버튼 focus 복귀
- 스킵 링크 focus 표시와 2px outline
- 테스트 환경의 `prefers-reduced-motion: reduce`에서 spotlight 숨김
- 브라우저 console error/warning 0건

320px에서 `documentElement.clientWidth`는 세로 스크롤바를 제외한 305px로 보고됐지만 body width와 `window.innerWidth`는 320px였고, viewport 밖으로 나간 요소는 0개였다. 실제 가로 스크롤 문제는 아니다.

## 실행 명령과 결과

- `pnpm verify:assets`: 성공 — legacy 9개 무결성, v0 17개 제외, URL/대소문자 충돌 0
- `pnpm check`: 성공 — 13개 파일, 오류 0, 경고 0, 힌트 0
- `pnpm build`: 성공 — `/index.html` 1개와 보존 자산 9개 생성
- `pnpm format:check`: 최종 문서 작성 후 실행
- local preview URL 검사: 9/9 HTTP 200

`astro check` dependency optimization 단계에서 Astro 내부 optional dependency에 대한 Vite 경고 3개가 출력됐지만, 최종 진단 결과는 오류 0·경고 0이며 빌드와 관련된 실패는 없었다.

## 원본 보호 상태

- 기존 `img/**`, `screenshot.png`, `_posts/**`, `_includes/**`, `_layouts/**`, Jekyll config/workflow: 수정·삭제·이동 없음
- `main`, `legacy-jekyll`: 수정 없음
- `../cheezcyj-blog-redesign`: 수정 없음
- push, merge, PR, 배포: 수행하지 않음

## Phase 4 진입 가능 여부

Phase 3의 URL·바이트 보존 gate는 통과했으므로 Phase 4의 콘텐츠 컬렉션 schema와 draft migration 작업에 진입할 수 있다. 다만 실제 이미지 공개는 owner가 진짜 profile과 작품 자산을 제공·승인할 때까지 차단해야 한다. Phase 4에서는 manifest의 `sourceStatus`, `safeToDisplay`, `legacyUrls`를 공개 gate로 사용한다.
