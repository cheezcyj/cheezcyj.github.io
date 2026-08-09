# RoadScanner 최신 상태 반영 보고서

- 반영일: 2026-08-09
- 작업 브랜치: `feature/roadscanner-refresh`
- 최신 upstream: `f03d58f8f98b24bfb654d86777c1746792ef5bcb`
- 핵심 개편 commit: `dd951c86251b65110b377432855d334b4249788e`
- upstream 저장소: <https://github.com/cheezcyj/RoadScanner>

## Owner 승인

Owner가 2026-08-09에 최신 RoadScanner 상태를 블로그에 반영하도록 요청했다. 이 요청은 최신 공개 README의 일반화된 시연 화면을 포트폴리오 미디어로 변환·게시하는 승인도 포함한다.

RoadScanner upstream에는 별도 `LICENSE` 파일이 없지만, 프로젝트 Owner가 자신의 포트폴리오에서 최신 화면과 로고를 사용하도록 직접 승인했다. 제3자 실명, 개인 계정, 외부 협업 문서와 개인 저장소 링크는 포함하지 않는다.

## 확인한 최신 기준

확인 기준 upstream `main`에는 다음 구현이 포함돼 있다.

- 전체 도로 장면의 표지판 후보 검출과 GTSRB 43종 분류
- confidence, margin, OOD와 후보 합의 기반 `인식 불가` 정책
- 공개 Q&A와 분리된 비공개 문의 및 관리자 답변
- 계정·공지·이미지 데이터·분석 피드백 통계 관리
- BCrypt, CSRF, 로그인·메일 발급 제한, 권한 검증과 입력 정제
- Oracle 운영 DB와 H2 기반 local-smoke·통합 테스트
- Java 웹 서버와 Python 분석 서비스의 통합 실행
- Java 단위·통합 테스트와 Python 단위·회귀 테스트 체계
- 일반화된 로컬 테스트 데이터만 사용한 최신 시연 GIF 14개

저장소에는 GitHub Actions workflow와 공개 배포 URL이 없다. 따라서 블로그는 테스트 구조와 검증 명령이 존재한다는 사실만 설명하며, upstream CI 통과나 운영 서비스 가동을 주장하지 않는다.

## 콘텐츠 정책

- `draft: false` 유지
- `featured: false` 유지
- `sourceStatus: verified` 유지
- `status: completed` 유지
- 2023년 팀 프로젝트 기간 `2023-07-05`~`2023-08-29` 유지
- canonical ID와 route `/projects/roadscanner/` 유지
- 공개 저장소 URL 유지, 근거 없는 demo URL은 추가하지 않음
- 사이트 본문은 연도별 개편 서사 대신 현재 프로젝트 구성과 역할을 설명

기존 프로젝트 기간과 완료일은 그대로 유지했다.

## 미디어 출처와 공개 검토

원본은 upstream 최신 commit의 `docs/demo` GIF다. README는 이 화면들이 일반화된 로컬 테스트 데이터만 사용하며 이름, 개인 계정, 외부 협업 문서와 개인 저장소 링크를 포함하지 않는다고 명시한다.

직접 시각 검수한 결과 화면에는 일반 테스트 계정 `localuser`와 `localadmin`만 존재하고, 실명·실이메일·브라우저 주소 표시줄·로컬 절대 경로·외부 팀 저장소 식별 정보는 없다.

| 용도        | upstream 원본                             | 원본 SHA-256                                                       | production WebP            | WebP SHA-256                                                       |
| ----------- | ----------------------------------------- | ------------------------------------------------------------------ | -------------------------- | ------------------------------------------------------------------ |
| Cover       | `docs/demo/landing-overview.gif`          | `72058375096cd991cb00373358451c85c5fdecc572716c12743e19e3a9f61307` | `cover.webp`               | `2e9d77d5770062d376313f456979bcf503e1e0a31a190f5ba4b3650a2e14db62` |
| 사진 분석   | `docs/demo/image-analysis-flow.gif`       | `fe1164da878fe50c951cd95e087c3b3f18fc7ebd9d45cf3e554b44a9bf1c6bfb` | `upload-entry.webp`        | `ee27b8661bc461663e8f856b4ce1033b86598a4e8d68e5b91b8b1c7f976054db` |
| 비공개 문의 | `docs/demo/private-inquiry-list.gif`      | `7fd223643b5648a4706b4ee81cf99d0a45cd7da27de91e85d3e3aee0ffc60d32` | `private-inquiry.webp`     | `ddba94f2cad95201d6b4d50afd2f3d77b4b4099c37113eeac639ee47a886d097` |
| Q&A         | `docs/demo/qna-post-crud.gif`             | `6e955177349568befcc2ac09c621092297ecb98b63e2e5f444d0d9e1754039cc` | `qna-list.webp`            | `d9a3b2201445634af8e958ac4b18597738cbab3e9575802e6c1a452a3ba594a0` |
| 피드백 통계 | `docs/demo/admin-analysis-statistics.gif` | `3cc9b894376ad5c9c746d86d4d3306a3e00b551a63f42770120502b8dbcb3aca` | `feedback-statistics.webp` | `75db307a204e587b94bcd25b060d7c9fdeb8b7999f2419f1ce323db7ae22c960` |

## 변환 규칙

- upstream GIF 첫 장면만 정적 이미지로 사용
- 원본 크기: 1264×800
- 하단 시연 캡션을 제외하도록 상단에서 1264×711 crop
- 출력: 정적 WebP 1264×711
- 옵션: quality 90, effort 6
- 애니메이션을 production에 포함하지 않아 자동 재생과 reduced-motion 문제를 방지
- cover와 gallery의 alt, dimensions와 production SHA-256을 검증 설정에 고정

## 정량 정보와 한계

upstream 문서의 GTSRB 분류 성능과 detector validation 수치는 서로 다른 범위의 결과다. 블로그에는 실제 도로 안전 성능이나 무감독 운영 정확도로 해석될 수 있는 정량 문구를 추가하지 않았다.

현재 의미 분류 범위는 독일 GTSRB 43종이며, 다른 국가나 지원 범위 밖 표지판은 올바른 의미를 보장하지 않는다. 별도 공개 운영 배포도 없다는 점을 본문에 유지했다.

## 검증 결과

- `pnpm install --frozen-lockfile`: 성공
- `pnpm format:check`: 성공
- `pnpm check`: 오류·경고·힌트 0
- `pnpm verify:assets`: legacy asset 9개, 오류 0
- `pnpm verify:media`: project 2개, WebP 9개, source mapping·MIME·dimensions·hash·frontmatter 오류 0
- `pnpm verify:content`: content 3개, published 1개, URL·placeholder·날짜 오류 0
- `pnpm verify:study-inventory`: 비공개 inventory 46개, 누락·중복 0
- `pnpm build`: 정적 페이지 7개와 `/projects/roadscanner/` 생성
- `pnpm verify:feed`: RSS item 1개, RoadScanner 포함, draft project와 study inventory 제외
- `git diff --check`: 오류 0

`design`과 `posts` 컬렉션이 비어 있다는 기존 경고는 비차단이다. 샌드박스 안에서 하위 `git`과 `esbuild` 프로세스 실행이 `EPERM`으로 제한돼 study 검증과 build는 동일 명령을 승인된 실행 환경에서 다시 수행했고 모두 성공했다.

로컬 preview를 1440×900과 390×844 viewport에서 확인했다. 홈·About·RoadScanner 상세 페이지의 가로 overflow는 0이었고, 모바일 메뉴의 열기·닫기와 포커스 가능한 navigation이 정상 동작했다. cover와 gallery 4장의 실제 로딩 크기는 모두 1264×711이었으며 broken image와 빈 alt는 0이었다. 상세 페이지의 canonical과 GitHub 저장소 링크도 각각 production route와 공개 저장소를 가리켰다.

개발 서버 로그에는 페이지 오류가 없었다. Astro 개발 툴바가 로컬 절대 경로를 개발 HTML에 주입하지만 production `dist`에는 포함되지 않으며, production 빌드에서는 Draft Preview, CHEEZCYJ Portfolio Redesign 상세 route와 study inventory route가 생성되지 않는 것을 확인했다.
