# CHOE YOOJEONG Portfolio

[cheezcyj.github.io](https://cheezcyj.github.io)는 디자인, 웹퍼블리싱, 개발 프로젝트와 배움·경험을 기록하는 정적 포트폴리오 아카이브다. 기존 Jekyll 사이트를 Astro 기반 구조로 전환하고 있다.

## 기술 스택

- Astro 7 정적 출력
- TypeScript strict
- Tailwind CSS 4
- Astro Content Collections
- pnpm과 Node 24
- GitHub Actions·GitHub Pages

## 로컬 실행

`.node-version`에 기록된 Node 버전과 `package.json`의 pnpm 버전을 사용한다.

```shell
pnpm install --frozen-lockfile
pnpm dev
```

production 결과물은 `dist`에 생성된다.

```shell
pnpm build
pnpm preview
```

## 검증

```shell
pnpm format:check
pnpm check
pnpm verify:assets
pnpm verify:media
pnpm verify:content
pnpm verify:study-inventory
pnpm build
pnpm verify:feed
```

`verify:feed`는 build 후 생성된 `dist/feed.xml`을 검증하므로 `pnpm build` 다음에 실행한다.

## 콘텐츠

콘텐츠는 `src/content` 아래 네 컬렉션에 둔다.

- `design`
- `projects`
- `study`
- `posts`

canonical ID는 frontmatter slug가 아니라 컬렉션 내부 파일 경로를 사용한다. 모든 entry는 `draft`와 `sourceStatus`를 명시해야 하며 `draft: false`와 `sourceStatus: verified`를 모두 만족해야 공개 후보가 된다. Study는 추가로 `contentStatus: complete`여야 한다.

이어드림 목차 인벤토리는 원본 구조만 보존한 `draft: true`, `inventory-only` entry이므로 공개되지 않는다.

## 배포와 rollback

GitHub Pages Source는 GitHub Actions다. Pull Request에서는 Astro build와 artifact만 검증하고 실제 배포는 main push에서만 실행한다.

기존 Jekyll snapshot은 원격 `legacy-jekyll` 브랜치의 `63b397e42164bac6d50149c14b7901da5a67e42d`에 보존돼 있다. 문제가 생기면 main을 강제 reset하지 않고 마이그레이션 merge commit을 revert하는 방식을 우선한다.

RSS feed는 [https://cheezcyj.github.io/feed.xml](https://cheezcyj.github.io/feed.xml)에서 제공한다.
