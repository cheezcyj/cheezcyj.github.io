# Phase 5A-0 Astro Pages 배포 전환

- 작성일: 2026-07-19
- 작업 브랜치: `redesign/astro-v0`
- 전환 전 기준 SHA: `1db92fdb74963931eb52ce4739a9a2b4a6a9a53c`
- 범위: GitHub Pages workflow 전환과 배포 구조 문서화

## 1. 기존 Jekyll workflow

기존 `.github/workflows/pages.yml`의 이름은 `Deploy Jekyll site to Pages`였다. `main` push와 수동 실행을 trigger로 사용했고, workflow 전체에 `contents: read`, `pages: write`, `id-token: write` 권한을 부여했다. Build job은 `actions/jekyll-build-pages@v1`을 실행했으며 deploy job은 build 성공 뒤 조건 없이 `github-pages` environment에 배포했다.

## 2. 기존 Jekyll build와 artifact 경로

- source: 저장소 루트
- build destination: `./_site`
- Pages artifact: `./_site`
- 제거한 요소: `actions/jekyll-build-pages@v1`, `Build with Jekyll`, `_site`

Ruby, Bundler와 별도 `bundle exec` 단계는 기존 workflow에 없었고 새 workflow에도 추가하지 않았다.

## 3. 새 Astro workflow

파일 경로는 `.github/workflows/pages.yml`로 유지하고 이름을 `Deploy Astro site to Pages`로 변경했다. Build job은 Node.js 24와 pnpm 11.9.0으로 Astro 정적 사이트를 검증·빌드한 뒤 `dist`를 Pages artifact로 올린다. Deploy job은 production 조건을 만족할 때만 artifact를 GitHub Pages에 배포한다.

기존 `.github/workflows/astro-check.yml`은 일반 코드 검증 역할을 유지하며 수정하지 않았다. 두 workflow를 합치지 않았다.

## 4. Trigger

- `main` branch push
- `main` 대상 pull request
- `workflow_dispatch`

Feature branch push 자체는 Pages workflow trigger가 아니다. Pull request와 수동 실행은 build와 artifact 검증까지만 수행한다.

## 5. Build job

Build job은 `ubuntu-latest`에서 다음 순서로 실행한다.

1. `actions/checkout@v6`
2. `pnpm/action-setup@v4` — pnpm 11.9.0
3. `actions/setup-node@v6` — `.node-version`, pnpm cache
4. `actions/configure-pages@v5`
5. frozen lockfile 설치
6. format 검사
7. Astro와 TypeScript 검사
8. legacy asset 검사
9. project media 검사
10. content publication 검사
11. Astro production build
12. Pages artifact 업로드

## 6. 검증 명령

Build job은 다음 명령을 실행한다.

- `pnpm install --frozen-lockfile`
- `pnpm format:check`
- `pnpm check`
- `pnpm verify:assets`
- `pnpm verify:media`
- `pnpm verify:content`
- `pnpm build`

## 7. Artifact 경로

`actions/upload-pages-artifact@v4`에 전달하는 경로는 Astro production 결과물인 `./dist`다. Jekyll의 `./_site`는 더 이상 사용하지 않는다.

## 8. Deploy 조건

Deploy job은 build job을 `needs: build`로 참조하며 다음 조건을 모두 만족할 때만 실행한다.

```yaml
if: github.event_name == 'push' && github.ref == 'refs/heads/main'
```

따라서 실제 배포 대상은 `main` push뿐이다. `redesign/astro-v0`를 포함한 feature branch와 다른 event에서는 production deploy를 실행할 수 없다.

## 9. Pull request에서 deploy되지 않는 이유

`main` 대상 pull request는 build job을 실행하지만 event 이름이 `pull_request`이므로 deploy 조건의 첫 항을 만족하지 않는다. Artifact는 검토용 build 결과로만 업로드되고 Pages environment 배포는 skip된다.

## 10. `workflow_dispatch`에서 deploy되지 않는 이유

수동 실행은 event 이름이 `workflow_dispatch`이므로 deploy 조건을 만족하지 않는다. Build와 artifact 업로드만 수행하며 수동 실행만으로 production Pages 사이트를 바꿀 수 없다.

## 11. 최소 권한

- workflow 기본 권한: `contents: read`
- build job: `contents: read`
- deploy job: `pages: write`, `id-token: write`

Pages 배포 권한은 deploy job에만 부여했다. `actions/configure-pages@v5`의 `enablement` 기본값은 `false`이므로 이 workflow가 저장소 Pages 설정을 자동 변경하도록 구성하지 않았다.

## 12. Pages environment

Deploy job은 `github-pages` environment를 사용한다. 배포 URL은 `actions/deploy-pages@v4`의 `deployment` step이 반환하는 `page_url`을 environment URL에 연결한다.

## 13. Astro `site`와 `base` 설정

`astro.config.mjs`는 다음 production 설정을 유지한다.

- `site`: `https://cheezcyj.github.io`
- `output`: `static`
- `base`: 설정 없음

이 저장소는 `username.github.io` 루트 사이트이므로 별도 repository subpath용 `base`가 필요하지 않다.

## 14. GitHub Pages repository setting 조회 결과

읽기 전용 GitHub API 조회 결과는 다음과 같다.

- Pages URL: `https://cheezcyj.github.io/`
- 상태: `built`
- build type: `legacy`
- source: `main` branch의 `/`
- custom domain: 없음
- HTTPS 강제: 활성화

현재 repository setting은 아직 branch 기반 legacy build다. 새 workflow 자체는 저장소 설정을 변경하지 않는다. Draft PR 검토 중 Pages source를 GitHub Actions custom workflow로 전환할 시점과 승인을 확인해야 하며, 이 확인 전에는 main merge를 승인하지 않는다.

## 15. 로컬 검증 결과

- `pnpm install --frozen-lockfile`: 성공, lockfile 변경 없음
- `pnpm format:check`: 성공
- `pnpm check`: 30개 파일, 오류 0, 경고 0, 힌트 0
- `pnpm verify:assets`: 성공 — legacy assets 9, SHA 일치 9, 중복과 경로 충돌 0
- `pnpm verify:media`: 성공 — approved projects 2, WebP 8, 미디어 오류 0
- `pnpm verify:content`: 성공 — content entries 2, published entries 1, URL·placeholder·날짜 오류 0
- `pnpm build`: 성공 — 정적 페이지 7개
- `dist/projects/roadscanner/index.html`: 생성
- 기존 draft 프로젝트 상세 route: 미생성
- `git diff --check`: 오류 0

첫 sandbox 제한 build는 esbuild 하위 프로세스가 차단돼 `spawn EPERM`으로 중단됐다. 동일 소스를 하위 프로세스 실행이 허용된 로컬 검증 환경에서 다시 실행해 성공했으므로 application 또는 workflow 오류로 분류하지 않는다. 비어 있는 `design`, `study`, `posts` 컬렉션 경고는 기존 foundation 상태와 같다.

## 16. Ubuntu 검증 전 상태

이번 단계에서는 feature branch를 push하지 않았으므로 새 Pages workflow의 Ubuntu 실행은 아직 없다. YAML 1.2 파서로 문법 오류 0, `on` key와 세 trigger, `build`·`deploy` job, 권한, artifact 경로와 deploy 조건을 확인했다. Prettier YAML 검사도 성공했다. 별도 `actionlint` 실행 파일은 현재 로컬 환경에 설치돼 있지 않다.

## 17. PR에서 확인할 항목

- `Deploy Astro site to Pages` build job 성공
- pull request의 deploy job이 skip인지 확인
- `Check Astro foundation` 검증 성공
- artifact가 `dist`에서 생성되는지 확인
- RoadScanner만 published 상태인지 확인
- 기존 draft 프로젝트 route가 없는지 확인
- Pages source를 GitHub Actions로 전환하기 전 Owner 승인
- workflow annotation과 build 경고가 비차단인지 재확인

## 18. Main merge 후 예상 배포

Pages source 설정과 merge 승인이 완료된 뒤 `main`에 변경이 들어오면 build job이 전체 검증과 Astro build를 수행하고 `dist` artifact를 업로드한다. 동일 실행의 deploy job은 main push 조건을 통과해 `github-pages` environment와 `actions/deploy-pages@v4`로 공개 사이트를 갱신한다.

현재 Pages build type이 `legacy`이므로 설정 전환 계획이 확정되기 전 main merge는 blocker로 유지한다.

## 19. Rollback 방식

- `legacy-jekyll` branch를 기존 Jekyll 구현 백업으로 유지한다.
- 문제가 생기면 main에 병합된 workflow 전환 commit을 새 revert commit으로 되돌릴 수 있다.
- 이전 Jekyll workflow는 Git 이력에 보존된다.
- main 강제 reset은 기본 rollback 방식으로 사용하지 않는다.
- 배포 복구와 콘텐츠 복구를 분리해 검토한다.

## 20. 알려진 비차단 annotation

기존 Ubuntu 실행에서는 `pnpm/action-setup@v4` 내부 Node.js 20 사용 중단 annotation이 표시됐지만 workflow는 성공했다. GitHub-hosted action의 내부 런타임 annotation은 application의 `.node-version` 24.14.0과 구분한다. 새 PR 실행에서도 workflow 결론과 분리해 유지보수 항목으로 기록한다.

로컬 frozen 설치 중 pnpm 최신 버전 메타데이터 조회가 실패했다는 비차단 안내가 있었지만 의존성은 lockfile 기준으로 이미 일치했고 명령은 성공했다. 패키지나 lockfile은 변경하지 않았다.
