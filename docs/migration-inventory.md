# 마이그레이션 인벤토리

작성일: 2026-07-16  
대상 브랜치: 로컬 docs/astro-migration-analysis  
대상 revision: Jekyll 63b397e, v0 9b61046

## 1. 조사 범위와 방법

- .git, node_modules, .next, dist 같은 저장소 메타데이터·설치/빌드 산출물은 파일 수에서 제외했다.
- v0 저장소 103개, Jekyll 저장소 67개, 총 170개 파일을 열거했다.
- 모든 텍스트는 UTF-8로 다시 읽었고 Jekyll 이미지 9개와 v0 `public` 자산 17개의 크기·참조 위치를 확인했다.
- Jekyll 23개 전체 commit 이력, 삭제 이력, frontmatter, Liquid include, CSS/JS, Pages workflow를 조사했다.
- 소스 변경 없이 임시 디렉터리에 Jekyll을 1회 build하여 실제 출력 경로 충돌과 feed URL을 확인했다.
- GitHub 연결을 읽기 전용으로 확인한 결과 두 저장소는 공개 저장소이며 기본 브랜치는 모두 main이다.

## 2. 분류 기준

| 분류                | 의미                                                  | 삭제 허용 시점                                           |
| ------------------- | ----------------------------------------------------- | -------------------------------------------------------- |
| PRESERVE            | 파일 바이트, URL 또는 저장소 운영 이력을 그대로 유지  | 원칙적으로 삭제하지 않음                                 |
| MIGRATE             | 콘텐츠·토큰·행동 요구를 새 Astro 파일/컬렉션으로 변환 | 변환 결과와 source mapping 검증 후                       |
| REPLACE             | 같은 책임을 Astro/새 자산/새 workflow가 대신함        | 대체품 build·route·시각 검증 후                          |
| REMOVE_AFTER_VERIFY | 최종 구조에는 불필요하지만 현재 단계에서 삭제 금지    | 백업·참조 0건·회귀 테스트를 모두 통과한 마지막 정리 단계 |

분류는 이번 단계의 삭제 지시가 아니다. 특히 REMOVE_AFTER_VERIFY도 현재는 그대로 보존한다.

### 분류 집계

| 저장소             | PRESERVE | MIGRATE | REPLACE | REMOVE_AFTER_VERIFY | 합계 |
| ------------------ | -------: | ------: | ------: | ------------------: | ---: |
| v0 참고 원본       |        0 |      16 |      18 |                  69 |  103 |
| Jekyll 대상 저장소 |       11 |      18 |       7 |                  31 |   67 |
| 합계               |       11 |      34 |      25 |                 100 |  170 |

## 3. 저장소 구조 요약

### v0 참고 원본

```text
app/              4   Next layout/home/global CSS/contact server action
components/      70   홈 컴포넌트 13 + shadcn UI 57
hooks/            2   shadcn hooks
lib/              2   샘플 데이터, className helper
public/          17   샘플 작품 8, 아이콘 4, placeholder 5
styles/           1   미사용 중복 global CSS
root              7   Next/pnpm/Tailwind/TypeScript 설정
합계            103
```

### Jekyll 대상 저장소

```text
.github/          2   issue template, Pages workflow
_includes/       15   Liquid partial, Bootstrap/custom CSS, 모달
_layouts/         2   HTML/CSS Liquid layout
_posts/           6   본문 없는 placeholder frontmatter
css/             10   Font Awesome CSS/font
img/              8   profile 2, portfolio 6
js/              11   jQuery/Bootstrap/theme/custom script
mail/             1   GitHub Pages에서 실행되지 않는 PHP
root             12   config, build, feed, README, screenshot 등
합계             67
```

## 4. 기존 콘텐츠 인벤토리

### 4.1 Jekyll posts

모든 post는 Markdown 본문이 없고 frontmatter만 있다. 여섯 개 모두 layout: default, alt: image-alt, project-date: April 2014, client: Start Bootstrap, category: Web Development, 동일한 Lorem ipsum 설명을 가진다.

| source                        | title     | modal | image         | 특이사항                          | 마이그레이션 판단                          |
| ----------------------------- | --------- | ----: | ------------- | --------------------------------- | ------------------------------------------ |
| 2014-07-18-project-1.markdown | posting 1 |     1 | cabin.png     | posting-title: yeardreamschool6th | study overview + legacy placeholder로 분리 |
| 2014-07-17-project-2.markdown | posting 2 |     2 | cake.png      | 실본문 없음                       | 소유자 확인 전 draft/legacy                |
| 2014-07-16-project-3.markdown | posting 3 |     3 | circus.png    | 실본문 없음                       | 소유자 확인 전 draft/legacy                |
| 2014-07-15-project-4.markdown | posting 4 |     4 | game.png      | 실본문 없음                       | 소유자 확인 전 draft/legacy                |
| 2014-07-14-project-5.markdown | posting 5 |     5 | safe.png      | 2026-07-04에 image 위치 교체      | 소유자 확인 전 draft/legacy                |
| 2014-07-13-project-6.markdown | posting 6 |     6 | submarine.png | 2026-07-04에 image 위치 교체      | 소유자 확인 전 draft/legacy                |

과거 commit a1c203c에서 모달의 description/client/date/service 출력이 제거되었지만, 제거된 값도 Start Bootstrap/Lorem ipsum placeholder였다. Git 이력에는 별도의 실프로젝트 본문이나 삭제된 콘텐츠 파일이 없다.

### 4.2 이어드림 하드코딩 기록

이어드림 기록은 post 본문이 아니라 _includes/modals.html 안의 46개 링크로만 존재한다. js/freelancer.js는 클릭한 링크의 week/title을 content panel에 옮기지만 summary를 즉시 비우므로 학습 본문은 현재 저장소에 없다.

| 묶음             | 상위/중간 항목 포함 개수 | 하위 주제                                                    |
| ---------------- | -----------------------: | ------------------------------------------------------------ |
| 1주차            |                        6 | IT리터러시, 운영체제/리눅스, 네트워크, 파이썬 기본 1·2       |
| 2주차            |                        6 | 파이썬 중급, 라이브러리, 생성형 AI, SQL 시작/함수·서브쿼리   |
| 3주차            |                        6 | SQL 계층/Join/그룹·윈도우, DB 개요/모델링                    |
| 4주차            |                        5 | NumPy, pandas/시각화, 통계 요약/추론                         |
| AI실무기본 1주차 |                       15 | 데이터 분석 과정·프로젝트·머신러닝 기초·수학 I/II와 세부 9개 |
| AI실무기본 2주차 |                        6 | 수학 III, 프로젝트 과정, 데이터 처리 I/II, 머신러닝 심화 I   |
| AI실무기본 3주차 |                        1 | 제목만 존재                                                  |
| AI실무기본 4주차 |                        1 | 제목만 존재                                                  |
| 합계             |                       46 | 모두 목차 수준                                               |

정확한 계층은 다음과 같다.

- 1주차: 01_IT리터러시, 02_핵심운영체제와리눅스기초, 03_네트워크, 04_파이썬기본문법1, 05_파이썬기본문법2
- 2주차: 01_파이썬중급문법2, 02_파이썬라이브러리활용, 03_생성형AI기초, 04_SQL시작하기, 05_SQL함수와서브쿼리
- 3주차: 01_집합연산자와계층형질의, 02_JOIN및서브쿼리심화, 03_그룹함수_윈도우함수, 04_데이터베이스개요, 05_데이터모델링과데이터베이스구현
- 4주차: 01_데이터리터러시와NumPy기초, 02_pandas와데이터시각화, 03_통계자료요약, 04_확률과통계적추론
- AI실무기본_1주차
  - 01_데이터분석프로젝트과정: 파이썬데이터분석, 빅데이터와파이썬, 데이터처리, EDA
  - 02_데이터분석프로젝트: 유가/주유소 시장분석, 지하철 승하차 혼잡도분석, 요소수/주유소 재고분석
  - 03_머신러닝기초: 인공지능과머신러닝소개, 머신러닝 준비 라이브러리
  - 04_머신러닝을위한수학I, 05_머신러닝을위한수학II
- AI실무기본_2주차: 01_머신러닝을위한수학III, 02_머신러닝프로젝트진행과정, 03_머신러닝적용을위한데이터처리_I, 04_머신러닝적용을위한데이터처리_II, 05_머신러닝심화_I
- AI실무기본_3주차, AI실무기본_4주차: 하위 항목 없음

마이그레이션 시 이 46개를 완성된 글로 공개하지 않는다. contentStatus: inventory-only로 가져오거나 실제 노트가 확인된 항목만 개별 study entry로 승격한다.

### 4.3 이미지

| 경로                         |     크기 | 현재 참조    | 처리                                          |
| ---------------------------- | -------: | ------------ | --------------------------------------------- |
| /img/profile.png             |  256×256 | header       | 동일 URL·바이트 보존                          |
| /img/profile2.png            |  256×256 | 참조 없음    | legacy asset으로 보존 후 사용 결정            |
| /img/portfolio/cabin.png     |  900×650 | modal/post 1 | 동일 URL 보존, 이어드림 placeholder 관계 기록 |
| /img/portfolio/cake.png      |  900×650 | modal/post 2 | 동일 URL 보존                                 |
| /img/portfolio/circus.png    |  900×650 | modal/post 3 | 동일 URL 보존                                 |
| /img/portfolio/game.png      |  900×650 | modal/post 4 | 동일 URL 보존                                 |
| /img/portfolio/safe.png      |  900×650 | modal/post 5 | 동일 URL 보존                                 |
| /img/portfolio/submarine.png |  900×650 | modal/post 6 | 동일 URL 보존                                 |
| /screenshot.png              | 1377×686 | 문서 참조용  | 기존 시각 baseline으로 보존                   |

portfolio 6개는 Start Bootstrap Freelancer 샘플 일러스트로 보이며 실제 작품 증거가 없다. 보존과 공개 활용은 별개다. 최종 카드에는 실제 작품 이미지가 확인될 때까지 노출하지 않거나 “legacy template placeholder”로 표시한다. LICENCE는 자산 출처 추적을 위해 보존한다.

v0의 8개 작품 이미지는 모두 1024×1024 샘플이며 실제 콘텐츠로 분류하지 않는다. favicon/app icon 4개도 최종 브랜드 자산으로 교체 대상이다.

### 4.4 하드코딩된 사이트 정보 충돌

| 항목                 | Jekyll                                     | v0                                           | 위험/결정                      |
| -------------------- | ------------------------------------------ | -------------------------------------------- | ------------------------------ |
| 이름                 | CHEEZCYJ                                   | CHOE YOOJEONG                                | canonical 브랜드명 확인        |
| 이메일               | cheezmicro@gmail.com                       | v0 템플릿 샘플 연락처                        | 기존 공개 연락처 유지 승인     |
| GitHub               | http://github.com/cheezcyj                 | https://github.com/cheezcyj                  | HTTPS로 통일                   |
| 역할                 | Web Developer · UX Designer                | Web Designer · Publisher · Frontend Engineer | About 문구 검수                |
| site URL             | https://cheezcyj.github.io                 | 미설정                                       | Astro site에 기존 URL 유지     |
| 설명/author/keywords | Jekyll boilerplate                         | 구체적인 한글 샘플                           | 실제 SEO 문구 확정             |
| 연락 기능            | config는 static이나 화면에서 include 안 함 | 미사용 fake server action                    | 목표 구조에 없으므로 기본 제외 |

## 5. URL과 콘텐츠 유실 위험

### 5.1 실제 Jekyll build 결과

_config.yml의 post default가 permalink: 빈 문자열이므로 여섯 post와 index.html이 모두 같은 /index.html을 생성한다. Jekyll은 build 중 destination conflict 경고를 출력한다.

- 모든 post.url: /
- feed의 여섯 post link: 모두 https://cheezcyj.github.io/
- feed의 post id: /project-1부터 /project-6
- post body: 모두 빈 문자열
- 독립된 /2014/07/.../ 상세 페이지: 생성되지 않음

즉 보존할 정상 상세 URL은 현재 없지만 feed ID를 URL처럼 저장한 reader나 외부 bookmark를 고려해 `/project-1/`부터 `/project-6/`까지 호환 페이지를 두는 것이 안전하다. 이 build 결함은 baseline으로 기록하되 새 route에 복제하면 안 된다.

### 5.2 fragment URL

현재 홈에서 의미가 있는 fragment는 다음과 같다.

- #page-top, #portfolio, #posting
- #portfolioModal-1~#portfolioModal-6
- #postingModal-1~#postingModal-6
- #yeardreamContent-1

fragment는 서버 redirect가 처리하지 못한다. 홈에 alias anchor를 남기거나 작은 compatibility script로 새 section/detail URL을 안내해야 한다. 권장 매핑은 #portfolio → /design/, #posting → /study/, #postingModal-1 → 이어드림 study overview다. 나머지 modal fragment는 legacy placeholder mapping이 확정된 뒤 연결한다.

### 5.3 직접 접근 asset URL

Astro cutover 1차에서는 아래 경로가 그대로 HTTP 200이어야 한다.

- /img/profile.png, /img/profile2.png
- /img/portfolio/cabin.png, cake.png, circus.png, game.png, safe.png, submarine.png
- /screenshot.png
- /feed.xml

이를 위해 기존 이미지는 Astro public/img 아래 같은 상대 경로로 둔다. 최적화된 새 cover는 별도 경로를 사용하되 legacy 파일을 덮어쓰지 않는다.

### 5.4 추가 위험

| 위험                            | 심각도 | 근거                                             | 완화                                          |
| ------------------------------- | ------ | ------------------------------------------------ | --------------------------------------------- |
| placeholder를 실프로젝트로 오인 | 높음   | post 6개가 동일 Lorem ipsum/Start Bootstrap      | draft/legacy 상태, 소유자 승인 전 공개 금지   |
| 이어드림 본문 유실 오인         | 높음   | 저장소에는 목차만 있고 JS가 summary를 비움       | inventory-only로 표시, 외부 원본 확인         |
| 이미지 URL 404                  | 높음   | HTML과 외부 bookmark가 root-relative path 사용   | public/img exact copy + URL manifest test     |
| 홈 fragment bookmark 무력화     | 중간   | 모든 상호작용이 fragment modal 기반              | alias anchor/compatibility mapping            |
| SEO/feed 중복                   | 높음   | 여섯 post canonical link가 모두 /                | 새 고유 route, canonical, feed 검증           |
| 연락처/개인정보 오류            | 중간   | 두 이메일 충돌, v0 action은 console log만 수행   | 확인 전 연락 폼 제외                          |
| 한글 깨짐                       | 중간   | 파일은 UTF-8이나 Windows 기본 read에서 오해 가능 | 모든 새 파일 UTF-8, CI encoding 검사          |
| 라이선스/저작권                 | 중간   | Bootstrap 샘플 이미지와 v0 생성 이미지           | LICENCE 보존, 실제 작품 자산 확인             |
| GitHub Pages 경로 오류          | 중간   | username root site는 base 불필요                 | site: https://cheezcyj.github.io, base 미설정 |
| 과거 파일 누락                  | 낮음   | 23개 commit 전체에 삭제 이력 없음                | migration tag/manifest로 이후 회귀 방지       |

## 6. 파일별 분류 — v0 참고 원본

아래 표는 103개 파일을 빠짐없이 열거한다.

| 파일                                                  | 분류                | 다음 단계                                    |
| ----------------------------------------------------- | ------------------- | -------------------------------------------- |
| `.gitignore`                                          | MIGRATE             | Astro 기준 ignore 규칙으로 합침              |
| `app/contact/action.ts`                               | REMOVE_AFTER_VERIFY | 홈 미사용; 정적 Pages에서 server action 불가 |
| `app/globals.css`                                     | MIGRATE             | 디자인·구조·데이터 shape를 Astro로 변환      |
| `app/layout.tsx`                                      | MIGRATE             | 디자인·구조·데이터 shape를 Astro로 변환      |
| `app/page.tsx`                                        | MIGRATE             | 디자인·구조·데이터 shape를 Astro로 변환      |
| `components.json`                                     | REMOVE_AFTER_VERIFY | shadcn 전용 설정                             |
| `components/about-preview.tsx`                        | MIGRATE             | 디자인·구조·데이터 shape를 Astro로 변환      |
| `components/contact-form.tsx`                         | REMOVE_AFTER_VERIFY | 홈 미사용; 정적 Pages에서 server action 불가 |
| `components/cursor-spotlight.tsx`                     | MIGRATE             | 디자인·구조·데이터 shape를 Astro로 변환      |
| `components/development-projects.tsx`                 | MIGRATE             | 디자인·구조·데이터 shape를 Astro로 변환      |
| `components/featured-design.tsx`                      | MIGRATE             | 디자인·구조·데이터 shape를 Astro로 변환      |
| `components/hero.tsx`                                 | MIGRATE             | 디자인·구조·데이터 shape를 Astro로 변환      |
| `components/other-posts.tsx`                          | MIGRATE             | 디자인·구조·데이터 shape를 Astro로 변환      |
| `components/project-modal.tsx`                        | MIGRATE             | 디자인·구조·데이터 shape를 Astro로 변환      |
| `components/section-heading.tsx`                      | MIGRATE             | 디자인·구조·데이터 shape를 Astro로 변환      |
| `components/site-footer.tsx`                          | MIGRATE             | 디자인·구조·데이터 shape를 Astro로 변환      |
| `components/site-header.tsx`                          | MIGRATE             | 디자인·구조·데이터 shape를 Astro로 변환      |
| `components/study-notes.tsx`                          | MIGRATE             | 디자인·구조·데이터 shape를 Astro로 변환      |
| `components/theme-provider.tsx`                       | REMOVE_AFTER_VERIFY | 미사용; 초기 단일 다크 테마                  |
| `components/ui/accordion.tsx`                         | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/alert.tsx`                             | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/alert-dialog.tsx`                      | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/aspect-ratio.tsx`                      | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/avatar.tsx`                            | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/badge.tsx`                             | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/breadcrumb.tsx`                        | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/button.tsx`                            | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/button-group.tsx`                      | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/calendar.tsx`                          | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/card.tsx`                              | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/carousel.tsx`                          | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/chart.tsx`                             | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/checkbox.tsx`                          | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/collapsible.tsx`                       | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/command.tsx`                           | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/context-menu.tsx`                      | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/dialog.tsx`                            | REPLACE             | 상세 route 우선의 Astro 접근성 UI로 교체     |
| `components/ui/drawer.tsx`                            | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/dropdown-menu.tsx`                     | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/empty.tsx`                             | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/field.tsx`                             | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/form.tsx`                              | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/hover-card.tsx`                        | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/input.tsx`                             | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/input-group.tsx`                       | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/input-otp.tsx`                         | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/item.tsx`                              | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/kbd.tsx`                               | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/label.tsx`                             | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/menubar.tsx`                           | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/navigation-menu.tsx`                   | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/pagination.tsx`                        | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/popover.tsx`                           | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/progress.tsx`                          | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/radio-group.tsx`                       | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/resizable.tsx`                         | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/scroll-area.tsx`                       | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/select.tsx`                            | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/separator.tsx`                         | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/sheet.tsx`                             | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/sidebar.tsx`                           | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/skeleton.tsx`                          | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/slider.tsx`                            | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/sonner.tsx`                            | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/spinner.tsx`                           | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/switch.tsx`                            | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/table.tsx`                             | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/tabs.tsx`                              | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/textarea.tsx`                          | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/toast.tsx`                             | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/toaster.tsx`                           | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/toggle.tsx`                            | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/toggle-group.tsx`                      | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/tooltip.tsx`                           | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/use-mobile.tsx`                        | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `components/ui/use-toast.ts`                          | REMOVE_AFTER_VERIFY | 현재 홈에서 미사용인 범용 shadcn UI          |
| `hooks/use-mobile.ts`                                 | REMOVE_AFTER_VERIFY | 미사용 shadcn hook                           |
| `hooks/use-toast.ts`                                  | REMOVE_AFTER_VERIFY | 미사용 shadcn hook                           |
| `lib/portfolio-data.ts`                               | MIGRATE             | 디자인·구조·데이터 shape를 Astro로 변환      |
| `lib/utils.ts`                                        | REMOVE_AFTER_VERIFY | shadcn className helper                      |
| `next.config.mjs`                                     | REPLACE             | Next 설정을 Astro/TS/Tailwind 설정으로 교체  |
| `package.json`                                        | REPLACE             | Next 설정을 Astro/TS/Tailwind 설정으로 교체  |
| `pnpm-lock.yaml`                                      | REPLACE             | Next 설정을 Astro/TS/Tailwind 설정으로 교체  |
| `postcss.config.mjs`                                  | REPLACE             | Next 설정을 Astro/TS/Tailwind 설정으로 교체  |
| `public/apple-icon.png`                               | REPLACE             | 샘플 아이콘을 최종 브랜드 자산으로 교체      |
| `public/design-analytics-dashboard-dark.png`          | REPLACE             | v0 샘플 작품 이미지를 실제 자산으로 교체     |
| `public/design-aurora-banking-app-dark-ui.png`        | REPLACE             | v0 샘플 작품 이미지를 실제 자산으로 교체     |
| `public/design-creative-studio-landing-page.png`      | REPLACE             | v0 샘플 작품 이미지를 실제 자산으로 교체     |
| `public/design-editorial-magazine-website-layout.png` | REPLACE             | v0 샘플 작품 이미지를 실제 자산으로 교체     |
| `public/design-skincare-brand-landing-page.png`       | REPLACE             | v0 샘플 작품 이미지를 실제 자산으로 교체     |
| `public/frontend-component-library-storybook.png`     | REPLACE             | v0 샘플 작품 이미지를 실제 자산으로 교체     |
| `public/frontend-kanban-board-app.png`                | REPLACE             | v0 샘플 작품 이미지를 실제 자산으로 교체     |
| `public/frontend-weather-dashboard-charts.png`        | REPLACE             | v0 샘플 작품 이미지를 실제 자산으로 교체     |
| `public/icon.svg`                                     | REPLACE             | 샘플 아이콘을 최종 브랜드 자산으로 교체      |
| `public/icon-dark-32x32.png`                          | REPLACE             | 샘플 아이콘을 최종 브랜드 자산으로 교체      |
| `public/icon-light-32x32.png`                         | REPLACE             | 샘플 아이콘을 최종 브랜드 자산으로 교체      |
| `public/placeholder.jpg`                              | REMOVE_AFTER_VERIFY | placeholder 참조 0건 확인 뒤 제외            |
| `public/placeholder.svg`                              | REMOVE_AFTER_VERIFY | placeholder 참조 0건 확인 뒤 제외            |
| `public/placeholder-logo.png`                         | REMOVE_AFTER_VERIFY | placeholder 참조 0건 확인 뒤 제외            |
| `public/placeholder-logo.svg`                         | REMOVE_AFTER_VERIFY | placeholder 참조 0건 확인 뒤 제외            |
| `public/placeholder-user.jpg`                         | REMOVE_AFTER_VERIFY | placeholder 참조 0건 확인 뒤 제외            |
| `styles/globals.css`                                  | REMOVE_AFTER_VERIFY | layout이 import하지 않는 중복 CSS            |
| `tsconfig.json`                                       | REPLACE             | Next 설정을 Astro/TS/Tailwind 설정으로 교체  |

## 7. 파일별 분류 — Jekyll 대상 저장소

아래 표는 67개 파일을 빠짐없이 열거한다.

| 파일                                                 | 분류                | 다음 단계                                           |
| ---------------------------------------------------- | ------------------- | --------------------------------------------------- |
| `.github/ISSUE_TEMPLATE/bug_report.md`               | PRESERVE            | 저장소 운영 템플릿 유지                             |
| `.github/workflows/pages.yml`                        | REPLACE             | Jekyll workflow를 Astro Pages action으로 교체       |
| `.gitignore`                                         | MIGRATE             | 기존 규칙 보존 + Astro 규칙 추가                    |
| `.travis.yml`                                        | REMOVE_AFTER_VERIFY | 구형 중복 CI                                        |
| `_config.yml`                                        | MIGRATE             | site/색상/연락/소셜 설정을 검증해 이동              |
| `_includes/about.html`                               | REMOVE_AFTER_VERIFY | 미사용 또는 Bootstrap/연락 테마 전용                |
| `_includes/contact.html`                             | REMOVE_AFTER_VERIFY | 미사용 또는 Bootstrap/연락 테마 전용                |
| `_includes/contact_disqus.html`                      | REMOVE_AFTER_VERIFY | 미사용 또는 Bootstrap/연락 테마 전용                |
| `_includes/contact_static.html`                      | REMOVE_AFTER_VERIFY | 미사용 또는 Bootstrap/연락 테마 전용                |
| `_includes/css/bootstrap.min.css`                    | REMOVE_AFTER_VERIFY | 미사용 또는 Bootstrap/연락 테마 전용                |
| `_includes/css/main.css`                             | MIGRATE             | 현재 화면·콘텐츠·anchor/이어드림 요구를 변환        |
| `_includes/footer.html`                              | MIGRATE             | 현재 화면·콘텐츠·anchor/이어드림 요구를 변환        |
| `_includes/head.html`                                | MIGRATE             | 현재 화면·콘텐츠·anchor/이어드림 요구를 변환        |
| `_includes/header.html`                              | MIGRATE             | 현재 화면·콘텐츠·anchor/이어드림 요구를 변환        |
| `_includes/js.html`                                  | REPLACE             | jQuery 묶음을 최소 Vite script로 교체               |
| `_includes/js_disqus.html`                           | REMOVE_AFTER_VERIFY | 미사용 또는 Bootstrap/연락 테마 전용                |
| `_includes/modals.html`                              | MIGRATE             | 현재 화면·콘텐츠·anchor/이어드림 요구를 변환        |
| `_includes/nav.html`                                 | MIGRATE             | 현재 화면·콘텐츠·anchor/이어드림 요구를 변환        |
| `_includes/portfolio_grid.html`                      | MIGRATE             | 현재 화면·콘텐츠·anchor/이어드림 요구를 변환        |
| `_includes/posting_grid.html`                        | MIGRATE             | 현재 화면·콘텐츠·anchor/이어드림 요구를 변환        |
| `_layouts/default.html`                              | REPLACE             | Jekyll 진입점을 Astro layout/page/CSS로 교체        |
| `_layouts/style.css`                                 | REPLACE             | Jekyll 진입점을 Astro layout/page/CSS로 교체        |
| `_posts/2014-07-13-project-6.markdown`               | MIGRATE             | frontmatter·이미지 연결을 legacy/draft entry로 이동 |
| `_posts/2014-07-14-project-5.markdown`               | MIGRATE             | frontmatter·이미지 연결을 legacy/draft entry로 이동 |
| `_posts/2014-07-15-project-4.markdown`               | MIGRATE             | frontmatter·이미지 연결을 legacy/draft entry로 이동 |
| `_posts/2014-07-16-project-3.markdown`               | MIGRATE             | frontmatter·이미지 연결을 legacy/draft entry로 이동 |
| `_posts/2014-07-17-project-2.markdown`               | MIGRATE             | frontmatter·이미지 연결을 legacy/draft entry로 이동 |
| `_posts/2014-07-18-project-1.markdown`               | MIGRATE             | frontmatter·이미지 연결을 legacy/draft entry로 이동 |
| `css/font-awesome/css/all.css`                       | REMOVE_AFTER_VERIFY | 필요 아이콘 SVG 대체 후 제거                        |
| `css/font-awesome/css/all.min.css`                   | REMOVE_AFTER_VERIFY | 필요 아이콘 SVG 대체 후 제거                        |
| `css/font-awesome/webfonts/fa-brands-400.ttf`        | REMOVE_AFTER_VERIFY | 필요 아이콘 SVG 대체 후 제거                        |
| `css/font-awesome/webfonts/fa-brands-400.woff2`      | REMOVE_AFTER_VERIFY | 필요 아이콘 SVG 대체 후 제거                        |
| `css/font-awesome/webfonts/fa-regular-400.ttf`       | REMOVE_AFTER_VERIFY | 필요 아이콘 SVG 대체 후 제거                        |
| `css/font-awesome/webfonts/fa-regular-400.woff2`     | REMOVE_AFTER_VERIFY | 필요 아이콘 SVG 대체 후 제거                        |
| `css/font-awesome/webfonts/fa-solid-900.ttf`         | REMOVE_AFTER_VERIFY | 필요 아이콘 SVG 대체 후 제거                        |
| `css/font-awesome/webfonts/fa-solid-900.woff2`       | REMOVE_AFTER_VERIFY | 필요 아이콘 SVG 대체 후 제거                        |
| `css/font-awesome/webfonts/fa-v4compatibility.ttf`   | REMOVE_AFTER_VERIFY | 필요 아이콘 SVG 대체 후 제거                        |
| `css/font-awesome/webfonts/fa-v4compatibility.woff2` | REMOVE_AFTER_VERIFY | 필요 아이콘 SVG 대체 후 제거                        |
| `feed.xml`                                           | REPLACE             | Astro RSS/Atom endpoint로 교체                      |
| `freelancer-theme-jekyll.gemspec`                    | REMOVE_AFTER_VERIFY | Ruby/Jekyll toolchain                               |
| `Gemfile`                                            | REMOVE_AFTER_VERIFY | Ruby/Jekyll toolchain                               |
| `img/portfolio/cabin.png`                            | PRESERVE            | 기존 URL과 바이트 우선 보존                         |
| `img/portfolio/cake.png`                             | PRESERVE            | 기존 URL과 바이트 우선 보존                         |
| `img/portfolio/circus.png`                           | PRESERVE            | 기존 URL과 바이트 우선 보존                         |
| `img/portfolio/game.png`                             | PRESERVE            | 기존 URL과 바이트 우선 보존                         |
| `img/portfolio/safe.png`                             | PRESERVE            | 기존 URL과 바이트 우선 보존                         |
| `img/portfolio/submarine.png`                        | PRESERVE            | 기존 URL과 바이트 우선 보존                         |
| `img/profile.png`                                    | PRESERVE            | 기존 URL과 바이트 우선 보존                         |
| `img/profile2.png`                                   | PRESERVE            | 기존 URL과 바이트 우선 보존                         |
| `index.html`                                         | REPLACE             | Jekyll 진입점을 Astro layout/page/CSS로 교체        |
| `js/bootstrap.js`                                    | REMOVE_AFTER_VERIFY | jQuery/Bootstrap/구형 또는 미사용 script            |
| `js/bootstrap.min.js`                                | REMOVE_AFTER_VERIFY | jQuery/Bootstrap/구형 또는 미사용 script            |
| `js/cbpAnimatedHeader.js`                            | REMOVE_AFTER_VERIFY | jQuery/Bootstrap/구형 또는 미사용 script            |
| `js/cbpAnimatedHeader.min.js`                        | REMOVE_AFTER_VERIFY | jQuery/Bootstrap/구형 또는 미사용 script            |
| `js/classie.js`                                      | REMOVE_AFTER_VERIFY | jQuery/Bootstrap/구형 또는 미사용 script            |
| `js/contact_me.js`                                   | REMOVE_AFTER_VERIFY | jQuery/Bootstrap/구형 또는 미사용 script            |
| `js/contact_me_static.js`                            | REMOVE_AFTER_VERIFY | jQuery/Bootstrap/구형 또는 미사용 script            |
| `js/freelancer.js`                                   | MIGRATE             | scroll/menu/이어드림 행동 요구 변환                 |
| `js/jqBootstrapValidation.js`                        | REMOVE_AFTER_VERIFY | jQuery/Bootstrap/구형 또는 미사용 script            |
| `js/jquery.easing.min.js`                            | REMOVE_AFTER_VERIFY | jQuery/Bootstrap/구형 또는 미사용 script            |
| `js/jquery-1.11.0.js`                                | REMOVE_AFTER_VERIFY | jQuery/Bootstrap/구형 또는 미사용 script            |
| `LICENCE`                                            | PRESERVE            | 테마·자산 라이선스 이력 유지                        |
| `mail/contact_me.php`                                | REMOVE_AFTER_VERIFY | Pages에서 실행되지 않는 placeholder PHP             |
| `Rakefile`                                           | REMOVE_AFTER_VERIFY | Ruby/Jekyll toolchain                               |
| `README.md`                                          | MIGRATE             | Astro 개발·배포 문서로 갱신                         |
| `screenshot.png`                                     | PRESERVE            | 기존 시각 baseline 유지                             |
| `style.css`                                          | REPLACE             | Jekyll 진입점을 Astro layout/page/CSS로 교체        |

## 8. 삭제 전 필수 검증

REMOVE_AFTER_VERIFY 파일은 다음 조건을 모두 만족하기 전에는 삭제하지 않는다.

1. pre-migration tag 또는 별도 archive가 있고 모든 170개 파일 hash manifest를 보관한다.
2. MIGRATE 항목마다 source → destination mapping이 문서화되어 있다.
3. 기존 이미지 URL과 /feed.xml이 staging build에서 200을 반환한다.
4. 새 목록/상세 route 전부가 build되고 내부 링크 검사에 통과한다.
5. desktop/mobile screenshot, keyboard, reduced-motion, 접근성 검사가 통과한다.
6. owner가 placeholder 공개/비공개와 브랜드·이메일을 승인한다.
7. PR diff에서 Jekyll 제거 commit이 별도로 분리되어 검토 가능하다.

이 문서 작성 단계에서는 어떤 기존 파일도 삭제하거나 이동하지 않았다.
