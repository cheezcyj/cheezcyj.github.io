# RoadScanner 비공개 초안 및 다중 카드 검수 보고서

## 자료 출처

- 로컬 검색 위치: `<workspace>`, `<user-documents>/GitHub`, `<source-repositories>`, `<ide-workspace>`, `<user-downloads>`
- 로컬 RoadScanner 체크아웃: 발견하지 못함
- 공개 저장소: <https://github.com/cheezcyj/RoadScanner>
- 기본 브랜치: `main`
- 조사 자료: README, Maven `pom.xml`, Java 컨트롤러·서비스·DAO, MyBatis 매퍼, JSP, JavaScript와 공개 커밋 이력
- 조사 방식: 인증된 GitHub CLI를 사용한 읽기 전용 API 조회

자동 clone, 외부 이미지 다운로드와 저장소 변경은 수행하지 않았다. 자세한 근거와 Owner 확인 항목은 `docs/roadscanner-content-review.md`에 분리했다.

## 생성한 entry

- 파일: `src/content/projects/roadscanner.md`
- canonical ID: `roadscanner`
- 제목: RoadScanner
- 상태: `completed`
- 기간: 2023년 7월 5일~8월 29일
- 저장소: <https://github.com/cheezcyj/RoadScanner>
- 미디어: cover와 gallery 없음
- 별도 slug와 legacy URL: 없음

## 확인된 기술과 기능

의존성과 실제 소스에서 Java 8, Spring MVC, JSP/JSTL, MyBatis, Oracle JDBC, JavaScript, AWS S3, Spring `RestTemplate`과 Chart.js를 확인했다.

README와 소스에서 다음 기능을 확인했다.

- 교통표지판 이미지 업로드와 Flask 예측 API 연동
- 인식 결과와 사용자 피드백 처리
- 전체·월별 피드백 통계 시각화
- 검색·페이지네이션·공지·답변을 포함한 Q&A
- 로그인, 회원가입, 계정 찾기, 마이페이지와 회원 관리
- 이미지 데이터와 게시물 관리자 화면

README는 최유정을 8인 팀원으로 기록한다. `cheezcyj` 계정의 커밋에서 Q&A 데이터·서비스·화면, 페이지네이션, 공지 분리, 파일 업로드 검증, 공통 JSP 레이아웃과 기능 통합 변경을 확인했다. 단독 개발이나 확인되지 않은 개인 성과로 표현하지 않았다.

Owner는 메인 기능 개발과 머신러닝·딥러닝 개발 참여를 추가로 확인했다. 이 역할은 Owner 직접 확인으로 구분하고, 공개 저장소에서 확인되지 않은 모델 학습 환경과 성능 수치는 추가하지 않았다.

## 미확인 정보

- 현재 동작하는 공개 demo URL
- 모델 학습 코드, 데이터셋과 학습 환경
- 정확도, 처리 속도와 사용자 수
- 팀 내 공식 역할명과 세부 분담 문서
- 수상, 발표와 외부 평가
- 공개 가능한 회고와 문제 해결 사례
- Owner가 승인한 cover와 gallery 원본

## 비공개 상태

다음 값을 유지한다.

```yaml
draft: true
featured: false
sourceStatus: verified
status: completed
```

Owner 승인으로 `sourceStatus: verified` 전환은 완료했지만 `draft: false` 조건을 충족하지 않으므로 개발 환경에서만 preview가 생성된다. 프로덕션 목록, 홈과 상세 route에서는 계속 차단된다.

## 기존 프로젝트 보호 결과

`src/content/projects/cheezcyj-portfolio-redesign.md`, 기존 WebP 4개와 프로젝트 미디어 처리·검증 스크립트는 변경하지 않았다. 첫 프로젝트의 상태, 날짜, order, cover, gallery, repository URL, highlights와 본문도 그대로 유지했다.

## 카드 2개 개발 미리보기

홈과 `/projects/` 개발 화면에 실제 콘텐츠 entry 두 개만 표시된다.

1. CHEEZCYJ Portfolio Redesign: 실제 cover, `Draft Preview`, `in-progress`
2. RoadScanner: 기존 neutral fallback, `Draft Preview`, `completed`

순서는 기존 정렬 정책에 따라 2026년 시작 프로젝트가 2023년 완료 프로젝트보다 앞선다. 복제 카드나 가짜 overflow용 카드는 추가하지 않았다.

## HorizontalRail overflow 발생 viewport

브라우저의 세로 스크롤바를 제외한 실제 layout viewport를 함께 측정했다.

| 요청 viewport | layout viewport | 카드 폭 |  gap | 최대 내부 스크롤 | 결과               |
| ------------- | --------------: | ------: | ---: | ---------------: | ------------------ |
| 1440px        |          1425px |   384px | 24px |              0px | overflow 없음      |
| 1024px        |          1009px |   384px | 24px |              0px | overflow 없음      |
| 768px         |           753px |   320px | 24px |              0px | overflow 없음      |
| 390px         |           375px |   288px | 20px |            253px | rail 내부 overflow |
| 375px         |           360px |   288px | 20px |            268px | rail 내부 overflow |
| 320px         |           305px |   288px | 20px |            323px | rail 내부 overflow |

모바일에서는 다음 카드 일부가 보이고, rail viewport만 `overflow-x: auto`로 이동한다.

320px 검수에서 full-bleed rail이 문서 루트에 40px 전역 가로 스크롤을 만들 수 있음을 실제 입력으로 발견했다. `html`에 `overflow-x: clip`을 적용한 뒤 `documentElement.scrollWidth === clientWidth`, `window.scrollX === 0`을 확인했다. 내부 rail은 최대 323px까지 계속 스크롤된다.

## 이전·다음 버튼 결과

- 1440px, 1024px와 768px: 실제 overflow가 없어 controls `hidden`, 이전·다음 모두 disabled
- 390px 시작 위치: 이전 disabled, 다음 enabled
- 네이티브 가로 스크롤로 마지막 위치 이동: 이전 enabled, 다음 disabled
- 첫 위치로 복귀: 이전 disabled, 다음 enabled
- 390px에서 마지막 위치에 둔 뒤 768px resize: 최대 스크롤 0, `scrollLeft` 0, controls hidden, 두 버튼 disabled
- 다시 390px resize: overflow와 시작 위치 버튼 상태 재계산

실제 overflow가 생기는 폭은 데스크톱 버튼을 숨기는 breakpoint 아래이므로, 표시되지 않는 버튼을 강제 클릭하거나 가짜 overflow를 만들지 않았다.

## touch, native scroll과 scroll snap 결과

- rail viewport: `overflow-x: auto`
- touch 구조: `touch-action: pan-x pan-y`
- 일반 모션: `scroll-snap-type: x proximity`가 계산값 `x`로 적용
- reduced-motion: snap 해제와 `scroll-behavior: auto`
- JavaScript 비활성 reload: 두 카드와 rail DOM, native overflow 구조 유지
- JavaScript 활성 상태의 네이티브 wheel 입력: rail만 마지막 위치까지 이동하고 `window.scrollX`는 0 유지

스크립트 비활성 상태에서는 이동 버튼이 초기 `hidden` 상태로 남지만, 카드와 CSS overflow는 정적 HTML·CSS에 존재해 콘텐츠 접근이 차단되지 않는다. 현재 실제 페이지에는 HorizontalRail 인스턴스가 하나뿐이므로 여러 인스턴스의 독립 동작을 위해 가짜 레일을 추가하지 않았다. 초기화 코드는 각 `[data-horizontal-rail]` root 안에서 viewport와 controls를 조회하도록 분리되어 있다.

## 목록 grid 반응형 결과

| viewport | 열 수 | 측정 카드 폭 |  gap | 결과                     |
| -------- | ----: | -----------: | ---: | ------------------------ |
| 1440px   |     3 |     약 389px | 24px | 두 카드가 같은 행에 배치 |
| 1024px   |     3 |        299px | 24px | 두 카드가 같은 행에 배치 |
| 768px    |     2 |     약 341px | 24px | 두 카드가 같은 행에 배치 |
| 390px    |     1 |        343px | 24px | 두 카드가 세로로 배치    |
| 375px    |     1 |        328px | 24px | 두 카드가 세로로 배치    |
| 320px    |     1 |        273px | 24px | 두 카드가 세로로 배치    |

두 카드의 높이는 같은 행에서 동일했다. 320px 한 열에서는 콘텐츠 길이에 따라 카드 높이가 달라지지만 겹침이나 전역 가로 overflow는 없다.

## RoadScanner 상세 preview

- 기존 범용 `src/pages/projects/[...id].astro` route 사용
- 별도 route와 프로젝트 전용 UI 추가 없음
- h1 1개와 본문 h2 7개
- `Draft Preview` 표시
- `<meta name="robots" content="noindex, nofollow">` 확인
- cover 0개, neutral fallback 1개
- 1440px, 390px와 320px에서 전역 가로 overflow 없음
- 브라우저 console error와 warning 0개

## production draft 차단

프로덕션 build는 홈, about, design, posts, projects와 study 목록의 6페이지만 생성했다.

- `dist`에서 `RoadScanner` 문자열: 없음
- `dist`에서 `CHEEZCYJ Portfolio Redesign` 문자열: 없음
- `dist/projects/roadscanner/index.html`: 생성되지 않음
- `dist/projects/cheezcyj-portfolio-redesign/index.html`: 생성되지 않음
- `dist/projects/index.html`: 생성됨, draft 카드 없음
- `dist/about/index.html`: 생성됨

## 추가 UI 요청 반영

Owner의 추가 요청에 따라 공통 헤더의 데스크톱·모바일 메뉴와 푸터 메뉴에서 About 다음의 GitHub 항목을 제거했다. 푸터의 별도 `Email · GitHub` 연락처와 프로젝트 카드·상세의 실제 저장소 링크는 유지했다.

메인 페이지에서는 Hero의 `작업 보기`·`소개`와 헤더의 Design·Projects·Study·Posts·About을 각각 `#design`·`#about`과 콘텐츠 섹션 anchor에 연결했다. 링크 클릭에는 500~800ms 범위의 명시적 easing scroll을 적용하고, 현재 보고 있는 섹션의 헤더 링크에 `aria-current="location"`과 노란 강조색을 유지한다.

`작업 보기`와 메인 헤더의 Projects를 실제 클릭했을 때 pathname `/`를 유지하면서 대상 섹션의 상단이 sticky header 아래 96px 지점에 배치되는 것을 확인했다. `View All` 클릭 뒤에는 `/projects/`로 이동하고, 서브페이지 헤더는 `/design/`, `/projects/`, `/study/`, `/posts/`, `/about/` 경로를 사용한다. About 경로가 404가 되지 않도록 현재 확인 가능한 설명만 담은 최소 `/about/` 페이지를 추가했다.

## 다음 Owner 검토 단계

제목, 설명, 기간, 상태, 사용자 역할, 기술 스택, 저장소 링크와 현재 본문에 대한 Owner 승인 및 `sourceStatus: verified` 전환은 완료했다. 다음 단계는 Owner가 소유하고 공개를 허용한 실제 화면 원본을 준비해 cover와 gallery의 개인정보, 권리, alt와 크기를 검수하는 것이다. 대표·상세 미디어 검수와 최종 공개 승인 전에는 `draft: true`, `featured: false`를 유지한다.
