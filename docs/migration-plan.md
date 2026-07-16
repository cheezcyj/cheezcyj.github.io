# Astro 전면 마이그레이션 계획

작성일: 2026-07-16  
상태: 설계 전용 — 구현, 삭제, push, merge 미수행  
목표 저장소: cheezcyj.github.io  
참고 저장소: cheezcyj-blog-redesign

## 1. 목표와 원칙

최종 결과는 Astro + TypeScript + Tailwind CSS 기반의 완전 정적 GitHub Pages 사이트다. v0의 시각 언어를 유지하면서 콘텐츠는 네 개의 독립 컬렉션으로 관리한다.

- design: 디자인 포트폴리오 목록/상세
- projects: 개발 프로젝트 목록/상세
- study: 공부 기록 목록/상세
- posts: 기타 글 목록/상세
- about: 단일 정적 페이지
- 공통: 헤더, 푸터, PC 메뉴, 모바일 메뉴

핵심 원칙은 다음과 같다.

1. Astro HTML을 기본으로 하고 클라이언트 JavaScript는 메뉴, spotlight, 선택형 UI에만 사용한다.
2. 목록 카드의 기본 목적지는 modal이 아니라 고유한 상세 URL이다.
3. 기존 이미지는 1차 cutover에서 URL과 바이트를 그대로 보존한다.
4. 샘플/placeholder와 실제 콘텐츠를 metadata로 명확히 구분한다.
5. Jekyll 파일은 새 build와 URL parity가 검증될 때까지 삭제하지 않는다.
6. main에는 직접 구현하지 않고 feature branch → 검증 → PR → 승인된 merge 순서를 지킨다.

## 2. 목표 아키텍처

```text
Browser
  ├─ static HTML/CSS
  │  ├─ home
  │  ├─ collection list pages
  │  ├─ collection detail pages
  │  └─ about/feed/404
  └─ minimal client scripts
     ├─ mobile menu + active navigation
     ├─ cursor spotlight (fine pointer only)
     └─ optional design preview dialog

Astro build
  ├─ src/content.config.ts
  ├─ local Markdown/MDX collections
  ├─ static getStaticPaths routes
  ├─ Tailwind CSS 4 token layer
  └─ public legacy assets copied without transform

GitHub Actions
  └─ withastro/action build artifact → deploy-pages
```

서버 adapter, SSR, database, Next.js server action은 사용하지 않는다. 연락 폼이 나중에 필요하면 별도의 정적 호환 form provider나 mailto를 명시적으로 선택한다.

## 3. 목표 route

| URL                           | 역할                                  | 데이터             |
| ----------------------------- | ------------------------------------- | ------------------ |
| /                             | v0 기반 홈, 각 컬렉션 featured/recent | 4개 컬렉션 query   |
| /design/                      | 디자인 목록                           | design             |
| /design/[...slug]/            | 디자인 상세                           | design entry       |
| /projects/                    | 개발 프로젝트 목록                    | projects           |
| /projects/[...slug]/          | 개발 프로젝트 상세                    | projects entry     |
| /study/                       | 학습 기록 목록/필터/그룹              | study              |
| /study/[...slug]/             | 학습 기록 상세                        | study entry        |
| /posts/                       | 기타 글 목록                          | posts              |
| /posts/[...slug]/             | 기타 글 상세                          | posts entry        |
| /about/                       | 소개, 기술, 경력/연락 링크            | static page/data   |
| /feed.xml                     | posts와 공개 study의 feed             | generated endpoint |
| /404.html                     | 정적 404                              | static             |
| `/project-1/` … `/project-6/` | legacy feed ID 호환 page              | mapping data       |

Astro config의 site는 https://cheezcyj.github.io 로 유지하고, username root repository이므로 base는 설정하지 않는다. 모든 canonical, Open Graph, feed URL은 site를 기준으로 절대 URL을 생성한다.

### fragment 호환

홈에는 다음 legacy alias를 보존한다.

| 기존 fragment       | 새 목적지                                    |
| ------------------- | -------------------------------------------- |
| #page-top           | 홈 최상단                                    |
| #portfolio          | 홈 Design section 및 /design/ 링크           |
| #posting            | 홈 Study section 및 /study/ 링크             |
| #postingModal-1     | 이어드림 overview anchor                     |
| #yeardreamContent-1 | 이어드림 overview anchor                     |
| #portfolioModal-1~6 | owner가 승인한 legacy design/project mapping |
| #postingModal-2~6   | owner가 승인한 legacy post mapping           |

fragment는 HTTP redirect 대상이 아니므로 alias element 또는 홈의 compatibility script로 처리한다.

## 4. 콘텐츠 컬렉션 설계

현재 공식 Astro Content Layer 방식에 맞춰 src/content.config.ts에서 defineCollection, glob loader, astro/zod를 사용한다. 모든 entry는 Markdown 또는 MDX 파일 하나로 관리하고 filename/path에서 안정적인 id를 만든다.

### 4.1 공통 필드

| 필드         | 타입                                           | 규칙                                             |
| ------------ | ---------------------------------------------- | ------------------------------------------------ |
| title        | string                                         | 필수, 빈 문자열 금지                             |
| description  | string                                         | 카드/SEO용 필수 요약                             |
| draft        | boolean                                        | 기본 false; 검증 전 legacy는 true                |
| featured     | boolean                                        | 홈 노출 여부, 기본 false                         |
| order        | positive integer optional                      | 수동 정렬이 필요할 때만                          |
| tags         | string[]                                       | 기본 빈 배열, slug-friendly canonical vocabulary |
| cover        | image reference optional                       | src, alt, width, height                          |
| legacyUrls   | string[]                                       | 기존 path/fragment, 기본 빈 배열                 |
| sourceStatus | verified / legacy-placeholder / inventory-only | 공개 신뢰도                                      |
| updatedAt    | coerced date optional                          | 실수정 시에만                                    |

cover.src는 1차에는 public root-relative path를 허용해 기존 /img 경로를 보존한다. 새 자산은 src/assets로 옮겨 Astro Image 최적화를 사용하는 방안을 별도로 적용할 수 있지만 legacy URL 파일은 함께 남긴다.

### 4.2 스키마 초안

아래는 구현 시 사용할 shape 설계다. 이번 단계에서는 파일을 생성하지 않는다.

```ts
import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const sourceStatus = z.enum([
  'verified',
  'legacy-placeholder',
  'inventory-only',
])

const cover = z.object({
  src: z.string().regex(/^\/.+/),
  alt: z.string().min(1),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
})

const common = {
  title: z.string().min(1),
  description: z.string().min(1),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  order: z.number().int().nonnegative().optional(),
  tags: z.array(z.string().min(1)).default([]),
  cover: cover.optional(),
  legacyUrls: z.array(z.string()).default([]),
  sourceStatus: sourceStatus.default('verified'),
  updatedAt: z.coerce.date().optional(),
}

const design = defineCollection({
  loader: glob({
    base: './src/content/design',
    pattern: '**/*.{md,mdx}',
  }),
  schema: z.object({
    ...common,
    year: z.number().int().min(2000).max(2100),
    disciplines: z.array(z.string().min(1)).min(1),
    roles: z.array(z.string().min(1)).default([]),
    tools: z.array(z.string().min(1)).default([]),
    client: z.string().optional(),
    externalUrl: z.string().url().optional(),
    aspect: z.enum(['portrait', 'landscape', 'square']).default('landscape'),
    gallery: z.array(cover).default([]),
  }),
})

const projects = defineCollection({
  loader: glob({
    base: './src/content/projects',
    pattern: '**/*.{md,mdx}',
  }),
  schema: z.object({
    ...common,
    status: z.enum(['planned', 'in-progress', 'completed', 'archived']),
    startedAt: z.coerce.date().optional(),
    completedAt: z.coerce.date().optional(),
    stack: z.array(z.string().min(1)).min(1),
    roles: z.array(z.string().min(1)).default([]),
    repositoryUrl: z.string().url().optional(),
    demoUrl: z.string().url().optional(),
    highlights: z.array(z.string().min(1)).default([]),
  }),
})

const study = defineCollection({
  loader: glob({
    base: './src/content/study',
    pattern: '**/*.{md,mdx}',
  }),
  schema: z.object({
    ...common,
    learnedAt: z.coerce.date().optional(),
    program: z.string().min(1),
    track: z.string().optional(),
    phase: z.string().optional(),
    week: z.string().optional(),
    module: z.string().optional(),
    sequence: z.number().int().nonnegative(),
    contentStatus: z.enum(['inventory-only', 'draft', 'complete']),
    source: z
      .object({
        file: z.string().min(1),
        modalId: z.number().int().positive().optional(),
        originalLabel: z.string().optional(),
      })
      .optional(),
  }),
})

const posts = defineCollection({
  loader: glob({
    base: './src/content/posts',
    pattern: '**/*.{md,mdx}',
  }),
  schema: z.object({
    ...common,
    publishedAt: z.coerce.date(),
    category: z.string().optional(),
    authors: z.array(z.string().min(1)).default(['cheezcyj']),
  }),
})

export const collections = { design, projects, study, posts }
```

### 4.3 컬렉션별 파일 배치

```text
src/content/
├─ design/
│  └─ project-slug.mdx
├─ projects/
│  └─ project-slug.mdx
├─ study/
│  └─ yeardream/
│     ├─ foundation/week-01/topic-slug.md
│     └─ ai-practice/week-01/topic-slug.md
└─ posts/
   └─ yyyy/mm/post-slug.md
```

중첩 path는 collection id와 상세 URL의 후보가 된다. 공개 URL을 한번 배포한 뒤에는 filename/id를 임의로 바꾸지 않는다. 제목 변경과 slug 변경을 분리하고, slug를 바꿀 때는 legacyUrls와 compatibility page를 함께 추가한다.

### 4.4 이어드림 migration rule

- modals.html의 46개 항목은 우선 별도 machine-readable inventory로 추출한다.
- 본문이 없는 항목은 sourceStatus: inventory-only, contentStatus: inventory-only, draft: true다.
- 주차 heading이나 중간 grouping 자체를 빈 글로 양산하지 않는다. 목록 grouping data로 사용할지 overview entry로 사용할지 구분한다.
- 실제 노트 파일이나 원문을 찾은 항목만 본문을 추가하고 complete로 승격한다.
- 제목의 번호/underscore는 originalLabel에 보존하고 표시 title과 slug는 사람이 읽기 좋게 정규화한다.
- program/track/week/module/sequence를 사용해 원래 계층과 정렬을 재현한다.

## 5. 컴포넌트 설계

### 5.1 공통 layout

| 컴포넌트                        | 책임                                                  |
| ------------------------------- | ----------------------------------------------------- |
| BaseLayout.astro                | html/lang, metadata, canonical, OG, icons, global CSS |
| ContentLayout.astro             | 상세 제목, 메타, cover, prose, tags, prev/next        |
| SiteHeader.astro                | PC 메뉴, 모바일 toggle/dialog, active state           |
| SiteFooter.astro                | site links, GitHub/email, copyright                   |
| Seo.astro 또는 BaseLayout props | title/description/image/noindex 통합                  |

### 5.2 홈과 목록

| 컴포넌트               | 입력                      | 출력                                |
| ---------------------- | ------------------------- | ----------------------------------- |
| Hero.astro             | site config               | v0 Hero                             |
| SectionHeading.astro   | eyebrow/title/action slot | 공통 제목                           |
| FeaturedDesign.astro   | design entry[]            | 가로 rail                           |
| FeaturedProjects.astro | projects entry[]          | 1/2/3열 grid                        |
| RecentStudy.astro      | study entry[]             | divide list                         |
| RecentPosts.astro      | posts entry[]             | 1/3열 cards                         |
| AboutPreview.astro     | about data                | 2열 band                            |
| DesignCard.astro       | design entry              | cover/category/year/detail link     |
| ProjectCard.astro      | project entry             | cover/summary/stack/repo/demo       |
| StudyRow.astro         | study entry               | program/date/title/tags             |
| PostCard.astro         | post entry                | date/reading time/title/description |
| EmptyState.astro       | label/action              | 검증된 콘텐츠가 없을 때 안전한 안내 |

### 5.3 상세

- design: 역할, 분야, 연도, 설명, gallery, 외부 링크, 다음/이전
- projects: 문제, 역할, stack, 구현/성과, 저장소/데모, 다음/이전
- study: program breadcrumb, week/module, 본문 목차, 관련 기록
- posts: 날짜, category/tags, prose, 관련 글
- 모든 상세: canonical, OG image, structured heading hierarchy, alt text, edit/source metadata 비공개 처리

## 6. interaction 구현 경계

### 정적 HTML로 처리

- 전체 section과 card
- list/detail page
- tags, breadcrumb, prev/next
- 외부 링크와 CTA
- About와 footer
- feed와 metadata

### 작은 vanilla TypeScript로 처리

- 모바일 메뉴 open/close, body scroll lock, Escape, focus trap/복귀
- 홈 IntersectionObserver active section
- cursor spotlight: pointer:fine, requestAnimationFrame, CSS 변수
- optional native dialog preview
- fragment compatibility가 필요한 경우의 안내

React island는 native dialog로 충족되지 않는 복잡한 gallery가 실제 요구될 때만 도입한다. 홈 전체에 client:load를 걸지 않는다.

## 7. 단계별 실행 계획

### Phase 0 — baseline 고정

현재 분석 결과를 승인 기준으로 삼는다.

- 현재 source revision과 170개 파일 manifest/hash 기록
- 기존 Jekyll 임시 build 경고와 output URL manifest 보관
- 기존 home desktop/mobile screenshot 확보
- 브랜드명, 이메일, 공개 콘텐츠, 이미지 권리의 owner decision 수집

완료 gate: migration-inventory의 모든 미결정 항목에 owner 결정 또는 명시적 보류 상태가 있다.

### Phase 1 — feature branch와 Astro skeleton

main이 아닌 feature branch에서만 진행한다.

- Astro + TypeScript strict + Tailwind CSS 4 scaffold
- site URL, output static, package manager/lockfile 확정
- Jekyll 파일은 그대로 두고 새 Astro 디렉터리와 build 진입점만 추가
- format, typecheck, build script 정의
- 초기 workflow는 main deploy를 건드리지 않고 PR에서 build만 수행

완료 gate: 빈 Astro site가 로컬/CI에서 build되고 기존 main Pages 배포는 변하지 않는다.

### Phase 2 — 디자인 foundation

- v0 token을 tokens.css와 Tailwind theme에 이식
- Geist/Pretendard/Noto Sans KR/system-ui fallback strategy 적용
- self-host 글꼴 결정·바이너리 도입·subset 검증은 콘텐츠 이전 이후 별도 작업으로 보류
- BaseLayout, SiteHeader, SiteFooter, Hero, SectionHeading 작성
- 모바일 메뉴 접근성, reduced-motion, spotlight를 독립 검증
- 320~1440px screenshot 비교

완료 gate: 콘텐츠 없이도 header/hero/footer가 v0 시각 기준과 반응형 기준을 충족한다.

### Phase 3 — asset preservation

- 기존 img와 screenshot을 같은 public URL로 복사/유지
- 원본 SHA-256, 크기, MIME manifest 생성
- v0 sample asset과 legacy Bootstrap asset에 sourceStatus 부여
- 실제 cover asset은 별도 naming rule로 추가
- favicon/OG image는 승인된 브랜드 자산으로 교체

완료 gate: legacy asset URL 목록이 staging에서 모두 200이고 hash가 원본과 같다.

### Phase 4 — collection과 content migration

권장 순서는 projects → design → study → posts다.

1. 공통 schema와 네 collection을 정의한다.
2. 실제 프로젝트/디자인으로 확인된 항목을 먼저 작성한다.
3. 기존 six posts는 legacy-placeholder + draft로 이관한다.
4. 이어드림 46개 목차를 계층 inventory로 추출한다.
5. 실제 노트가 확인된 study만 공개 entry로 승격한다.
6. v0 sample 데이터는 test fixture로도 기본 포함하지 않는다.
7. schema validation으로 빈 alt, root GitHub URL, # demo link, 중복 slug를 차단한다.

완료 gate: 모든 공개 entry가 schema, owner verification, 이미지/링크 검사를 통과한다.

### Phase 5 — 목록/상세 페이지

- 네 목록 route와 네 dynamic detail route 작성
- 홈 featured/recent query 연결
- pagination 또는 전체 목록 기준 결정
- study grouping/filter를 program/track/week 기반으로 제공
- design modal은 필요하면 progressive enhancement로 추가
- About 상세 작성

완료 gate: 공개 entry마다 정확히 한 canonical detail URL이 있고 모든 card가 상세로 이동한다.

### Phase 6 — legacy compatibility와 SEO

- 기존 root asset path 유지
- fragment alias 추가
- `/project-1/`부터 `/project-6/`까지 compatibility page 또는 canonical 안내 작성
- /feed.xml을 고유 URL과 실제 본문 요약으로 생성
- sitemap, robots, canonical, OG, 404 검증
- http GitHub 링크를 https로 정규화

완료 gate: old URL/fragment/asset manifest와 new route manifest의 대응이 100%다.

### Phase 7 — 검증

#### build/data

- astro sync
- TypeScript check
- production build
- collection schema validation
- duplicate id/canonical 검사
- draft가 production listing/feed에 노출되지 않는지 검사

#### 링크/자산

- 내부 링크 crawler 0 broken
- external link 상태와 target/rel 검사
- legacy asset 200 + hash 비교
- 이미지 alt와 width/height 검사
- feed XML validation

#### UI/접근성

- viewport: 320, 375, 768, 1024, 1280, 1440
- keyboard only: skip link, header, mobile menu, cards, dialog
- focus trap/복귀, Escape, scroll lock
- prefers-reduced-motion, pointer: coarse
- axe 또는 동등한 WCAG 자동 검사
- Lighthouse 성능/접근성/SEO baseline
- screenshot visual regression

완료 gate: blocking error 0, owner가 desktop/mobile 주요 화면과 콘텐츠 mapping 승인.

### Phase 8 — GitHub Pages 전환

공식 Astro GitHub Pages action을 사용한다.

- withastro/action으로 install/build/upload
- deploy-pages로 승인된 artifact 배포
- permissions: contents read, pages write, id-token write
- main push 배포는 PR 승인 후 workflow 교체 commit에서만 활성화
- username root site이므로 base 미설정
- lockfile을 commit하고 Node/package manager version을 고정

완료 gate: feature branch artifact를 검증하고 merge 전 deploy 설정 diff를 별도 review한다.

### Phase 9 — 제거와 merge

이 단계 전까지 Jekyll 파일을 삭제하지 않는다.

- pre-Astro tag/release/archive 확인
- REMOVE_AFTER_VERIFY 파일의 참조 0건 확인
- Jekyll/Ruby/Bootstrap/jQuery 삭제를 별도 commit으로 분리
- 최종 production build와 URL regression 재실행
- PR 승인 후 main merge
- 실제 Pages 배포 후 smoke test
- rollback이 필요하면 pre-Astro revision/workflow로 되돌릴 수 있게 유지

완료 gate: production smoke test와 legacy URL test가 통과하고 rollback point가 존재한다.

## 8. 권장 commit 단위

1. chore: scaffold Astro without removing Jekyll
2. style: migrate v0 design tokens and layout shell
3. content: define typed collections
4. content: migrate verified design and project entries
5. content: inventory legacy posts and yeardream curriculum
6. feat: add collection list and detail routes
7. feat: add accessible navigation and optional interactions
8. seo: preserve legacy routes assets and feed
9. ci: switch Pages build to Astro
10. chore: remove verified Jekyll runtime files

마지막 제거 commit을 분리하면 검토와 rollback이 쉬워진다.

## 9. 위험 register와 대응

| 위험                                       | 확률 | 영향 | 대응                                            |
| ------------------------------------------ | ---: | ---: | ----------------------------------------------- |
| 실콘텐츠 원본이 저장소 밖에 있음           | 높음 | 높음 | owner 자료 수집 전 inventory-only/draft         |
| legacy post URL 충돌을 정상 URL로 오인     | 높음 | 높음 | 임시 build manifest를 기준으로 고유 새 URL 설계 |
| 디자인 fidelity를 위해 과도한 React를 유지 | 중간 | 중간 | Astro static-first와 client budget              |
| 한글/영문 글꼴 혼용                        | 높음 | 중간 | 명시적 한글 fallback, self-host font QA         |
| 샘플 이미지 공개                           | 중간 | 높음 | sourceStatus, owner approval, draft gate        |
| fragment bookmark 소실                     | 중간 | 중간 | alias anchor/compatibility script               |
| GitHub Pages base 오설정                   | 중간 | 높음 | root user site는 base 없음, staging URL test    |
| Jekyll 제거가 너무 이른 시점에 발생        | 중간 | 높음 | REMOVE_AFTER_VERIFY gate와 별도 removal commit  |
| 정적 연락 폼이 작동하는 것처럼 보임        | 중간 | 중간 | 초기 scope 제외 또는 provider 명시              |
| feed/canonical 중복                        | 높음 | 중간 | unique route + XML/link audit                   |

## 10. 완료 정의

다음 조건을 모두 만족할 때만 마이그레이션 완료로 본다.

- 네 콘텐츠 유형이 각각 목록과 고유 상세 URL을 가진다.
- 홈, About, header/footer, PC/mobile menu가 v0 디자인 원칙을 따른다.
- 공개 콘텐츠는 verified 상태이며 placeholder가 실작품처럼 노출되지 않는다.
- 이어드림 계층이 보존되고 본문 없는 항목이 완성 글로 오인되지 않는다.
- 기존 이미지 URL과 feed/legacy compatibility URL이 검증된다.
- production build, typecheck, link, accessibility, responsive, visual test가 통과한다.
- Pages workflow가 Astro artifact를 배포한다.
- Jekyll 삭제 전 archive/rollback point가 있다.
- main merge와 원격 push는 별도 승인된 단계에서만 수행한다.

## 11. 이번 단계에서 하지 않은 일

- Astro/TypeScript/Tailwind 파일 생성
- 기존 Jekyll 파일 변경 또는 삭제
- v0 프로젝트 변경
- package 설치
- commit, push, PR, merge
- GitHub Pages workflow 전환 또는 배포

이 문서는 다음 구현 단계의 실행 순서와 검증 gate만 정의한다.

## 12. 참고 자료

- Astro 공식 Content Collections: https://docs.astro.build/en/guides/content-collections/
- Astro 공식 GitHub Pages 배포: https://docs.astro.build/en/guides/deploy/github/
- v0 참조 템플릿: https://v0.app/templates/graphic-designer-portfolio-OEGmoMu1hHL
