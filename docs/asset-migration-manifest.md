# Asset Migration Manifest

## 목적과 판정 기준

이 문서는 Phase 3에서 기존 Jekyll 자산 URL과 원본 바이트를 보존한 결과를 사람이 검토하기 위한 요약이다. 자동 검증의 기준 데이터는 [`asset-migration-manifest.json`](./asset-migration-manifest.json)이며, 각 파일의 전체 SHA-256, 크기, MIME type, 이미지 dimensions, 참조 상태와 공개 표시 가능 여부를 포함한다.

`LICENCE`는 Blackrock Digital LLC의 MIT License이며 기존 테마가 Start Bootstrap 계열임을 보여준다. 화면과 파일을 함께 검토한 결과, 두 profile 이미지와 여섯 portfolio 이미지는 실제 사용자 작품이 아니라 legacy template placeholder로 분류했다. URL 호환을 위해 복사하지만 새 Astro 홈이나 콘텐츠 카드에는 표시하면 안 된다.

## 보존한 legacy URL

| 원본                          | Astro public 복사본                  | 보존 URL                       |     크기 | dimensions | SHA-256         | 현재 참조                | 표시 안전성                        |
| ----------------------------- | ------------------------------------ | ------------------------------ | -------: | ---------: | --------------- | ------------------------ | ---------------------------------- |
| `img/profile.png`             | `public/img/profile.png`             | `/img/profile.png`             | 64,150 B |    256×256 | `0db85b699ed5…` | `_includes/header.html`  | 표시 금지 — template placeholder   |
| `img/profile2.png`            | `public/img/profile2.png`            | `/img/profile2.png`            | 10,284 B |    256×256 | `adb1ac7dd6ca…` | 참조 없음                | 표시 금지 — template placeholder   |
| `img/portfolio/cabin.png`     | `public/img/portfolio/cabin.png`     | `/img/portfolio/cabin.png`     | 36,514 B |    900×650 | `a9c98d4f3eb1…` | post 1 + legacy includes | 표시 금지 — template placeholder   |
| `img/portfolio/cake.png`      | `public/img/portfolio/cake.png`      | `/img/portfolio/cake.png`      | 17,068 B |    900×650 | `cb93eb47ec12…` | post 2 + legacy includes | 표시 금지 — template placeholder   |
| `img/portfolio/circus.png`    | `public/img/portfolio/circus.png`    | `/img/portfolio/circus.png`    | 27,984 B |    900×650 | `24c01c49032a…` | post 3 + legacy includes | 표시 금지 — template placeholder   |
| `img/portfolio/game.png`      | `public/img/portfolio/game.png`      | `/img/portfolio/game.png`      | 25,896 B |    900×650 | `db26a6e9308b…` | post 4 + legacy includes | 표시 금지 — template placeholder   |
| `img/portfolio/submarine.png` | `public/img/portfolio/submarine.png` | `/img/portfolio/submarine.png` | 24,330 B |    900×650 | `17fbf1108703…` | post 5 + legacy includes | 표시 금지 — template placeholder   |
| `img/portfolio/safe.png`      | `public/img/portfolio/safe.png`      | `/img/portfolio/safe.png`      | 19,240 B |    900×650 | `b982c53a51bb…` | post 6 + legacy includes | 표시 금지 — template placeholder   |
| `screenshot.png`              | `public/screenshot.png`              | `/screenshot.png`              | 64,347 B |   1377×686 | `c0951b378496…` | migration 문서           | 표시 금지 — documentation baseline |

모든 파일의 MIME type은 `image/png`이다. 원본은 삭제하거나 이동하지 않았고 복사본의 파일명·대소문자·바이트를 변경하지 않았다.

## 참조 위치

- `profile.png`: `_includes/header.html`에서 `/img/profile.png`로 직접 참조한다.
- portfolio 6개: `_posts/*.markdown`의 `img` frontmatter 값과 `_includes/portfolio_grid.html`, `_includes/posting_grid.html`, `_includes/modals.html`의 `/img/portfolio/` 조합으로 참조한다.
- `profile2.png`: 코드 참조가 없지만 외부 공유 가능성이 있는 기존 URL이므로 보존한다.
- `screenshot.png`: 마이그레이션 inventory와 시각 회귀 기준으로 기록되어 있다.
- 실제 post 5는 `submarine.png`, post 6은 `safe.png`를 참조한다. 기존 inventory 표의 두 항목 설명과 실제 frontmatter가 다른 부분은 이 manifest에서 원본 파일을 기준으로 바로잡았다.

## v0 reference assets — 복사하지 않음

아래 17개는 `../cheezcyj-blog-redesign/public`에만 남는다. 모두 `v0-sample-placeholder`, `safeToDisplay: false`이며 Astro `public` 대상이 아니다.

| 구분               | 파일                                           | v0 참조 상태            | 처리              |
| ------------------ | ---------------------------------------------- | ----------------------- | ----------------- |
| 샘플 디자인        | `design-analytics-dashboard-dark.png`          | `lib/portfolio-data.ts` | manifest에만 기록 |
| 샘플 디자인        | `design-aurora-banking-app-dark-ui.png`        | `lib/portfolio-data.ts` | manifest에만 기록 |
| 샘플 디자인        | `design-creative-studio-landing-page.png`      | `lib/portfolio-data.ts` | manifest에만 기록 |
| 샘플 디자인        | `design-editorial-magazine-website-layout.png` | `lib/portfolio-data.ts` | manifest에만 기록 |
| 샘플 디자인        | `design-skincare-brand-landing-page.png`       | `lib/portfolio-data.ts` | manifest에만 기록 |
| 샘플 개발          | `frontend-component-library-storybook.png`     | `lib/portfolio-data.ts` | manifest에만 기록 |
| 샘플 개발          | `frontend-kanban-board-app.png`                | `lib/portfolio-data.ts` | manifest에만 기록 |
| 샘플 개발          | `frontend-weather-dashboard-charts.png`        | `lib/portfolio-data.ts` | manifest에만 기록 |
| 샘플 icon          | `apple-icon.png`                               | `app/layout.tsx`        | manifest에만 기록 |
| 샘플 icon          | `icon.svg`                                     | `app/layout.tsx`        | manifest에만 기록 |
| 샘플 icon          | `icon-dark-32x32.png`                          | `app/layout.tsx`        | manifest에만 기록 |
| 샘플 icon          | `icon-light-32x32.png`                         | `app/layout.tsx`        | manifest에만 기록 |
| fallback           | `placeholder.svg`                              | 3개 v0 component        | manifest에만 기록 |
| 미사용 placeholder | `placeholder.jpg`                              | 참조 없음               | manifest에만 기록 |
| 미사용 placeholder | `placeholder-logo.png`                         | 참조 없음               | manifest에만 기록 |
| 미사용 placeholder | `placeholder-logo.svg`                         | 참조 없음               | manifest에만 기록 |
| 미사용 placeholder | `placeholder-user.jpg`                         | 참조 없음               | manifest에만 기록 |

자동 검증은 v0 원본 17개가 manifest에 모두 포함되는지 확인하고, 같은 SHA-256의 파일이 Astro `public` 아래에 존재하면 실패한다.

## 공개 사용 판정

- 현재 `approved-brand-asset` 또는 `verified-user-asset`으로 확정된 이미지: 없음
- URL 호환을 위해 public에서 제공하지만 새 UI에 표시하면 안 되는 이미지: legacy 9개 전부
- owner 검토가 필요한 항목: 실제 profile/소개 이미지, 실제 design/project cover, favicon, Apple touch icon, 기본 OG 이미지

## Favicon·OG TODO

아래 경로는 후보 이름만 예약하며 이번 Phase에서는 파일을 만들지 않는다.

- `public/favicon.svg`
- `public/favicon-32x32.png`
- `public/apple-touch-icon.png`
- `public/og/default.png`

실제 파일은 owner가 승인한 브랜드 자산이 있을 때 추가하고 manifest의 `approved-brand-asset`으로 별도 등록한다.
