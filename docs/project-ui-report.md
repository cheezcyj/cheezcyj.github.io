# Phase 4B-2 프로젝트 UI 구현 보고서

작성일: 2026-07-16
대상 브랜치: `redesign/astro-v0`
범위: v0 기반 프로젝트 카드, 수평 레일, 목록과 상세 페이지

## 1. 구현 결과

- `ProjectCard.astro`: projects entry를 표시하는 재사용 카드
- `ProjectMedia.astro`: 승인 cover 또는 token 기반 neutral fallback
- `ProjectMeta.astro`: 상태, 기간, 역할과 기술 meta
- `HorizontalRail.astro`: native horizontal overflow와 선택적 이동 버튼
- `horizontal-rail.ts`: overflow·버튼 상태와 카드 단위 이동을 담당하는 Vanilla TypeScript
- `ProjectLayout.astro`: 프로젝트 전용 hero, meta, highlights, Markdown 본문과 이전/다음 확장 영역
- `projects/[...id].astro`: collection-relative ID 기반 정적 상세 route
- `projects.ts`: 상태명, 월 단위 날짜, 기간과 canonical project path 유틸리티

React island, shadcn, Radix 또는 신규 UI 의존성은 추가하지 않았다.

## 2. v0에서 참고한 카드 요소

- 16:9 media
- `#0d1524` surface와 1px 반투명 border
- 기존 extra-large radius
- hover와 focus-within의 골드 계열 border
- 실제 cover가 있을 때 500ms 동안 약 `scale(1.05)` 확대
- muted surface의 stack pill
- 작은 status eyebrow
- 제목 hover/focus accent 전환
- 과도한 그림자 없이 색상·경계로 만든 깊이

v0의 Next.js/React 코드, 샘플 프로젝트 데이터와 샘플 이미지는 복사하지 않았다.

## 3. Astro로 변경한 요소

- 카드, 목록과 상세 본문은 Astro 정적 HTML로 렌더링한다.
- 카드의 media·제목·하단 CTA는 실제 상세 URL로 연결한다.
- repository는 카드 내부의 별도 외부 링크이므로 링크 중첩이 없다.
- 상세 정보는 모달이 아니라 canonical route에서 읽는다.
- 상태와 날짜 표시는 공통 TypeScript 유틸리티로 관리한다.
- 실제 이미지가 없는 동안 CSS gradient와 grid만 사용하는 fallback을 제공한다.

## 4. HorizontalRail

레일은 `overflow-x: auto`, `scroll-snap`, `scroll-padding-inline`과 `overscroll-behavior-inline: contain`을 사용한다. JavaScript가 없어도 마우스, 트랙패드와 touch swipe로 native scroll할 수 있으며 세로 wheel 이벤트를 가로채지 않는다. 얇은 브랜드 scrollbar를 유지하고 완전히 숨기지 않는다.

카드 폭은 mobile `288px`, small viewport `320px`, desktop `384px`이며 gap은 `20px → 24px`다. 첫 카드와 마지막 카드는 viewport padding을 이용해 site container 여백에 맞춘다.

선택적 이전·다음 버튼은 초기 HTML에서 숨겨진다. JavaScript가 실제 overflow를 확인한 뒤 1024px 이상에서만 표시하고, 한 번에 첫 카드 폭과 gap만큼 이동한다. 첫 위치와 마지막 위치의 disabled 상태는 scroll/resize 후 다시 계산한다. scroll 처리는 `requestAnimationFrame`으로 조절하고 `ResizeObserver`와 abort signal로 정리한다. reduced-motion에서는 즉시 이동한다.

현재 entry가 하나뿐이라 데스크톱에서 실제 overflow가 발생하지 않았고 이동 버튼은 의도대로 숨겨졌다. 여러 카드에서의 실제 버튼 클릭·마지막 위치 disabled 검증은 다음 실제 project entry가 등록될 때 재실행해야 한다.

## 5. ProjectCard

카드는 semantic `article`이며 홈 레일과 목록 grid의 `li` 안에서 사용한다. 다음 정보를 표시한다.

- cover 또는 neutral media fallback
- 상태와 개발 전용 `Draft Preview` badge
- 제목과 설명
- 시작 월
- stack badge
- 상세 링크와 실제 repository 링크

필수 정보는 hover에 의존하지 않는다. 상세 링크와 외부 링크는 중첩되지 않으며 GitHub 링크는 `target="_blank"`, `rel="noreferrer"`를 사용한다. `demoUrl`이 없으므로 Live Demo 또는 비활성 `#` 링크는 출력하지 않는다.

## 6. Cover fallback

현재 프로젝트는 승인된 `cover.webp`를 공통 `ProjectMedia`로 렌더링한다. 카드와 상세 hero 모두 frontmatter의 alt, width와 height를 사용하고 16:9 공간을 예약하므로 layout shift를 줄인다. 목록 이미지는 lazy loading을 사용하며 기존 500ms 확대, focus 상태와 reduced-motion 규칙을 유지한다.

cover가 없는 다른 프로젝트에서는 기존 neutral fallback이 계속 표시된다. 특정 프로젝트를 위한 하드코딩 분기는 추가하지 않았다.

## 7. 목록 grid

`/projects/`는 홈 레일을 반복하지 않고 반응형 grid를 사용한다.

- mobile: 1열
- 768px 이상: 2열
- 1024px 이상: 3열

카드는 grid cell의 높이를 채우고 설명은 최대 세 줄로 제한한다. 개발 환경에서 비공개 entry가 포함되면 목록 위에 `Local Draft Preview` 안내와 카드 badge를 함께 표시한다.

## 8. 상세 route와 layout

상세 route는 `src/pages/projects/[...id].astro`이며 frontmatter slug가 아니라 collection-relative `entry.id`를 사용한다. 현재 개발 미리보기 URL은 `/projects/cheezcyj-portfolio-redesign/`이다.

`ProjectLayout`은 breadcrumb, 상태, 큰 제목, 설명, 외부 링크, 승인 cover, 역할·기술·기간 meta, highlights, Markdown 본문, gallery, 목록 복귀와 향후 previous/next 링크를 지원한다. 1024px 이상에서는 media와 meta가 2열, 모바일에서는 1열이다. 본문 폭은 약 47rem으로 제한했다.

Markdown의 `# 프로젝트 개요`를 `## 프로젝트 개요`로 보정했다. layout의 프로젝트 제목만 `h1`이며 본문과 gallery 제목 `화면 구성`은 `h2`라 상세 페이지의 heading hierarchy가 하나의 `h1` 아래로 정리된다.

## 9. Dev-only draft preview

홈, 목록과 `getStaticPaths()`에서 `import.meta.env.DEV`를 명시적으로 검사한다.

- 개발 환경: `getCollection('projects')`를 직접 읽어 draft도 정적 HTML로 미리보기
- production: 기존 `getPublishedEntries('projects')`만 사용
- preview entry: `Draft Preview` badge 표시
- preview 상세: `robots="noindex, nofollow"`
- canonical: production 공개 형식인 `/projects/{collection-relative-id}/`

query parameter, 쿠키, 공개 JSON, 범용 preview API 또는 client-side draft 직렬화는 추가하지 않았다.

## 10. Production draft 차단

production query는 기존 publication policy를 우회하지 않는다. `draft: true`인 현재 entry는 홈과 목록 결과에 포함되지 않고 production `getStaticPaths()`에도 전달되지 않는다. 따라서 production HTML, client JavaScript, feed/sitemap 후보와 상세 route에 draft 데이터가 없다.

## 11. 접근성

- 레일에 의미 있는 `region` 이름과 키보드 focus target 제공
- 카드 안의 모든 링크를 순서대로 탐색할 수 있는 semantic HTML
- 전역 2px 골드 `focus-visible`과 카드 `focus-within` border
- 이동 버튼 `aria-label`, `aria-controls`, native `disabled`
- fallback `role="img"`와 설명적인 접근성 이름
- breadcrumb와 previous/next navigation label
- 외부 링크 목적을 텍스트로 제공
- hover에서만 나타나는 필수 정보 없음
- reduced-motion에서 scroll과 transition을 즉시 처리

브라우저에서 레일 focus target의 2px 골드 outline과 카드 링크의 접근 가능한 이름을 확인했다.

## 12. 반응형·브라우저 검증

| Viewport | 홈 레일 카드 | 목록 grid | 페이지 가로 overflow |
| -------- | ------------ | --------- | -------------------- |
| 320px    | 288px        | 1열       | 없음                 |
| 375px    | 288px        | 1열       | 없음                 |
| 768px    | 320px        | 2열       | 없음                 |
| 1024px   | 384px        | 3열       | 없음                 |
| 1280px   | 384px        | 3열       | 없음                 |
| 1440px   | 384px        | 3열       | 없음                 |

320px에서 기존 전역 `min-width: 20rem`과 Windows scrollbar 폭이 겹쳐 발생하던 문서 overflow를 제거했다. 이후 페이지 전체 overflow는 없고 홈 레일 내부에만 native horizontal overflow가 남는다.

375px 상세 화면은 1열, 16:9 fallback, 줄바꿈되는 큰 제목과 meta를 유지했고 1440px에서는 media/meta 2열을 확인했다. 홈, 목록과 상세의 브라우저 console error는 0건이었다. 검증 브라우저가 reduced-motion을 선호해 scroll snap은 비활성화되고 focus·레이아웃은 그대로 유지되는 것도 확인했다.

## 13. Phase 4B-4 gallery 구현

승인된 세 gallery 이미지를 Markdown 본문 다음, 목록 복귀 footer 이전에 배치했다. 첫 desktop rail은 전체 너비이고 두 모바일 이미지는 768px 이상에서 2열, 그보다 작은 화면에서 1열이다. 각 항목은 semantic `figure`와 비율을 강제 crop하지 않는 `img`로 구성하며 lazy loading, 한국어 alt, 실제 width와 height를 사용한다. 기존 border, radius와 surface token만 사용했고 modal, 클릭 확대와 별도 프레임 효과는 추가하지 않았다.

카드와 상세 cover, gallery, 정확히 하나인 `h1`, 이미지 로드와 가로 overflow를 320, 375, 390, 768, 1024, 1280, 1440px 개발 화면에서 검증했다. 모든 폭에서 가로 overflow와 깨진 이미지가 0건이었고 Console error도 0건이었다. 세부 결과는 `project-media-integration-report.md`에 기록했다.

`draft: true`, `featured: false`와 `sourceStatus: verified`는 유지한다. 정량 성과, Linux 원격 CI, GitHub Pages 배포, main 병합과 production 공개 승인은 아직 완료로 간주하지 않는다.
