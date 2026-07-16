# Astro Foundation Implementation Report

## 범위와 작업 브랜치

- 작업 브랜치: `redesign/astro-v0`
- 기준 분석 문서 커밋: `5e503bf` (`docs: add astro migration analysis`)
- Jekyll 보존 브랜치: `legacy-jekyll` → `63b397e42164bac6d50149c14b7901da5a67e42d`
- 구현 범위: Phase 1(Astro skeleton)과 Phase 2(v0 design foundation)
- 제외 범위: 콘텐츠 컬렉션, 목록/상세 페이지, 기존 콘텐츠·이미지 이전, Jekyll 제거, 배포 전환

## 도구와 버전

| 항목                   | 버전/설정                       |
| ---------------------- | ------------------------------- |
| Node.js                | 24.14.0                         |
| package manager        | pnpm 11.9.0                     |
| Astro                  | 7.0.9                           |
| TypeScript             | 6.0.3, `astro/tsconfigs/strict` |
| Tailwind CSS           | 4.3.2                           |
| Tailwind Vite 플러그인 | `@tailwindcss/vite` 4.3.2       |
| 출력 방식              | `static`                        |
| 사이트 URL             | `https://cheezcyj.github.io`    |

TypeScript 7.0.2는 현재 `astro check`가 사용하는 프로그래매틱 API를 제공하지 않아 검사에 실패했다. Astro 검사 도구가 지원하는 최신 6.x인 6.0.3으로 고정했다.

## 생성한 기반 구조

```text
src/
├─ components/
│  ├─ effects/CursorSpotlight.astro
│  ├─ home/Hero.astro
│  ├─ layout/SiteFooter.astro
│  ├─ layout/SiteHeader.astro
│  └─ ui/
│     ├─ SectionHeading.astro
│     └─ SkipToContent.astro
├─ config/site.ts
├─ layouts/BaseLayout.astro
├─ pages/index.astro
├─ scripts/
│  ├─ cursor-spotlight.ts
│  └─ site-header.ts
└─ styles/
   ├─ global.css
   └─ tokens.css
public/.gitkeep
```

루트에는 Astro·TypeScript·Prettier 설정, pnpm 잠금 파일, Tailwind Vite 연결, 검사 전용 GitHub Actions workflow를 추가했다. 기존 Pages 배포 workflow는 변경하지 않았다.

## 구현한 디자인 토큰

역할 중심의 `--site-*` CSS custom property와 Tailwind CSS 4 `@theme inline` 토큰을 연결했다.

| 역할          | 값                         |
| ------------- | -------------------------- |
| background    | `#070b16`                  |
| text          | `#f4ecd8`                  |
| surface       | `#0d1524`                  |
| surface-muted | `#131c2c`                  |
| text-muted    | `#94a0b0`                  |
| accent        | `#e6a700`                  |
| accent-strong | `#b87900`                  |
| navy          | `#2c3e50`                  |
| navy-deep     | `#233140`                  |
| border        | `rgba(244, 236, 216, 0.1)` |
| focus         | `#e6a700`                  |

추가로 유동형 타이포그래피, 간격, 최대 콘텐츠 폭 1280px, 반응형 좌우 여백(16/24/32px), radius, border, transition, z-index, 공통 focus-visible 스타일을 정의했다.

## v0에서 가져온 요소

- 어두운 네이비 블랙 배경과 크림색 본문, 골드 포인트의 시각 언어
- 큰 이름과 2행 영문 문구를 중심으로 한 넓은 여백의 Hero 구성
- sticky·반투명·backdrop blur 헤더
- 데스크톱 수평 내비게이션과 모바일 전체 화면 메뉴
- 작은 대문자 eyebrow와 굵은 제목을 조합한 섹션 헤딩
- 미세한 테두리, pill CTA, 절제된 hover/focus 전환
- 데스크톱 fine pointer 환경용 cursor spotlight 개념

## 가져오지 않은 요소

- Next.js, React, `next/font`, React island
- shadcn/ui와 Radix 의존성 및 의미가 다른 `primary`/`secondary` 토큰 복사
- v0 샘플 카드, 샘플 프로젝트명, 샘플 이미지, Lorem ipsum
- 콘텐츠 컬렉션과 실제 목록·상세 데이터
- 임의의 OG 이미지와 favicon
- Bootstrap/jQuery 신규 코드

`index.astro`에는 Header, Hero, 다섯 개의 `SectionHeading` 기반 empty section shell, Footer, CursorSpotlight만 배치했다.

## 메타데이터와 글꼴

`src/config/site.ts`에 이름, 별칭, URL, 이메일, GitHub, 역할과 한국어 설명을 한곳에 정의했다. `BaseLayout.astro`에는 `lang=ko`, title, description, viewport, canonical, theme-color과 텍스트 기반 Open Graph 메타데이터를 적용했다. OG 이미지와 favicon은 후속 결정으로 남겼다.

폰트 바이너리는 추가하거나 다운로드하지 않았다. 영문은 설치된 경우 Geist를 우선하고, 한글은 Pretendard/Noto Sans KR, 최종적으로 system UI를 사용한다. self-host 대상과 라이선스·서브셋 전략은 후속 Phase에서 결정해야 한다.

## 모바일 메뉴 접근성

- `aria-expanded`, `aria-controls`, dialog의 `aria-modal`과 이름 제공
- 열릴 때 닫기 버튼으로 초점 이동
- Tab/Shift+Tab focus trap
- Escape로 닫기
- 닫힐 때 햄버거 버튼으로 초점 복귀
- 열려 있는 동안 body scroll lock과 본문/푸터 inert 처리
- 메뉴 링크 선택 시 닫기
- 768px 이상으로 전환될 때 모바일 메뉴 닫기
- `prefers-reduced-motion`에서 전환 제거
- 키보드 포커스 시 화면에 나타나는 `SkipToContent`

## Cursor spotlight

Astro 정적 컴포넌트와 vanilla TypeScript로 구현했다. 포인터 좌표는 `requestAnimationFrame` 한 번당 CSS custom property로 전달하고, spotlight 요소는 `pointer-events: none`과 `aria-hidden=true`를 사용한다. `(pointer: fine)`이 아니거나 `prefers-reduced-motion: reduce`이면 초기화하지 않고 CSS에서도 숨긴다. React state나 island는 사용하지 않았다.

## 검증 결과

### 명령 검증

- `pnpm install`: 성공
- `pnpm check`: 성공 — 13개 파일, 오류 0, 경고 0, 힌트 0
- `pnpm build`: 성공 — 정적 경로 `/index.html` 1개 생성
- 금지 의존성 검색: 신규 Astro 구성에서 Next.js, React, shadcn, Radix, Bootstrap, jQuery 참조 없음

샌드박스 안의 첫 빌드는 Windows가 esbuild 하위 프로세스 실행을 `EPERM`으로 막아 실패했다. 동일 소스에서 하위 프로세스 실행이 허용된 로컬 검증으로 다시 실행해 성공했으므로 애플리케이션 빌드 오류는 아니다.

### 로컬 브라우저 검증

- 1440×900: 데스크톱 내비게이션 표시, 햄버거 숨김, 가로 overflow 없음
- 390×844: 데스크톱 내비게이션 숨김, 햄버거 표시, 유동형 Hero 타이포그래피, 가로 overflow 없음
- 모바일 메뉴: 열기/닫기, scroll lock, 첫 초점, focus trap, Escape, 버튼 초점 복귀 확인
- 스킵 링크: 키보드 초점에서 화면 좌상단에 노출되고 focus outline 표시 확인
- 메타데이터: `lang=ko`, canonical, title 확인
- 콘솔: 두 뷰포트 모두 error/warning 없음
- 테스트 환경이 `prefers-reduced-motion: reduce`였으며 spotlight가 숨겨지는 것을 확인했다. fine pointer의 일반 모션 상태는 코드·미디어 쿼리 검사로 확인했고 실제 포인터 추적 시각 검증은 후속 회귀 점검에 남긴다.

초기 데스크톱 QA에서 컴포넌트의 `display: grid`가 Tailwind `md:hidden`보다 뒤에 선언되어 햄버거가 함께 표시되는 충돌을 발견했다. 48rem 이상에서 메뉴 토글과 모바일 dialog를 명시적으로 숨기는 media query를 추가하고 재검증했다.

## 기존 Jekyll 보호 상태

기준 revision `63b397e`와 비교해 다음 보호 대상에는 변경이 없다.

- `_posts/**`, `_includes/**`, `_layouts/**`
- `img/**`, `js/**`, `css/**`
- `_config.yml`, `Gemfile`, gemspec
- `.github/workflows/pages.yml`

기존 파일 삭제·이동, 기존 이미지 URL 보존 작업, Jekyll 제거, Pages 배포 전환은 시작하지 않았다. `../cheezcyj-blog-redesign`도 변경하지 않았다.

## 다음 Phase

Phase 3에서 먼저 콘텐츠 컬렉션 스키마와 URL·asset 이전 규칙을 확정한다. 이어서 실제 Jekyll 콘텐츠를 검증하며 design, projects, study, posts 컬렉션으로 옮기고 목록·상세 페이지를 구현한다. OG 이미지, favicon, self-host 폰트와 전체 320/375/768/1024/1280/1440 회귀 매트릭스도 그 이후 별도 결정·검증 항목으로 유지한다.
