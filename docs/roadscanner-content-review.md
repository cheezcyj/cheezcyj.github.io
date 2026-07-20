# RoadScanner 콘텐츠 Owner 검토

이 문서는 RoadScanner 프로젝트 초안의 근거와 미확인 항목을 분리해 기록한다. Owner가 콘텐츠 사실관계와 역할을 승인해 현재 상태는 `draft: true`, `sourceStatus: verified`다. 미디어와 최종 공개 승인은 아직 완료되지 않아 공개 대상이 아니다.

## 1. 확인한 로컬 경로

다음과 같은 일반 로컬 개발 위치에서 RoadScanner 저장소 또는 별도 자료를 검색했으나 로컬 체크아웃은 발견하지 못했다.

- `<workspace>`
- `<user-documents>/GitHub`
- `<source-repositories>`
- `<ide-workspace>`
- `<user-downloads>`

자동 clone은 수행하지 않았다.

## 2. 확인한 GitHub 저장소

- 저장소: `cheezcyj/RoadScanner`
- URL: <https://github.com/cheezcyj/RoadScanner>
- 공개 범위: Public
- 기본 브랜치: `main`
- 저장소 설명: `자율주행 목적용 교통표지판 이미지 인식 페이지`
- 주요 언어 표시: Java

GitHub 저장소는 인증된 GitHub CLI로 읽기 전용 조사했다. 저장소 설정, remote, 파일, issue, release와 PR은 변경하지 않았다.

## 3. 조사한 파일

- `README.md`: 프로젝트 개요, 팀원, 기간, 목표, 기획 자료와 기능 시연 목록
- `pom.xml`: Java·Spring MVC·MyBatis·Oracle JDBC·AWS S3·파일 업로드·메일·검증·테스트 의존성
- `road_scanner.h5`: 모델 파일 존재와 크기만 확인
- `src/main/java/com/roadscanner/service/upload/RestTemplateServiceImpl.java`: Flask 예측 API 호출 구조
- `src/main/java/com/roadscanner/controller/upload/UploadController.java`: 이미지 업로드, 예측 요청과 피드백 처리
- `src/main/java/com/roadscanner/controller/upload/ImgManageController.java`: 이미지 관리와 피드백 통계 API
- `src/main/java/com/roadscanner/controller/qna/QuestionController.java`: Q&A 목록, 검색, 페이지네이션과 상세 화면
- `src/main/java/com/roadscanner/controller/qna/QuestionApiController.java`: 질문 생성·조회·수정·삭제 API
- `src/main/java/com/roadscanner/controller/user/LoginController.java`: 로그인, 회원가입과 계정 찾기
- `src/main/java/com/roadscanner/controller/user/UserInfoController.java`: 마이페이지와 회원 정보 변경
- `src/main/resources/mapper/**`: 회원·Q&A·결과·업로드 MyBatis 매퍼 구조
- `src/main/webapp/WEB-INF/views/graph.jsp`: Chart.js 피드백 통계 화면
- `src/main/webapp/resources/js/graph.js`: 전체·월별 피드백 Ajax와 차트 렌더링
- 공개 커밋 이력과 대표 커밋의 변경 파일

비밀값 노출 가능성이 있는 `application.properties`의 값은 조사하거나 문서화하지 않았다. 저장소 이미지와 외부 문서 이미지는 다운로드하지 않았다.

## 4. 현재 frontmatter 전체

```yaml
title: 'RoadScanner'
description: '교통표지판 이미지를 업로드해 인식 결과를 확인하고, 피드백·통계·Q&A·회원 관리 기능을 제공한 8인 팀 웹 프로젝트입니다.'
draft: true
featured: false
tags:
  - Team Project
  - Traffic Sign Recognition
  - Image Upload
  - Q&A
sourceStatus: verified
status: completed
startedAt: 2023-07-05
completedAt: 2023-08-29
stack:
  - Java
  - Spring MVC
  - JSP
  - MyBatis
  - Oracle Database
  - JavaScript
  - AWS S3
roles:
  - Main Feature Development
  - Machine Learning / Deep Learning Development
  - Q&A Board Development
  - JSP UI Integration
  - Feature Integration
repositoryUrl: 'https://github.com/cheezcyj/RoadScanner'
highlights:
  - 업로드한 교통표지판 이미지 URL을 Flask 예측 API로 전달하고 인식 결과를 표시
  - 사용자 피드백의 전체·월별 통계를 Chart.js 막대 및 선 그래프로 시각화
  - 검색, 페이지네이션, 공지 분리, 답변을 포함한 Q&A 게시판 구성
  - 로그인, 회원가입, 계정 찾기, 마이페이지와 관리자용 회원·이미지 관리 화면 구성
```

`cover`, `gallery`, `slug`, `legacyUrls`와 `demoUrl`은 추가하지 않았다. canonical ID는 컬렉션 상대 파일 경로에서 계산되는 `roadscanner`다.

## 5. 저장소에서 확인한 사실

- 공개 저장소이며 기본 브랜치는 `main`이다.
- Maven WAR 구조의 Java 8·Spring MVC 웹 애플리케이션이다.
- MyBatis 매퍼와 Oracle JDBC 의존성이 있다.
- S3 저장 클래스와 AWS 관련 의존성이 있다.
- 업로드 이미지 URL을 Spring `RestTemplate`으로 Flask `/predict` API에 전송한다.
- Q&A, 회원, 이미지 업로드·관리, 결과와 피드백 관련 컨트롤러·서비스·DAO·화면이 있다.
- Chart.js와 Ajax를 사용한 전체·월별 피드백 통계 화면이 있다.
- `road_scanner.h5` 모델 파일은 있으나 이 저장소에서 모델 학습 코드는 확인되지 않는다.

## 6. 문서에서 확인한 사실

README 기준으로 확인한 내용이다.

- 유형: 자율주행 표지판 인식 사이트
- 팀 구성: Owner를 포함한 8인 팀
- 기간: 2023년 7월 5일~8월 29일
- 목표: 교통표지판 식별·분류, 인식 성능과 결과 시각화, 사용자 피드백을 통한 평가·개선
- 기능 시연 목록: 메인, 회원, 업로드·인식, 이미지 데이터 관리, 통계, 게시물·답변·공지 관리

## 7. 미확인 정보

- 현재 실행 가능한 배포 주소
- 모델 학습 코드, 데이터셋 출처와 학습 환경
- 모델 정확도, 처리 속도와 평가 지표
- 실제 사용자 수와 운영 기간
- 사용자 개인의 공식 역할명과 팀 내 역할 분담 문서
- 공개 가능한 문제 해결 사례와 회고
- 수상, 발표 또는 외부 평가 결과
- README GitHub asset의 정확한 형식, 픽셀 크기와 원본 파일
- 대표 이미지와 상세 이미지의 사용 권리·개인정보 검수 및 최종 공개 승인

## 8. 사용자 역할 확인 항목

README는 최유정을 8인 팀원 중 한 명으로 기록한다. `cheezcyj`가 작성한 공개 커밋에서는 다음 변경을 확인했다.

- Q&A DAO·도메인·컨트롤러·서비스·MyBatis 매퍼 변경
- 질문 CRUD, 검색, 페이지네이션, 공지 분리와 답변 화면 변경
- JSP, JavaScript, CSS와 공통 레이아웃 통합
- 파일 업로드 검증과 main 브랜치 기능 통합

공개 커밋에서 확인한 역할과 별도로 Owner는 메인 기능 개발과 머신러닝·딥러닝 개발에 참여했다고 확인했다. 현재 `roles`는 저장소 근거와 Owner 직접 확인을 함께 반영한다.

- `Main Feature Development`: Owner 직접 확인
- `Machine Learning / Deep Learning Development`: Owner 직접 확인
- `Q&A Board Development`: 공개 커밋으로 확인
- `JSP UI Integration`: 공개 커밋으로 확인
- `Feature Integration`: 공개 커밋으로 확인

공동 프로젝트라는 표현은 유지하며 개인 단독 개발로 기술하지 않는다. 모델 학습 코드와 데이터셋은 공개 저장소에서 확인되지 않으므로 머신러닝·딥러닝의 세부 구현 방식과 성능은 별도 근거 없이 확장하지 않는다.

## 9. 기술 스택 확인 항목

현재 스택은 dependency와 실제 소스가 함께 확인되는 항목으로 제한했다.

- Java 8
- Spring MVC 5.3.27
- JSP/JSTL
- MyBatis
- Oracle JDBC
- JavaScript
- AWS S3

Flask는 예측 API 호출 대상 코드로 확인되지만, 별도 Flask 서버 소스와 의존성 파일은 현재 저장소에서 확인되지 않아 frontmatter `stack`에는 넣지 않았다. Chart.js는 JSP와 JavaScript에서 확인되며 본문에만 기록했다.

머신러닝·딥러닝 개발 참여는 Owner가 역할로 승인했지만, 공개 저장소에서 학습 환경을 재현할 dependency와 소스가 확인되지 않아 frontmatter `stack`에는 추측해 추가하지 않았다.

## 10. 프로젝트 기간 확인

- 시작일: 2023년 7월 5일
- 완료일: 2023년 8월 29일
- 근거: README의 프로젝트 개요 표

GitHub 저장소 생성일이나 첫 커밋일을 프로젝트 시작일로 대체하지 않았다.

## 11. 프로젝트 상태 확인

README에 종료일이 명시되어 있어 `status: completed`로 분류했다. 종료일 뒤 README 보완과 2023년 8월 30일 구조·화면 정리 커밋이 있지만, 현재 운영 중이라는 근거는 없다.

## 12. repository 공개 승인

저장소가 Public인 사실과 URL을 확인했고 Owner가 콘텐츠의 저장소 연결을 승인했다. `repositoryUrl`은 유지하지만 프로젝트 카드와 상세는 draft 정책으로 공개되지 않는다. 최종 공개 승인은 미디어와 외부 노출 범위를 다시 확인한 뒤 별도로 진행한다.

## 13. demo URL 여부

README와 저장소 메타데이터에서 현재 동작하는 공개 demo URL을 확인하지 못했다. 소스의 예측 API 주소는 공개 demo가 아니므로 `demoUrl`을 작성하지 않았다.

## 14. cover 준비 항목

현재 cover 연결은 없다. Phase 4C-3에서 Owner 제공 원본을 조사해 파일 업로드와 교통표지판 인식 결과가 함께 보이는 `VideoCapture_20231108-170028.jpg`를 1순위로 분류했다. 다만 localhost, Bandicam, alert와 업로드 이미지 권리 위험 때문에 `Redaction Required`이며, 현재 원본 그대로 production에 사용할 수 없다. clean 재캡처 또는 별도 승인된 비식별화와 권리 확인이 필요하다.

## 15. gallery 준비 항목

현재 gallery 연결은 없다. Phase 4C-3 원본 검수에서는 업로드 진입, 피드백 통계, Q&A 목록, 이미지 관리와 서비스 인트로를 권장 순서로 정했다. 모든 후보가 `Redaction Required`이며 계정명, localhost, 서비스 데이터 또는 제3자 이미지 권리 확인이 남아 있다. cover 1순위와 같은 원본은 gallery에서 제외했다. 상세 결과는 `docs/roadscanner-media-owner-review.md`에 기록했다.

## 16. 공개 가능한 정량 성과

현재 공개 가능한 정확도, 속도, 사용자 수, Lighthouse 점수, 수상 내역과 같은 정량 성과는 확인되지 않았다. 수치가 필요하면 측정 방법과 원본 근거를 Owner가 제공해야 한다.

## 17. sourceStatus verified 전환 결과

Owner가 다음 항목을 승인했다.

- 제목과 한 줄 설명
- 8인 팀 구성, 기간, 목표와 기능 사실관계
- 기존 공개 커밋으로 확인한 역할과 기여 범위
- 메인 기능 개발과 머신러닝·딥러닝 개발 참여
- 기술 스택과 프로젝트 완료 상태
- 시작일과 완료일
- 공개 GitHub 저장소 연결
- 현재 본문 내용

이에 따라 `sourceStatus: verified`로 전환했다. 현재 연결된 cover와 gallery는 없으며, 미디어 승인과 정량 성과, demo URL 및 최종 공개 승인은 이 전환에 포함하지 않았다.

## 18. draft 해제 조건

대표 이미지 준비, 상세 페이지 시각 검수, 외부 링크 안전성 확인과 Owner의 최종 공개 승인이 모두 필요하다. 이번 단계에서는 `draft: true`, `featured: false`를 유지한다.

## 19. Owner 체크리스트

- [x] 프로젝트 제목
- [x] 한 줄 설명
- [x] 사실관계
- [x] 사용자 역할
- [x] 기술 스택
- [x] 프로젝트 상태
- [x] 시작일
- [x] 완료일
- [x] 저장소 공개 여부
- [x] 공개 본문 문장 정리
- [ ] demo URL
- [ ] 대표 이미지
- [ ] gallery 상세 이미지
- [ ] 이미지 사용 권리
- [ ] 개인정보·관리자 정보 검수
- [ ] 공개 가능한 성과
- [x] sourceStatus verified 전환
- [ ] featured 여부
- [ ] draft 해제
- [ ] 최종 공개 승인

## 20. Phase 4C-2 공개 문장과 미디어 조사 결과

- 공개 본문에서 README·commit·Owner 승인과 draft/sourceStatus를 직접 설명하던 내부 검증 표현을 제거했다.
- 8인 팀 프로젝트에서 메인 기능과 머신러닝·딥러닝 개발에 참여하고 Q&A, JSP UI와 기능 통합을 담당한 범위로 자연스럽게 정리했다.
- README GitHub asset 16개와 저장소 내부 이미지 15경로를 조사했다.
- README asset 16개는 확장자 없는 URL이며 HEAD 403으로 형식과 크기를 확정하지 못했다.
- 저장소 내부 15경로는 고유 이미지 11개이며 대부분 아이콘·버튼·배경으로 cover 우선순위가 낮다.
- README asset 중 15개가 외부 팀 공동작업 저장소에 호스팅되고 저장소 라이선스가 없어 Owner와 팀의 원본·사용 권리 확인이 필요하다.
- 이미지 다운로드, WebP 변환, `public` 추가와 cover/gallery frontmatter 연결은 수행하지 않았다.
- `draft: true`, `featured: false`, `sourceStatus: verified`를 유지했다.
- 사이트 전역 roles는 `2D/3D Designer`, `Web Publisher`, `Fullstack Engineer`이며 수정하지 않았다.

## 21. Phase 4C-3 원본 미디어 확보와 공개 대기 상태

- Owner가 제공한 저장소 외부 원본 폴더에서 이미지 30개와 MP4 13개를 확인했다.
- 원본은 수정·이동·삭제하거나 저장소 안으로 복사하지 않았다.
- 정확한 중복은 없고 near-duplicate 후보 9쌍을 기록했다.
- JPG 29개와 animated GIF 1개를 직접 확인해 장면과 위험을 분류했다.
- Safe 정적 이미지는 0개이며 Redaction Required 18개, Exclude 12개다.
- MP4 13개는 metadata를 확인했지만 `ffmpeg`·`ffprobe`가 없어 frame 기반 시각 검수는 미완료다.
- Cover와 Gallery 후보를 정했지만 현재 상태 그대로 공개 승인한 후보는 없다.
- 개인정보 검수는 정적 이미지에 대해 수행했으나 MP4 검수가 남아 있어 Owner 체크리스트의 개인정보 항목은 완료 처리하지 않았다.
- 팀 제작물 사용 동의와 교통표지판·자동차·도로 이미지 권리는 미확인이다.
- `draft: true`, `featured: false`, `sourceStatus: verified`와 cover·gallery 미연결 상태를 유지했다.
- 상세 후보와 승인 항목은 `docs/roadscanner-media-owner-review.md`를 따른다.

## 22. Phase 4C-3.1 비식별화 검토본과 공개 대기 상태

- 정적 원본 5개와 animated GIF 1개에서 검토본 8개를 만들었으며 원본·`public`·RoadScanner frontmatter는 변경하지 않았다.
- Safe Review Candidate는 Statistics와 Q&A의 2개다. Rights Review Required 5개와 Further Redaction Required 1개는 권리 또는 콘텐츠 승인 전 공개할 수 없다.
- Cover는 같은 인식 결과 원본의 16:9 crop 2개를 제안했으며 업로드 교통표지판과 팀 UI 권리는 Pending이다.
- Gallery는 Statistics, Q&A, Upload, 조건부 Image Management 순서로 좁혔다. 통계 수치와 Q&A 비식별화 범위는 Owner 승인 대기다.
- GIF 5.00초 frame은 poster 대안으로만 유지하고, 검증되지 않은 정량 문구가 보이는 6.42초 frame은 후보에서 제외했다.
- 설치된 영상 decoder가 없어 MP4 frame·contact sheet는 0개다. MP4 13개의 장면·개인정보·audio 내용 검수는 미완료다.
- `draft: true`, `featured: false`, `sourceStatus: verified`, cover·gallery 미연결 상태를 유지한다.
- 상세 결과는 [RoadScanner 비식별화·영상 검토](roadscanner-media-redaction-review.md)에 기록했다.

Owner 승인 대기 항목은 Cover crop, Gallery 순서, 마스크 범위, 집계 수치, Q&A 비식별화, 팀 UI·로고, 교통표지판·데이터셋 이미지, GIF·도로 footage, Video 구간·audio 제거, production 변환과 최종 공개다. 완료되지 않은 체크리스트는 그대로 둔다.
