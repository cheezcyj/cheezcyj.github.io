# Phase 4A 콘텐츠 컬렉션 기반 보고서

작성일: 2026-07-16
대상 브랜치: `redesign/astro-v0`
범위: Content Collections foundation and publication gates

## 1. 구현 범위

이번 단계에서는 실제 포트폴리오 콘텐츠를 만들거나 기존 Jekyll placeholder를 공개 콘텐츠로 옮기지 않았다. 네 컬렉션의 타입, 공개 차단 규칙, 빈 목록 UI와 검증 자동화만 구현했다.

- `design`
- `projects`
- `study`
- `posts`

각 컬렉션은 `src/content.config.ts`에서 Astro 7 Content Layer의 `defineCollection`, `glob`, `astro/zod`로 정의한다. loader pattern은 `**/*.{md,mdx}`이므로 각 디렉터리의 `.gitkeep`은 entry로 읽히지 않는다. 현재 Markdown/MDX 파일 수는 0개다.

## 2. 스키마

### 공통 필드

| 필드           | 타입/기본값                                              | 검증                                             |
| -------------- | -------------------------------------------------------- | ------------------------------------------------ |
| `title`        | 비어 있지 않은 string                                    | 공백만 있는 값 금지                              |
| `description`  | 비어 있지 않은 string                                    | 공백만 있는 값 금지                              |
| `draft`        | boolean, 필수                                            | 명시적으로 `false`인 경우만 공개 후보            |
| `featured`     | boolean, 기본 `false`                                    | 공개 entry 중 홈 featured 선택에만 사용          |
| `order`        | 0 이상의 integer, 선택                                   | 지정 entry 우선 오름차순                         |
| `tags`         | string array, 기본 `[]`                                  | 빈 tag 금지                                      |
| `cover`        | `{ src, alt, width?, height? }`, 선택                    | root-relative src, 비어 있지 않은 alt, 양의 크기 |
| `legacyUrls`   | string array, 기본 `[]`                                  | root-relative path 또는 fragment만 허용          |
| `sourceStatus` | 필수: `verified`, `legacy-placeholder`, `inventory-only` | 명시적으로 `verified`인 경우만 공개 후보         |
| `updatedAt`    | coerced Date, 선택                                       | 변환 실패 시 Astro schema/build 실패             |

### `design`

- `year`: 2000~2100 정수
- `disciplines`: 비어 있지 않은 배열
- `roles`, `tools`: string 배열
- `client`, `externalUrl`: 선택
- `aspect`: `portrait`, `landscape`, `square`
- `gallery`: cover와 같은 image reference 배열

### `projects`

- `status`: `planned`, `in-progress`, `completed`, `archived`
- `startedAt`, `completedAt`: coerced Date, 선택
- 두 날짜가 모두 있으면 `completedAt >= startedAt`
- `completed`는 `completedAt` 필수, `planned`는 `completedAt` 금지
- `stack`: 비어 있지 않은 배열
- `roles`, `highlights`: string 배열
- `repositoryUrl`, `demoUrl`: URL, 선택

### `study`

- `learnedAt`: coerced Date, 선택
- `program`: 비어 있지 않은 string
- `track`, `phase`, `week`, `module`: 선택
- `sequence`: 0 이상의 정수
- `contentStatus`: `inventory-only`, `draft`, `complete`
- `source`: `{ file, modalId?, originalLabel? }`, 선택

### `posts`

- `publishedAt`: 필수 coerced Date
- `category`: 선택
- `authors`: 비어 있지 않은 string 배열, 기본 `['cheezcyj']`

## 3. 공개와 비공개 조건

공개 여부는 `src/utils/content.ts` 한 곳의 `isPublishableEntry()`와 `getPublicationIssues()`에서 결정한다. 페이지는 이 규칙을 다시 구현하지 않고 `getPublishedEntries()` 또는 `getFeaturedEntries()`만 호출한다.

공개 entry는 다음을 모두 만족해야 한다.

1. frontmatter에 `draft`가 있고 `draft === false`
2. frontmatter에 `sourceStatus`가 있고 `sourceStatus === 'verified'`
3. 공통 및 컬렉션별 필수 필드가 유효함
4. cover/gallery alt가 비어 있지 않음
5. 날짜가 유효한 `Date`임
6. 공개 링크, 제목, 설명, 본문과 이미지가 placeholder 규칙을 통과함
7. `study`는 추가로 `contentStatus === 'complete'`

다음 entry는 항상 비공개다.

- draft
- `legacy-placeholder`
- `inventory-only`
- `study`의 `inventory-only` 또는 `draft` contentStatus
- 필수 필드, 날짜, 링크, alt 또는 이미지 검증 실패 entry

별도 preview mode는 만들지 않았다.

## 4. Placeholder 차단

공유 publication policy는 `src/config/content-policy.mjs`에 있다. legacy placeholder asset 목록, v0 sample asset 정규식, placeholder text 정규식, placeholder link 판정, legacy URL 정규화와 프로젝트 날짜 규칙을 순수 ESM으로 제공하며 `src/content.config.ts`, `src/utils/content.ts`, `scripts/verify-content.mjs`가 동일 모듈을 import한다.

schema refinement, 런타임 공개 query, `verify:content`의 세 겹으로 차단한다.

- `https://github.com/`, `http://github.com/` 같은 GitHub root URL
- `#` 링크
- `localhost` 및 하위 도메인
- `example.com` 및 하위 도메인
- v0 템플릿의 샘플 연락처 이메일
- `Lorem ipsum`, `Start Bootstrap`
- `project 1`, `project 2` 형태의 template 제목
- v0의 design/frontend sample 이미지와 placeholder/icon 이미지 경로
- `/img/portfolio/cabin.png` 등 asset manifest의 legacy template 이미지
- `/img/profile.png`, `/img/profile2.png`, `/screenshot.png`

`sourceStatus: legacy-placeholder` 또는 `inventory-only` entry는 원본 조사값을 보존할 수 있지만 공개 query 결과에는 들어갈 수 없다. 반대로 legacy/v0 placeholder 이미지를 `verified` 이미지로 표시하면 draft 여부와 관계없이 검증에 실패한다.

`legacyUrls`는 `/`로 시작하되 `//`가 아닌 root-relative path 또는 내용이 있는 `#fragment`만 허용한다. 빈 문자열, 공백·역슬래시 포함 값, 외부 URL, protocol-relative URL, `javascript:` URL은 거부한다. 대소문자, 중복 슬래시와 마지막 슬래시를 정규화한 키로 전체 컬렉션 중복을 검사한다.

## 5. Query 유틸리티

`src/utils/content.ts`에 다음 API를 추가했다.

- `getPublishedEntries(collection)`
- `getFeaturedEntries(collection)`
- `sortEntries(entries)`
- `isPublishableEntry(entry)`
- `getPublicationIssues(entry)`

정렬 순서는 다음과 같다.

1. `order`가 있는 entry를 먼저 배치하고 값 오름차순
2. design year, project 완료/시작일, study 학습일, post 발행일 기준 내림차순
3. 제목, 마지막으로 id를 이용한 안정 정렬

## 6. 목록 route와 홈 연결

다음 정적 목록 route를 만들었다.

| Route        | title                | 현재 결과  |
| ------------ | -------------------- | ---------- |
| `/design/`   | Design Portfolio     | EmptyState |
| `/projects/` | Development Projects | EmptyState |
| `/study/`    | Study Notes          | EmptyState |
| `/posts/`    | Other Posts          | EmptyState |

각 페이지는 `BaseLayout`, `SiteHeader`, 고유 title/description/canonical, 공개 query, semantic list 또는 `EmptyState`, `SiteFooter`를 사용한다. 상세 dynamic route는 만들지 않았다.

홈의 `Featured Design`, `Development Projects`, `Recent Study Notes`, `Other Posts`도 실제 컬렉션 query에 연결했다. 현재 공개 entry가 0개라 다음 문구가 표시된다.

- Design: `검증된 작업을 정리 중입니다.`
- Projects: `개발 프로젝트를 정리 중입니다.`
- Study: `학습 기록을 정리 중입니다.`
- Posts: `글을 준비 중입니다.`

About Preview는 컬렉션과 연결하지 않고 기존 정적 section으로 유지했다.

## 7. EmptyState

`src/components/ui/EmptyState.astro`는 `title`, `description`, 선택 `actionHref`, 선택 `actionLabel` props를 받는다. 두꺼운 카드 대신 token 기반의 위·아래 경계와 충분한 여백을 사용한다. action은 href와 label이 모두 있을 때만 키보드 접근 가능한 링크로 렌더링한다.

## 8. 콘텐츠 검증

`scripts/verify-content.mjs`와 `pnpm verify:content`를 추가했다. YAML frontmatter를 읽되 production loader 밖의 script로만 동작하며 fixture Markdown을 컬렉션에 만들지 않는다. 검증 스크립트 내부 self-test는 정상 verified project, draft project, `draft` 누락, `sourceStatus` 누락, GitHub root URL, 세 가지 프로젝트 날짜 오류, 잘못된 `legacyUrl`, incomplete/complete study를 확인한다.

canonical collection ID는 frontmatter 값이 아니라 `src/content/<collection>/` 아래 Markdown/MDX 파일의 collection-relative path로만 계산한다. `slug` 필드는 스키마에 없으며 검증기도 `data.slug`를 읽지 않는다.

검증 결과:

- scanned content entries: 0
- published entries: 0
- duplicate collection ids: 0
- duplicate public URL candidates: 0
- duplicate legacyUrls: 0
- placeholder publication violations: 0
- date errors: 0

## 9. 검증 결과

| 명령/검사                        | 결과                             |
| -------------------------------- | -------------------------------- |
| `pnpm install --frozen-lockfile` | 성공, lockfile 변경 없음         |
| `pnpm format:check`              | 성공                             |
| `pnpm check`                     | 성공, errors/warnings/hints 0    |
| `pnpm verify:assets`             | 성공, 9개 legacy asset hash 유지 |
| `pnpm verify:content`            | 성공, 공개 entry 0개             |
| `pnpm build`                     | 성공                             |
| 네 목록 `dist/*/index.html`      | 모두 생성                        |
| 홈 EmptyState                    | 네 문구 모두 렌더링              |
| v0 sample public reference       | 0건                              |
| 신규 Next.js/React dependency    | 0건                              |
| 브라우저 console                 | error 0건                        |
| 320px viewport                   | horizontal overflow 0            |

## 10. Astro/Vite interop 메모

현재 Windows, pnpm isolated node linker, Astro 7/Vite 8 환경에서 공식 `glob` loader가 가져오는 CommonJS `picomatch`를 Vite module runner가 직접 평가할 때 `require is not defined`가 재현됐다. 공식 loader API와 glob pattern을 바꾸지 않기 위해 `picomatch`를 직접 devDependency로 선언하고 `scripts/picomatch-interop.mjs`를 Vite alias로 연결했다. 래퍼는 Node `createRequire()`로 동일 패키지를 로드하며 브라우저 번들에는 포함되지 않는다.

검증한 로컬 런타임은 Node `v24.14.0`이다. `package.json`은 Node 24 major만 허용하고 `.node-version`은 검증한 정확한 버전을 기록한다. Ubuntu GitHub Actions도 `.node-version`을 읽어 frozen install, check, format, asset/content verification, build를 수행한다. 이번 단계에서는 push/PR을 하지 않았으므로 Linux 원격 실행 결과는 아직 없으며, 대소문자 구분 파일 시스템에서 `scripts/picomatch-interop.mjs` 경로와 `picomatch` 패키지 해석이 동일하게 성공하는지는 다음 실제 CI 실행에서 확인해야 한다. 로컬 Windows check/build는 alias를 유지한 상태로 통과했다.

`yaml`은 `verify-content`가 frontmatter를 독립 검사하기 위한 devDependency다. Next.js 또는 React 의존성은 추가하지 않았다.

## 11. Phase 4B에 필요한 owner 입력

실제 entry 등록 전에 다음 자료가 필요하다.

1. 공개 승인된 design/project의 정확한 제목, 설명, 연도/날짜, 역할, 도구/stack, 상태
2. 실제 repository, demo, external URL과 공개 가능 여부
3. 승인된 cover/gallery 원본, 파일명, 사용 권리, alt, 가능하면 width/height
4. 각 entry의 collection-relative 파일 경로 기반 canonical ID와 기존 URL 대응표
5. 이어드림 학습 항목별 실제 본문 또는 원본 파일, 날짜, program/track/week/module, 완료 승인
6. posts의 실제 본문, 발행일, category, authors와 공개 승인
7. featured/order 지정이 필요한 경우 owner 우선순위

## 12. Phase 4B 진입 조건

위 owner 입력이 확보되고 각 후보가 다음을 충족하면 Phase 4B를 시작할 수 있다.

- 실제 콘텐츠와 출처가 owner에게 확인됨
- sample/placeholder가 아닌 승인 이미지가 준비됨
- repository/demo/external URL이 실제 목적지로 확인됨
- study 본문과 `complete` 판정 근거가 있음
- 파일 경로 기반 canonical ID와 legacy URL 충돌 검사가 가능함
- Phase 4A의 format, check, asset, content, build gate가 계속 통과함

현재는 기반 구현만 완료됐으며 실제 콘텐츠 등록과 상세 페이지 구현은 시작하지 않았다.
