# v0 디자인 분석과 Astro 변환 설계

작성일: 2026-07-16  
분석 대상: `../cheezcyj-blog-redesign`의 현재 `main` (`9b61046`)  
참조 템플릿: [Graphic Designer Portfolio - v0 by Vercel](https://v0.app/templates/graphic-designer-portfolio-OEGmoMu1hHL)

## 1. 결론

v0 프로젝트는 최종 콘텐츠가 아니라 **어두운 포트폴리오 화면의 시각 규칙과 홈 화면 컴포넌트 구성을 제공하는 참고 원본**이다. Astro로 가져갈 핵심은 다음과 같다.

- 크림색 본문, 골드 포인트, 네이비 표면으로 구성된 단일 다크 테마
- 최대 너비 `1280px`의 중앙 컨테이너와 넉넉한 세로 리듬
- 가로 스크롤 디자인 레일, 16:9 개발 카드, 구분선형 학습 목록, 3열 글 카드
- sticky 데스크톱 헤더, 전체 화면 모바일 메뉴, 활성 섹션 표시
- 카드 이미지 확대, 골드 hover/focus, 커서 spotlight, 부드러운 스크롤
- 목록은 정적 Astro 컴포넌트로 렌더링하고 메뉴·spotlight·선택형 UI만 작은 클라이언트 스크립트로 유지하는 구조

반대로 Next.js App Router, React 전체 페이지 hydration, shadcn UI 전체 묶음, 샘플 프로젝트·샘플 이미지, 동작하지 않는 연락 폼은 최종 자산으로 간주하면 안 된다.

## 2. 소스 구조와 실제 사용 범위

```text
cheezcyj-blog-redesign/
├─ app/                    Next.js 레이아웃, 홈, 전역 CSS, 미완성 서버 액션
├─ components/             홈 전용 컴포넌트 13개
│  └─ ui/                  shadcn/Radix 컴포넌트 57개
├─ hooks/                  shadcn용 hook 2개
├─ lib/                    샘플 데이터와 className 유틸리티
├─ public/                 샘플 작품 이미지, 아이콘, placeholder
├─ styles/                 사용되지 않는 두 번째 globals.css
└─ package/config files    Next 15, React 19, Tailwind CSS 4 설정
```

`app/page.tsx`에서 도달 가능한 홈 UI는 루트 컴포넌트 11개와 `components/ui/dialog.tsx`뿐이다. `contact-form.tsx`, `theme-provider.tsx`, 나머지 UI 56개, 두 hook, `styles/globals.css`는 현재 홈에서 사용되지 않는다. 따라서 “v0에 들어 있다”와 “현재 디자인에 필요하다”를 구분해야 한다.

## 3. 디자인 토큰

### 3.1 색상

실제 홈이 import하는 `app/globals.css`의 `:root`가 기준이다.

| 역할         | 현재 변수                    |                      값 | Astro 권장 이름         | 사용처                   |
| ------------ | ---------------------------- | ----------------------: | ----------------------- | ------------------------ |
| 페이지 배경  | `--background`               |               `#070b16` | `--color-bg`            | body, 모바일 메뉴        |
| 기본 텍스트  | `--foreground`               |               `#f4ecd8` | `--color-text`          | 제목, 주요 본문          |
| 카드/팝오버  | `--card`                     |               `#0d1524` | `--color-surface`       | 프로젝트·글 카드, 모달   |
| muted 표면   | `--muted`                    |               `#131c2c` | `--color-surface-muted` | 태그, 스크롤바 track     |
| muted 텍스트 | `--muted-foreground`         |               `#94a0b0` | `--color-text-muted`    | 날짜, 설명, 내비게이션   |
| 브랜드 골드  | `--accent`, `--primary`      |               `#e6a700` | `--color-accent`        | CTA, eyebrow, 활성/hover |
| 진한 골드    | `--accent-dark`              |               `#b87900` | `--color-accent-strong` | CTA hover                |
| 네이비       | `--navy`                     |               `#2c3e50` | `--color-navy`          | 보조 브랜드 색           |
| 진한 네이비  | `--navy-dark`, `--secondary` |               `#233140` | `--color-navy-deep`     | About 띠, 보조 표면      |
| 경계선       | `--border`                   | `rgba(244,236,216,.10)` | `--color-border`        | 헤더, 카드, 구분선       |
| 입력 경계    | `--input`                    | `rgba(244,236,216,.12)` | `--color-input`         | 폼 후보                  |
| 포커스 링    | `--ring`                     |               `#e6a700` | `--color-focus`         | 키보드 focus             |

Astro에서는 shadcn 의미와 충돌하는 `accent`/`secondary`보다 역할이 명확한 이름으로 바꾸되 값은 그대로 유지한다. `@theme inline`으로 Tailwind CSS 4 색상 유틸리티에 연결한다.

`app/globals.css`의 `.dark`는 브랜드 팔레트가 아니라 shadcn 기본 회색 팔레트로 다시 정의되어 있다. `ThemeProvider`가 렌더링되지 않으므로 현재 홈은 사실상 `:root` 다크 테마 하나만 사용한다. 초기 Astro 마이그레이션에서는 **단일 다크 테마**를 기준으로 하고, light/dark 전환은 별도 요구가 생길 때 설계한다.

### 3.2 radius와 경계

| 토큰        |                  값 | 대표 사용         |
| ----------- | ------------------: | ----------------- |
| base        | `0.625rem` / `10px` | 기본 radius       |
| small       |               `6px` | 작은 control      |
| medium      |               `8px` | 메뉴·focus 대상   |
| large       |              `10px` | 일반 surface      |
| extra large |              `14px` | 카드·이미지 frame |
| pill        |            `9999px` | CTA, 태그, badge  |

카드의 깊이는 그림자보다 `1px` 반투명 경계와 표면색 차이로 만든다. hover 시 경계만 `accent / 60%`로 바뀌고 과도한 elevation은 없다.

### 3.3 타이포그래피

의도된 글꼴은 `Geist`와 `Geist Mono`다. 그러나 현재 구현에는 두 문제가 있다.

1. `app/layout.tsx`에서 `Geist()`를 호출하지만 반환된 `className`/`variable`을 `<html>` 또는 `<body>`에 연결하지 않는다.
2. 실제 import되는 `app/globals.css`에는 `--font-sans`가 없고, 사용되지 않는 `styles/globals.css`에만 Geist 이름이 있다.

따라서 실제 렌더링은 Tailwind 기본 sans 계열로 떨어질 가능성이 높다. 또한 `next/font`가 `latin` subset만 요청하므로 한글은 별도 시스템 글꼴로 fallback되어 영문과 한글의 인상이 달라질 수 있다.

Astro에서는 다음 중 하나를 명시적으로 결정해야 한다.

- 디자인 충실도 우선: `Geist`(라틴) + 한글 지원 글꼴(Pretendard 또는 Noto Sans KR) fallback
- 한글 일관성 우선: 한글 지원 variable sans 하나를 self-host하고 전체에 적용

권장 기본 stack은 `Geist, "Pretendard Variable", Pretendard, "Noto Sans KR", system-ui, sans-serif`이며, 실제 배포 전 라이선스와 font subset/용량을 검증한다.

| 용도         | Tailwind 크기                      |      실제 범위 | 무게/특징                            |
| ------------ | ---------------------------------- | -------------: | ------------------------------------ |
| Hero 이름    | `text-5xl sm:text-7xl lg:text-8xl` | 48 / 72 / 96px | 800, line-height .95, tight tracking |
| Hero 문장    | `text-3xl sm:text-5xl lg:text-6xl` | 30 / 48 / 60px | 300, gold 강조                       |
| 섹션 제목    | `text-3xl sm:text-4xl`             |      30 / 36px | 700, tight tracking                  |
| 카드 제목    | `text-lg`~`text-xl`                |        18~20px | 600                                  |
| 본문         | `text-base sm:text-lg`             |      16 / 18px | relaxed line-height                  |
| 메타/내비    | `text-xs`~`text-sm`                |        12~14px | muted, 일부 500~600                  |
| eyebrow/role | `text-xs`, `tracking-[.2em]`       |           12px | uppercase, gold/muted                |

### 3.4 레이아웃과 반응형 규칙

- 공통 컨테이너: `max-w-7xl` = `1280px`, `margin-inline: auto`
- 좌우 padding: mobile `16px`, `sm` `24px`, `lg` `32px`
- 기본 섹션 세로 padding: `64px`; About는 `80px`
- Hero 상단: mobile `80px`, `sm` `112px`, `lg` `144px`; 하단 `64px`
- sticky header 높이: 콘텐츠 기준 약 `65px`, `backdrop-blur`와 80% 배경
- breakpoints: `sm 640px`, `md 768px`, `lg 1024px`
- 헤더 전환: `<768px` 전체 화면 모바일 메뉴, `>=768px` 가로 메뉴
- 개발 카드: 1열 → `md` 2열 → `lg` 3열
- 글 카드: 1열 → `md` 3열
- About: 1열 → `lg` 2열
- anchor section: `scroll-mt-24`로 sticky header 여유 96px 확보

## 4. 페이지 구성과 카드 패턴

### 4.1 홈 정보 구조

```text
SiteHeader
└─ main
   ├─ Hero
   ├─ FeaturedDesign
   ├─ DevelopmentProjects
   ├─ StudyNotes
   ├─ OtherPosts
   └─ AboutPreview
SiteFooter
CursorSpotlight (화면 고정 효과)
```

최종 사이트에서는 이 순서를 유지하되 홈은 각 컬렉션의 featured/recent subset만 보여 주고, 모든 섹션에 목록 페이지 링크를 추가한다.

### 4.2 디자인 카드

- 가로 overflow rail이며 카드 폭은 `288px → 320px → 384px`
- 이미지 frame은 표시 데이터의 `aspect`와 무관하게 항상 `4:3`
- frame은 `rounded-xl`, 이미지 hover/focus 시 500ms 동안 `scale(1.05)`
- 제목은 hover/focus에서 gold, 하단에 category 메타 표시
- 현재는 버튼을 눌러 모달을 연다

최종 요구에는 “목록 및 상세”가 있으므로 카드의 주 동작은 `/design/{slug}/` 상세 링크가 되어야 한다. 모달은 빠른 미리보기로만 선택적으로 유지한다. 링크와 모달 버튼을 한 interactive element에 중첩하지 않는다.

### 4.3 개발 프로젝트 카드

- 16:9 cover, 카드 전체는 `surface + border + rounded-xl`
- 내용 영역은 flex column이며 설명이 남은 높이를 채운다
- stack은 muted pill badge
- footer는 상단 구분선 뒤 GitHub/Live 외부 링크
- hover 시 border gold 60%, cover 1.05 확대

샘플의 `repoUrl: https://github.com/`와 `liveUrl: #`는 실제 링크가 아니다. 실제 컬렉션 데이터 검증에서 root GitHub URL과 `#`를 금지해야 한다.

### 4.4 학습 목록

- 상·하 border와 항목 사이 divide line
- mobile은 세로, `sm` 이상은 제목/화살표 가로 정렬
- category gold tint badge, 날짜, 제목, hashtag
- hover는 제목과 우측 화살표만 gold

이어드림처럼 계층이 있는 학습 기록에는 이 평면 목록만으로 부족하다. 목록 페이지에서는 program/track/week 필터 또는 그룹 heading을 제공하고, 상세 페이지는 breadcrumb와 목차를 사용한다.

### 4.5 기타 글 카드

- `md` 3열, 동일 높이 카드
- 날짜·읽기 시간 → 제목 → excerpt
- hover 시 border와 제목만 gold
- 읽기 시간은 frontmatter의 고정 문자열보다 본문에서 계산하는 편이 안전하다

### 4.6 About와 footer

- About는 `navy-deep / 40%` 전폭 band, 내부 2열
- 왼쪽 eyebrow+headline, 오른쪽 소개+skill pill+outline CTA
- footer는 소개/사이트 링크/메일·GitHub 아이콘의 3영역, 아래 copyright
- About 상세는 `/about/`로 분리하고 홈에는 preview만 둔다

## 5. 인터랙션과 접근성

| 인터랙션           | 현재 구현                                            | 유지할 점                                  | Astro 변환 시 보완                                                                     |
| ------------------ | ---------------------------------------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------- |
| 데스크톱 활성 메뉴 | `IntersectionObserver`, 좁은 중앙 root margin        | 현재 섹션 gold 표시                        | 상세 페이지에서는 pathname 기반 active와 구분                                          |
| 모바일 메뉴        | full-screen overlay, opacity transition              | body scroll lock, Escape, open/close label | focus trap, 첫 링크 focus, 닫힌 뒤 toggle로 focus 복귀, backdrop inert 처리            |
| 부드러운 스크롤    | CSS `scroll-behavior: smooth`                        | anchor navigation                          | reduced-motion에서는 auto 유지                                                         |
| 디자인 모달        | Radix Dialog                                         | focus 관리·Escape·aria의 방향              | 목록/상세 링크를 기본으로 하고 `<dialog>` 또는 검증된 작은 island 사용                 |
| 카드 hover         | color/border/image scale                             | 500ms의 절제된 motion                      | `focus-visible`과 touch 상태 동등성 보장                                               |
| cursor spotlight   | mousemove마다 React state, 380/700px radial gradient | 독특한 gold ambient effect                 | `(pointer:fine)`에서만 rAF+CSS 변수로 갱신, coarse pointer 비활성, reduced-motion 존중 |
| 가로 rail          | native overflow, thin scrollbar                      | 키보드/터치 기본 동작                      | 보이는 focus, scroll snap 선택 검토, arrow control은 필수 아님                         |

현재 페이지는 `prefers-reduced-motion`에서 animation/transition을 거의 제거하는 전역 규칙이 있어 보존 가치가 높다. 반면 모바일 메뉴에는 완전한 focus trap이 없고, spotlight는 모바일에서도 DOM에 남으며, 페이지 전체가 `"use client"`여서 정적 사이트에 과한 hydration이 발생한다.

## 6. 데이터와 이미지의 성격

`lib/portfolio-data.ts`는 Astro 이전을 염두에 둔 정적 샘플 데이터지만 실콘텐츠 원본으로 쓰면 안 된다.

- 디자인 5개, 개발 3개, 학습 4개, 기타 글 3개는 모두 샘플
- 디자인/개발 이미지 8개는 전부 1024×1024의 v0 샘플 asset
- 개발 저장소 URL은 GitHub root, Live URL은 `#`
- 게시물·학습 항목에는 본문이 없다
- `hello@choeyoojeong.dev`는 Jekyll의 `cheezmicro@gmail.com`과 충돌하므로 소유자 확인이 필요
- 아이콘과 placeholder도 최종 브랜드 asset이 아니다

따라서 디자인을 옮길 때 데이터 shape만 참고하고, 값은 기존 저장소에서 검증한 콘텐츠 또는 새로 확인한 실제 콘텐츠로 교체한다.

## 7. Astro 컴포넌트 변환안

| v0 소스                    | Astro 목표                                                      | 렌더링 방식             | 변환 원칙                                                      |
| -------------------------- | --------------------------------------------------------------- | ----------------------- | -------------------------------------------------------------- |
| `app/layout.tsx`           | `layouts/BaseLayout.astro`                                      | static                  | lang, canonical, metadata, icon, global CSS 중앙화             |
| `app/page.tsx`             | `pages/index.astro`                                             | static                  | 컬렉션 query 후 section 조합; 전체 React 제거                  |
| `site-header.tsx`          | `components/layout/SiteHeader.astro` + `scripts/site-header.ts` | static + 작은 script    | pathname/section active, 접근 가능한 모바일 dialog             |
| `hero.tsx`                 | `components/home/Hero.astro`                                    | static                  | 토큰·반응형 typography 보존                                    |
| `section-heading.tsx`      | `components/ui/SectionHeading.astro`                            | static                  | `action`은 named slot으로 변환                                 |
| `featured-design.tsx`      | `components/home/FeaturedDesign.astro`                          | static                  | design 컬렉션의 featured subset, 상세 링크 기본                |
| `project-modal.tsx`        | `components/design/ProjectPreview.astro`                        | optional enhancement    | native dialog 또는 작은 framework island; 상세 route 대체 금지 |
| `development-projects.tsx` | `components/home/FeaturedProjects.astro`                        | static                  | projects 컬렉션 query                                          |
| `study-notes.tsx`          | `components/home/RecentStudy.astro`                             | static                  | 실제 날짜/상태 정렬                                            |
| `other-posts.tsx`          | `components/home/RecentPosts.astro`                             | static                  | 글 본문 기반 reading time                                      |
| `about-preview.tsx`        | `components/home/AboutPreview.astro`                            | static                  | `/about/` 링크                                                 |
| `site-footer.tsx`          | `components/layout/SiteFooter.astro`                            | static                  | site config 공유                                               |
| `cursor-spotlight.tsx`     | `components/effects/CursorSpotlight.astro` + script             | progressive enhancement | React state 대신 CSS 변수+rAF                                  |
| `next/image`               | Astro `<Image />` 또는 `<img>`                                  | build/static            | 새 자산은 최적화; legacy URL 보존 자산은 `public/` 유지        |
| `lucide-react`             | inline SVG 또는 Astro 호환 icon                                 | static                  | 필요한 아이콘만 포함                                           |
| shadcn/Radix 묶음          | semantic HTML + 최소 interaction                                | 대부분 제거             | 사용하지 않는 56개 UI를 이식하지 않음                          |

### 권장 디렉터리

```text
src/
├─ components/
│  ├─ layout/        SiteHeader, SiteFooter
│  ├─ home/          Hero, FeaturedDesign, FeaturedProjects, RecentStudy, RecentPosts, AboutPreview
│  ├─ cards/         DesignCard, ProjectCard, StudyRow, PostCard
│  ├─ content/       ContentHeader, Prose, TagList, Gallery, PrevNext
│  └─ effects/       CursorSpotlight
├─ layouts/          BaseLayout, ContentLayout
├─ pages/
│  ├─ index.astro
│  ├─ design/{index,[...slug]}.astro
│  ├─ projects/{index,[...slug]}.astro
│  ├─ study/{index,[...slug]}.astro
│  ├─ posts/{index,[...slug]}.astro
│  └─ about.astro
├─ content/
│  ├─ design/
│  ├─ projects/
│  ├─ study/
│  └─ posts/
├─ data/             site.ts, navigation.ts, legacy-routes.ts
├─ scripts/          site-header.ts, cursor-spotlight.ts, optional-dialog.ts
└─ styles/           tokens.css, global.css, prose.css
```

## 8. 시각적 동등성 체크포인트

- 320, 375, 768, 1024, 1280, 1440px에서 overflow와 줄바꿈 확인
- header blur, 1px border, container 좌우 여백, Hero typography를 screenshot 비교
- gold가 CTA·eyebrow·active·focus에만 쓰이고 넓은 면적을 과도하게 차지하지 않는지 확인
- card radius, 4:3/16:9 비율, 500ms image scale, muted text 대비 확인
- 키보드만으로 메뉴, 카드, dialog, 외부 링크 이동 가능
- reduced-motion과 coarse pointer에서 spotlight/transition이 안전하게 비활성화
- 홈 카드가 모두 실제 상세 URL로 연결되고 샘플 `#` 링크가 남지 않음

## 9. 결정이 필요한 항목

1. 공개 이름: `CHEEZCYJ`와 `CHOE YOOJEONG` 중 canonical 표기
2. 공개 이메일: 기존 Gmail과 v0 샘플 도메인 중 실제 주소
3. 한글 글꼴 전략과 self-host 여부
4. 디자인 카드의 modal preview 유지 여부
5. v0 생성 샘플 이미지의 완전 교체 시점
6. 연락 기능을 둘 경우 정적 호스팅에 맞는 외부 처리 방식과 개인정보 고지

이 문서는 변환 설계만 정의하며 Astro 파일이나 컴포넌트는 구현하지 않았다.
