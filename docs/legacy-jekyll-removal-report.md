# Jekyll 런타임 제거 및 rollback 보고서

- 작성일: 2026-07-19
- 작업 브랜치: `redesign/astro-v0`
- 제거 전 feature HEAD: `29889a57d5308fd164e552c1145add6c5ffccc4e`
- 원격 rollback 브랜치: `origin/legacy-jekyll`
- rollback SHA: `63b397e42164bac6d50149c14b7901da5a67e42d`

## 1. 원격 rollback snapshot

`legacy-jekyll`을 checkout하거나 수정하지 않고 기존 Jekyll main SHA를 같은 이름의 원격 브랜치로 일반 push했다. GitHub API와 `git ls-remote`에서 원격 ref가 정확한 rollback SHA를 가리키는지 확인했다.

원격 snapshot에는 `_config.yml`, `_layouts/default.html`, `freelancer-theme-jekyll.gemspec`, `_includes/modals.html`, 기존 여섯 post, 자산과 라이선스가 보존돼 있다. rollback 브랜치 push는 workflow와 Pages production 배포를 시작하지 않았다.

## 2. 조사 범위

기존 Jekyll 대상 67개와 다음 실행·보존 경로를 대조했다.

- `src/**`, `public/**`, `scripts/**`
- `package.json`, `astro.config.mjs`
- `.github/workflows/**`
- `docs/migration-inventory.md`, `docs/migration-plan.md`
- `docs/asset-preservation-report.md`, `scripts/verify-assets.mjs`

Jekyll runtime 후보는 53개였다. 이 중 31개는 기존 inventory의 `REMOVE_AFTER_VERIFY`이고, 22개는 과거 `MIGRATE` 또는 `REPLACE`였다.

## 3. 제거한 파일

총 51개를 제거했다.

### 기존 REMOVE_AFTER_VERIFY 31개

- CI·Ruby: `.travis.yml`, `Gemfile`, `Rakefile`, `freelancer-theme-jekyll.gemspec`
- 미사용 include 6개: About·contact partial, Bootstrap CSS, Disqus script
- Font Awesome CSS·font 10개
- Bootstrap·jQuery·contact 등 구형 JavaScript 10개
- GitHub Pages에서 실행되지 않는 `mail/contact_me.php`

### migration 또는 replacement 완료 뒤 제거한 20개

- Jekyll 설정과 진입점: `_config.yml`, `index.html`, `style.css`
- layout: `_layouts/default.html`, `_layouts/style.css`
- Astro component·script로 대체된 include 8개
- 본문이 없는 Start Bootstrap placeholder post 6개
- Astro TypeScript 상호작용으로 대체된 `js/freelancer.js`

위 20개는 원래 `MIGRATE` 또는 `REPLACE`였지만 다음 조건을 모두 확인해 제거 가능 상태로 재분류했다.

- 역할이 Astro config, layout, component, content policy와 TypeScript로 대체됨
- 현재 Astro 실행·검증 경로의 참조가 0건임
- placeholder post 6개에는 실제 본문이 없음
- 기존 이미지 URL과 바이트는 `public` 및 원본 보존 source로 유지됨
- 원본 전체가 원격 rollback snapshot에 보존됨

## 4. 유지한 legacy 자산

다음 원본 9개와 같은 바이트의 `public` 복사본 9개를 유지했다.

- `img/profile.png`, `img/profile2.png`
- `img/portfolio/*.png` 6개
- `screenshot.png`

`scripts/verify-assets.mjs`는 root 원본과 `public` 복사본을 함께 읽어 SHA-256, byte 크기, MIME과 dimensions를 검증한다. `LICENCE`, `README.md`, issue template, Astro workflow도 유지했다.

## 5. REVIEW로 남긴 파일

자동 삭제 조건을 충족하지 못한 두 파일은 유지했다.

### `_includes/modals.html`

Jekyll runtime에서 더 이상 실행되지 않지만 이어드림 46개 계층형 목차의 가장 상세한 원천이다. 실제 학습 본문은 없으며 목차 요약은 `migration-inventory.md`에도 기록돼 있다. study inventory 또는 실제 entry로 옮긴 뒤 별도 제거 여부를 판단한다.

### `feed.xml`

Jekyll Liquid 전용이라 현재 Astro build에는 참여하지 않지만, 대체 Astro `/feed.xml`이 아직 생성되지 않았다. legacy feed URL parity가 완료될 때까지 REVIEW로 유지한다. 현재 Pages artifact가 root 파일을 복사하지 않으므로 이 파일을 유지해도 production 결과는 달라지지 않는다.

## 6. 참조 검사 결과

현재 Astro 실행 경로에서 다음 항목을 import하거나 실행하는 참조는 0건이다.

- Jekyll/Ruby와 Bundler
- Bootstrap·jQuery·Freelancer JavaScript
- 기존 Liquid layout과 include
- 기존 placeholder post
- Font Awesome runtime asset

문서와 draft 프로젝트 본문의 Jekyll 언급은 마이그레이션 역사 설명이므로 유지했다. REVIEW 두 파일 안의 Liquid 문자열도 실행 잔여물과 구분했다.

## 7. 로컬 검증 결과

- `pnpm install --frozen-lockfile`: 성공, lockfile 변경 없음
- `pnpm format:check`: 성공
- `pnpm check`: 30개 파일, 오류·경고·힌트 0
- `pnpm verify:assets`: legacy asset 9개, SHA 일치 9개, 오류 0
- `pnpm verify:media`: project 2개, WebP 8개, 오류 0
- `pnpm verify:content`: content 2개, published 1개, 오류 0
- `pnpm build`: 성공, 정적 페이지 7개
- RoadScanner 상세 route: 생성
- CHEEZCYJ Portfolio Redesign draft 상세 route: 미생성
- `git diff --check`: 오류 0

비어 있는 `design`, `study`, `posts` 컬렉션 경고는 기존 비차단 상태와 같다.

## 8. Pages workflow 결과

Pages Source는 `GitHub Actions`이며 workflow는 변경하지 않았다. `pages.yml`은 `dist` artifact를 사용하고 deploy job을 `main` push로 제한한다. 이번 feature branch push 이후 PR의 build 성공과 deploy skip을 다시 확인한다.

## 9. Rollback 절차

병합 전에는 `origin/legacy-jekyll`의 SHA와 핵심 snapshot 파일을 다시 확인한다. 병합 후 문제가 생기면 main을 강제 reset하지 않고 마이그레이션 squash commit을 revert하는 방식을 우선한다. Jekyll 구현 자체가 필요한 경우 원격 rollback 브랜치에서 별도 복구 branch를 만든다.

## 10. 알려진 잔여 legacy 항목

- `_includes/modals.html`: 이어드림 inventory migration 대기
- `feed.xml`: Astro feed와 legacy URL parity 대기
- `.gitignore`의 Jekyll cache 규칙: 실행 코드가 아니며 rollback worktree 호환을 위해 유지
- 문서의 Jekyll·Bootstrap·jQuery 문자열: 역사·분류·rollback 근거

이번 단계에서는 Astro UI, 콘텐츠 공개 상태, production WebP, workflow, package와 lockfile을 변경하지 않았다.
