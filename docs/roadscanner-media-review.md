# RoadScanner 미디어 후보 검토

- 작성일: 2026-07-18
- 대상 브랜치: `redesign/astro-v0`
- 대상 프로젝트: `RoadScanner`
- 조사 저장소: `https://github.com/cheezcyj/RoadScanner`
- 조사 branch: `main`
- 현재 콘텐츠 상태: `draft: true`, `featured: false`, `sourceStatus: verified`

Phase 4C-2에서는 GitHub API로 README, repository tree, 이미지 metadata와 관련 JSP·CSS의 참조만 읽었다. 이미지 GET, 외부 이미지 다운로드, WebP 변환, `public` 복사와 frontmatter 연결은 수행하지 않았다. Phase 4C-3에서는 Owner가 제공한 로컬 원본 43개를 저장소 밖에서 읽기 전용으로 조사했다.

## 1. 조사한 저장소와 branch

- 저장소: `cheezcyj/RoadScanner`
- 공개 범위: Public
- 기본 branch: `main`
- 저장소 설명: `자율주행 목적용 교통표지판 이미지 인식 페이지`
- GitHub 표시 주요 언어: Java
- license metadata: 없음
- `LICENSE`, `LICENCE`, `COPYING` 파일: 없음

Public 저장소라는 사실은 이미지 재사용 권리의 근거가 아니다. 특히 팀원이 올린 화면, 외부 호스팅 자산과 서비스 UI 원본은 Owner와 팀의 공개 허가를 별도로 확인해야 한다.

## 2. 조사한 이미지 경로

- README의 GitHub asset URL: 16개
- `src/main/webapp/resources` 내부 이미지 경로: 15개
- 내부 이미지의 고유 SHA-1: 11개
- 중복 SHA-1 쌍: `infinite.gif`, `passwordicon.png`, `usericon.png`, `wbx.PNG` 각 2경로
- GitHub tree에서 확인한 형식: PNG 8경로, JPG 5경로, GIF 2경로
- 고유 SHA-1 기준 형식: PNG 5개, JPG 5개, GIF 1개
- README asset 형식: 확장자 없는 URL이며 HEAD가 HTTP 403을 반환해 미확인

README asset의 형식을 확인하기 위해 HEAD metadata만 요청했지만 16개 모두 GitHub에서 403을 반환했다. GET으로 우회하면 이미지 본문을 내려받게 되므로 이번 단계에서는 시도하지 않았다. 따라서 README의 대체 텍스트와 문맥만으로 예상 장면을 분류했다.

README에는 기획서 Google Docs, 회의록·WBS·요구사항 Notion과 WBS Google Sheets 링크가 있지만 직접 저장된 발표 파일이나 이미지 경로는 아니다. 공유 권한과 개인정보 범위도 확인되지 않아 미디어 후보로 열지 않았다. `기능 시연`의 GitHub asset이 정적 이미지인지 GIF인지도 확정하지 않았다.

## 3. README 이미지 목록

모든 URL은 GitHub asset이지만 RoadScanner 저장소 내부 blob 경로가 아니다. `외부`는 현재 저장소 바깥의 `hykim-king/f1_new` asset을 뜻한다.

| 번호 | README 표기      | 출처와 URL                                                                                                                | 형식   | 예상 화면                                                     | Cover | Gallery                     | 개인정보·관리자·팀원 위험                                   | 외부/승인                               |
| ---: | ---------------- | ------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------- | ----- | --------------------------- | ----------------------------------------------------------- | --------------------------------------- |
|    1 | `temp`           | `hykim-king/f1_new`<br><https://github.com/hykim-king/f1_new/assets/133944035/58d8e9f6-f76a-4b4d-ac05-f49ec2d74b87>       | 미확인 | README 상단 대표 시각물로 추정되나 의미를 설명하는 alt가 없음 | 보류  | 보류                        | 화면 내용을 확인할 수 없어 전체 항목 미확인                 | 외부, 원본·권리 승인 필요               |
|    2 | `image`          | `cheezcyj/RoadScanner`<br><https://github.com/cheezcyj/RoadScanner/assets/133944035/419e148d-6c13-4146-81d0-d59550a66fa4> | 미확인 | ERD                                                           | 낮음  | 보조 후보                   | 테이블·컬럼명에 계정 또는 내부 설계 정보가 있는지 확인 필요 | GitHub asset, 원본·권리 승인 필요       |
|    3 | `메인`           | `hykim-king/f1_new`<br><https://github.com/hykim-king/f1_new/assets/133944035/d9e78da4-732d-4f06-8a29-d00c654763cd>       | 미확인 | 서비스 메인 페이지                                            | 중간  | 중간                        | 로그인 사용자명, 팀원명 또는 테스트 데이터 노출 여부 확인   | 외부, 원본·팀 사용 동의 필요            |
|    4 | `로그인화면`     | `hykim-king/f1_new`<br><https://github.com/hykim-king/f1_new/assets/133944035/89f20c42-77fd-4d34-b005-f3af94527a5f>       | 미확인 | 로그인 화면                                                   | 낮음  | 낮음                        | 입력값·계정 정보가 채워져 있는지 확인                       | 외부, 원본·팀 사용 동의 필요            |
|    5 | `회원가입`       | `hykim-king/f1_new`<br><https://github.com/hykim-king/f1_new/assets/133944035/29e97f47-98b4-40ee-9d7e-2d86b062fdb0>       | 미확인 | 회원가입 화면                                                 | 제외  | 낮음                        | 이름, 이메일, 전화번호, 주소와 테스트 계정 가능성           | 외부, 원본·팀 사용 동의 필요            |
|    6 | `아이디비번찾기` | `hykim-king/f1_new`<br><https://github.com/hykim-king/f1_new/assets/133944035/16ca6951-bdb2-4eb8-90a8-ec6af4f0e712>       | 미확인 | 아이디·비밀번호 찾기 화면                                     | 제외  | 낮음                        | 개인 식별정보와 계정 복구 정보 가능성                       | 외부, 원본·팀 사용 동의 필요            |
|    7 | `회원관리`       | `hykim-king/f1_new`<br><https://github.com/hykim-king/f1_new/assets/133944035/77b32f01-dbfe-4dd6-89ea-cb650d20c935>       | 미확인 | 관리자 회원 관리 화면                                         | 제외  | 조건부                      | 사용자 ID·이름·이메일과 관리자 정보 노출 가능성이 높음      | 외부, 원본·팀 사용 동의와 비식별화 필요 |
|    8 | `마이페이지`     | `hykim-king/f1_new`<br><https://github.com/hykim-king/f1_new/assets/133944035/2eedc5e5-cce8-4508-a383-a2267bef2c42>       | 미확인 | 사용자 마이페이지                                             | 제외  | 조건부                      | 계정·프로필·개인정보 노출 가능성이 높음                     | 외부, 원본·팀 사용 동의와 비식별화 필요 |
|    9 | `내글보기`       | `hykim-king/f1_new`<br><https://github.com/hykim-king/f1_new/assets/133944035/ef9b4560-494d-4b6d-88c8-68f5eef64b85>       | 미확인 | 로그인 사용자의 작성 글 목록                                  | 제외  | 조건부                      | 사용자명, 게시물 제목·내용과 테스트 계정 가능성             | 외부, 원본·팀 사용 동의와 비식별화 필요 |
|   10 | `파일인식`       | `hykim-king/f1_new`<br><https://github.com/hykim-king/f1_new/assets/133944035/82eeb87e-2f1e-4a29-931d-19b978c2b4a0>       | 미확인 | 교통표지판 파일 업로드와 인식 결과                            | 1순위 | 1순위 단, cover와 중복 금지 | 업로드 원본의 저작권, 파일명, 사용자·예측 정보 확인         | 외부, 원본·팀 사용 동의 필요            |
|   11 | `이미지관리`     | `hykim-king/f1_new`<br><https://github.com/hykim-king/f1_new/assets/133944035/819697c8-6c43-4d35-92d4-632500f2a158>       | 미확인 | 이미지 데이터 관리 화면                                       | 제외  | 3순위 조건부                | 사용자 업로드 이미지, ID, 상태와 관리자 정보 가능성이 높음  | 외부, 원본·팀 사용 동의와 비식별화 필요 |
|   12 | `데이터통계`     | `hykim-king/f1_new`<br><https://github.com/hykim-king/f1_new/assets/133944035/8bf4642c-4c30-4ec2-bf97-453a0faa552e>       | 미확인 | 사용자 피드백 전체·월별 통계 그래프                           | 낮음  | 1순위                       | 집계 데이터에 개인 식별자나 내부 관리자 정보가 없는지 확인  | 외부, 원본·팀 사용 동의 필요            |
|   13 | `게시글CRUD`     | `hykim-king/f1_new`<br><https://github.com/hykim-king/f1_new/assets/133944035/721ed563-5a68-4f66-9af3-0b1e72394dda>       | 미확인 | Q&A 게시글 작성·조회·수정·삭제 흐름                           | 낮음  | 2순위                       | 작성자명, 게시글 내용, 첨부 이미지와 계정 정보 확인         | 외부, 원본·팀 사용 동의와 비식별화 필요 |
|   14 | `답변CRUD`       | `hykim-king/f1_new`<br><https://github.com/hykim-king/f1_new/assets/133944035/bfc906ed-4bb2-47ae-9548-27dc697d0bbc>       | 미확인 | Q&A 답변 작성·수정·삭제 흐름                                  | 제외  | 4순위                       | 작성자명, 답변 내용과 관리자 계정 정보 확인                 | 외부, 원본·팀 사용 동의와 비식별화 필요 |
|   15 | `공지CRUD`       | `hykim-king/f1_new`<br><https://github.com/hykim-king/f1_new/assets/133944035/efc4c4fc-c11d-4051-a100-9efe3a5b6112>       | 미확인 | 공지 작성·수정·삭제 흐름                                      | 제외  | 조건부                      | 관리자명, 내부 공지 내용과 계정 정보 확인                   | 외부, 원본·팀 사용 동의와 비식별화 필요 |
|   16 | `게시판 관리`    | `hykim-king/f1_new`<br><https://github.com/hykim-king/f1_new/assets/133944035/4f1d5a8e-2be8-4fb6-9a24-fae4dd117afa>       | 미확인 | 관리자 게시판 관리 화면                                       | 제외  | 조건부                      | 작성자·관리자·게시물 정보가 함께 노출될 가능성이 높음       | 외부, 원본·팀 사용 동의와 비식별화 필요 |

## 4. 저장소 내부 이미지 목록

| 저장소 내부 경로                                    | 형식 |        크기 | 코드에서 확인한 용도                            | Cover/Gallery 적합성 | 위험과 승인                                               |
| --------------------------------------------------- | ---- | ----------: | ----------------------------------------------- | -------------------- | --------------------------------------------------------- |
| `src/main/webapp/resources/img/cancel.png`          | PNG  |    15,429 B | 업로드 선택 취소 아이콘                         | 제외                 | 단일 UI 아이콘, 원본 권리 확인 필요                       |
| `src/main/webapp/resources/img/infinite.gif`        | GIF  | 1,735,887 B | 로그인·관리자 접근 안내 화면의 애니메이션       | 제외                 | 서비스 핵심 장면 아님, 출처·애니메이션 권리 확인 필요     |
| `src/main/webapp/resources/img/passwordicon.png`    | PNG  |    15,668 B | 로그인 비밀번호 입력 아이콘                     | 제외                 | 단일 UI 아이콘, 원본 권리 확인 필요                       |
| `src/main/webapp/resources/img/selectButton.jpg`    | JPG  |    19,305 B | 업로드 파일 선택 버튼과 이미지 관리 placeholder | 제외                 | 실제 결과 화면이 아닌 control 자산                        |
| `src/main/webapp/resources/img/thumbsdown.jpg`      | JPG  |    41,499 B | 인식 결과의 부정 피드백 버튼                    | 제외                 | 단일 UI 아이콘, 원본 권리 확인 필요                       |
| `src/main/webapp/resources/img/thumbsup.jpg`        | JPG  |    39,530 B | 인식 결과의 긍정 피드백 버튼                    | 제외                 | 단일 UI 아이콘, 원본 권리 확인 필요                       |
| `src/main/webapp/resources/img/usericon.png`        | PNG  |    12,621 B | 로그인 사용자명 입력 아이콘                     | 제외                 | 단일 UI 아이콘, 원본 권리 확인 필요                       |
| `src/main/webapp/resources/img/wbx.PNG`             | PNG  |   115,944 B | 코드 참조를 찾지 못한 이미지                    | 제외                 | 화면 내용·출처·사용 여부 미확인                           |
| `src/main/webapp/resources/js/img/infinite.gif`     | GIF  | 1,735,887 B | `resources/img/infinite.gif`와 동일 SHA-1       | 제외                 | 중복 파일, 별도 후보로 세지 않음                          |
| `src/main/webapp/resources/js/img/passwordicon.png` | PNG  |    15,668 B | `resources/img/passwordicon.png`와 동일 SHA-1   | 제외                 | 중복 파일, 별도 후보로 세지 않음                          |
| `src/main/webapp/resources/js/img/usericon.png`     | PNG  |    12,621 B | `resources/img/usericon.png`와 동일 SHA-1       | 제외                 | 중복 파일, 별도 후보로 세지 않음                          |
| `src/main/webapp/resources/js/img/wbx.PNG`          | PNG  |   115,944 B | `resources/img/wbx.PNG`와 동일 SHA-1            | 제외                 | 중복이며 코드 참조 미확인                                 |
| `src/main/webapp/resources/picture/bg01.jpg`        | JPG  |   445,624 B | 코드 참조를 찾지 못한 배경 이미지               | 제외                 | 화면 내용·출처·사용 여부 미확인                           |
| `src/main/webapp/resources/picture/sign.png`        | PNG  |   203,844 B | 코드 참조를 찾지 못한 표지판 이미지             | 제외                 | 실제 서비스 화면이 아니며 원본 권리 미확인                |
| `src/main/webapp/resources/picture/start.jpg`       | JPG  | 1,261,579 B | `login/main.jsp`의 START section 배경           | 낮음/보조 후보       | 장식 배경으로 핵심 기능 설명력이 낮고 원본 권리 확인 필요 |

저장소 내부 파일은 기능 시연 전체 화면이 아니라 아이콘·버튼·배경 자산이 대부분이다. RoadScanner의 핵심 기능을 보여 주는 cover와 gallery에는 README의 실제 UI 원본을 우선 검토한다.

## 5. 외부 호스팅 이미지 목록

- `hykim-king/f1_new` GitHub asset: 15개
  - README 상단 `temp` 1개
  - 기능 시연 14개
- `cheezcyj/RoadScanner` GitHub asset: ERD 1개
- 저장소 내부 Git blob 이미지: 15경로, 고유 11개

`hykim-king/f1_new`의 asset은 RoadScanner 팀 자료일 가능성이 있지만 현재 저장소 소유자와 다른 경로다. Owner가 원본 파일, 촬영·제작 주체와 포트폴리오 재사용 동의를 확인하기 전에는 production 후보로 승격하지 않는다.

## 6. 각 이미지의 예상 화면 내용

README 문맥으로 실제 존재를 확인한 장면은 다음과 같다.

- 핵심 기능: 파일 업로드·교통표지판 인식, 피드백 데이터 통계
- 게시판: 게시글 CRUD, 답변 CRUD, 공지 CRUD, 게시판 관리
- 데이터 관리: 이미지 데이터 관리, 회원 관리
- 사용자 흐름: 메인, 로그인, 회원가입, 계정 찾기, 마이페이지, 내 글 보기
- 설계 자료: ERD

README 상단 `temp`와 내부 `wbx.PNG`, `bg01.jpg`, `sign.png`는 이름과 참조만으로 화면 내용을 확정할 수 없다. 이미지 본문을 확인하지 않았으므로 최종 설명과 alt는 Owner 원본 제공 후 다시 작성한다.

## 7. Cover 후보 순위

1. **파일 업로드·인식 결과** — 서비스의 핵심 입력과 결과를 한 장에서 설명할 수 있어 최우선이다.
2. **서비스 메인 페이지** — 전체 브랜드와 진입 화면을 보여 주지만 핵심 인식 기능의 설명력은 1순위보다 낮다.
3. **README 상단 `temp` 이미지** — 대표 시각물일 가능성은 있으나 화면 내용과 형식이 미확인이라 보류한다.

로그인, 회원가입, 관리자 화면, ERD, 단일 아이콘과 배경 이미지는 cover 후보에서 제외한다.

## 8. Gallery 후보 순위

1. **피드백 데이터 통계** — 핵심 인식 기능과 다른 결과 분석 장면을 보여 준다.
2. **Q&A 게시글 CRUD** — 검색·페이지네이션·게시글 흐름을 대표할 수 있다.
3. **이미지 데이터 관리** — 업로드 데이터 관리 기능을 보여 주되 개인정보와 관리자 데이터를 비식별화해야 한다.
4. **Q&A 답변 CRUD** — 게시글 장면과 중복되지 않는 경우에만 사용한다.
5. **서비스 메인 페이지** — cover가 인식 결과일 때 전체 서비스 진입 장면으로 사용할 수 있다.

파일 업로드·인식 결과를 cover로 선택하면 같은 원본을 gallery에 중복 사용하지 않는다. 메인 화면을 cover로 선택하는 경우에만 인식 결과를 gallery 1순위로 이동한다.

## 9. 제외 후보와 이유

- 회원가입, 계정 찾기, 회원 관리, 마이페이지와 내 글 보기: 개인정보·계정 데이터 위험이 기능 설명 이점보다 크다.
- 공지 CRUD와 게시판 관리: Q&A 장면과 기능이 중복되고 관리자 정보 노출 가능성이 높다.
- ERD: 설계 보조 자료이며 실제 서비스 사용 장면이 아니다.
- 내부 아이콘, 버튼, GIF와 배경: 단독으로 프로젝트 기능을 설명하지 못한다.
- `wbx.PNG`, `bg01.jpg`, `sign.png`: 코드 사용처와 화면 의미를 확인하지 못했다.
- README 상단 `temp`: 장면 내용, 형식과 권리를 확인하기 전까지 보류한다.
- 형식·크기·접근 가능성을 확정하지 못한 GitHub asset: 깨진 이미지로 단정하지 않지만 원본 제공 전 production 사용에서 제외한다.

## 10. 개인정보·민감 정보 점검 항목

- 사용자 ID, 이름, 이메일, 전화번호, 주소와 프로필 정보
- 로그인·회원가입·계정 찾기 입력값과 테스트 비밀번호
- 게시글·답변·공지의 작성자, 제목, 본문과 첨부 파일
- 업로드 파일명, 원본 이미지의 저작권과 사용자 식별 정보
- 관리자 계정, 회원 목록, 내부 상태값과 데이터 식별자
- 브라우저 주소, 로컬 경로, API 주소, 환경 변수와 인증 정보
- 팀원 실명, 발표 자료의 연락처와 공유 문서 권한 정보
- 모델 정확도, 데이터셋명과 내부 평가 수치의 미승인 노출

관리자·회원·게시판 화면은 흐림 처리만으로 판단하지 않고, 가능하면 개인정보가 없는 새 테스트 데이터로 다시 캡처한 원본을 우선한다.

## 11. 이미지 사용 권리 확인 항목

- RoadScanner 팀 프로젝트 화면을 개인 포트폴리오에 사용할 수 있는지
- `hykim-king/f1_new`에 업로드한 팀원 또는 제작자의 재사용 동의가 있는지
- 교통표지판 업로드 원본의 촬영자·데이터셋 라이선스가 공개를 허용하는지
- 내부 아이콘·배경·GIF가 직접 제작물인지 또는 제3자 자산인지
- ERD와 기획 자료의 공동 저작 범위와 공개 허가가 있는지
- GitHub asset을 직접 내려받아 재호스팅할 권한이 있는지
- 저장소에 라이선스가 없다는 점을 Owner가 인지하고 별도 사용 허가를 확보했는지

## 12. 권장 production 경로

승인 이후 별도 단계에서만 다음 경로를 생성한다.

```text
public/images/projects/roadscanner/
```

GitHub raw URL이나 asset URL을 production frontmatter에 직접 연결하지 않는다. Owner가 제공한 원본을 검수하고 최적화한 정적 파일만 사용한다.

## 13. 권장 파일명

실제 README에 존재하는 후보에만 이름을 제안한다.

- `cover.webp` — 승인된 cover 원본
- `recognition-result.webp` — 인식 결과를 cover로 사용하지 않을 때만 gallery 사용
- `feedback-statistics.webp` — 피드백 데이터 통계
- `qna-board.webp` — 게시글 CRUD 또는 대표 Q&A 장면
- `image-management.webp` — 개인정보를 제거한 이미지 관리 장면
- `main-page.webp` — 메인 화면이 cover와 중복되지 않을 때만 사용

## 14. 권장 alt 초안

원본을 직접 확인하기 전의 초안이며 Owner 승인 단계에서 실제 화면에 맞게 수정한다.

- cover: `교통표지판 이미지를 업로드하고 인식 결과와 피드백 버튼을 표시한 RoadScanner 화면`
- recognition result: `업로드한 교통표지판 이미지와 분류 결과를 함께 보여 주는 인식 화면`
- feedback statistics: `교통표지판 인식 피드백을 전체 및 월별 그래프로 시각화한 통계 화면`
- Q&A board: `검색과 페이지네이션, 질문과 답변 기능을 구성한 RoadScanner Q&A 화면`
- image management: `업로드 이미지의 상태를 확인하고 관리하는 RoadScanner 이미지 데이터 화면`
- main page: `RoadScanner의 교통표지판 인식 서비스를 안내하는 메인 화면`

## 15. Phase 4C-2 당시 Owner가 직접 제공해야 했던 원본

- 파일 업로드·인식 결과의 원본 PNG 또는 무손실 캡처
- 피드백 통계 원본
- 개인정보 없는 Q&A 목록 또는 상세 원본
- 개인정보 없는 이미지 관리 원본
- cover 대안으로 사용할 경우 메인 화면 원본
- 각 원본의 촬영자·제작자와 팀 공개 동의 근거
- 화면에 사용된 교통표지판 이미지의 출처와 공개 허가

GitHub asset을 대신 내려받지 않았고 Phase 4C-3에서 Owner가 보유한 별도 원본 폴더를 확보했다. 조사 결과 현재 JPG에는 개발 환경과 민감 데이터가 보여, production에는 권리와 민감 정보가 정리된 환경의 clean 재캡처가 필요하다.

## 16. 다운로드 전에 필요한 승인

- [ ] cover 장면 선택
- [ ] gallery 장면과 순서 선택
- [ ] 원본 파일 제공
- [ ] 팀 프로젝트 화면의 포트폴리오 사용 권리 확인
- [ ] 외부 저장소 asset의 재사용 동의 확인
- [ ] 개인정보·관리자·게시물 데이터 비식별화 확인
- [ ] 업로드 교통표지판 이미지의 권리 확인
- [ ] 파일 형식, 픽셀 크기와 crop 가능 범위 확인
- [ ] production 파일명과 한국어 alt 승인
- [ ] WebP 변환·품질과 `public` 추가 별도 승인

## 17. 최종 공개 체크리스트

- [ ] 실제 원본과 README 후보의 장면 일치 확인
- [ ] 같은 장면의 cover/gallery 중복 없음
- [ ] 깨진 링크와 오래된 외부 asset 제외
- [ ] 이메일·계정·개인정보·관리자 정보 없음
- [ ] 팀원 이름과 공동 작업 범위 공개 승인
- [ ] 이미지 사용 권리와 재호스팅 허가 확인
- [ ] cover 16:9 crop 안전 영역 확인
- [ ] gallery 장면별 실제 width·height 확인
- [ ] alt가 화면 내용과 역할을 정확히 설명
- [ ] 최적화 파일의 MIME, 크기와 중복 hash 검증
- [ ] frontmatter 연결 별도 승인
- [ ] `draft`와 `featured` 상태 별도 승인
- [ ] 최종 공개 승인

## 18. 사이트 전역 직무 표기

`src/config/site.ts`의 현재 값은 다음과 같다.

- `2D/3D Designer`
- `Web Publisher`
- `Fullstack Engineer`

RoadScanner의 `Main Feature Development`, `Machine Learning / Deep Learning Development`, `Q&A Board Development`, `JSP UI Integration`, `Feature Integration`은 프로젝트별 역할이다. 사이트 전역 직무와 목적이 다르므로 충돌로 보지 않으며 이번 단계에서는 전역 roles를 수정하지 않았다.

## 19. Phase 4C-3 원본 미디어 조사 결과

- 원본 폴더: `C:\Users\user\Desktop\portfolio-workspace\roadscanner-media-source`
- 조사 파일: 이미지 30개와 MP4 13개, 총 43개, 약 29.44 MiB
- SHA-256 정확한 중복: 없음
- near-duplicate: perceptual dHash 기준 9쌍
- 이미지 등급: Safe 0개, Review 0개, Redaction Required 18개, Exclude 12개
- MP4 등급: frame 미추출과 시각 검수 미완료로 Review 13개
- JPG 29개: `1920×1080`, EXIF GPS IFD에는 날짜·시각 tag만 있고 좌표 tag는 없음
- MP4 13개: `1920×1080`, H.264/AVC, 30fps, audio track 있음
- animated GIF 1개: `800×407`, 87 frames, 7.26초
- Cover 1순위: `VideoCapture_20231108-170028.jpg`; 인식 결과 설명력은 높지만 localhost, Bandicam, alert와 이미지 권리 위험 때문에 clean 재캡처 필요
- Gallery 후보: 업로드 진입, 피드백 통계, Q&A 목록, 이미지 관리, 서비스 인트로 순서
- Video 후보: `ffmpeg`·`ffprobe` 미설치로 frame과 핵심 구간을 확인하지 못해 최종 후보 0개
- poster: GIF 90%·70% 지점을 육안 후보로만 기록했으며 위험 화면 사본은 저장하지 않음
- 상세 결과: [RoadScanner 미디어 Owner 검토](roadscanner-media-owner-review.md)

원본 확보와 metadata 조사는 완료했지만 아래 항목은 계속 Owner 승인 대기다.

- [ ] clean Cover 재캡처 또는 비식별화 방향
- [ ] Gallery 원본과 순서
- [ ] MP4 frame 추출·시각 검수 방식
- [ ] 개인정보·계정·관리자 데이터 제거 확인
- [ ] 팀 UI·로고·그래픽 사용 동의
- [ ] 교통표지판 이미지와 자동차·도로 footage 권리
- [ ] production 파일명·alt·crop·인코딩
- [ ] frontmatter 연결, `draft`와 `featured` 변경
