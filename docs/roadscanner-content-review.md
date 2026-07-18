# RoadScanner 콘텐츠 Owner 검토

이 문서는 RoadScanner 프로젝트 초안의 근거와 미확인 항목을 분리해 기록한다. 현재 콘텐츠는 `draft: true`, `sourceStatus: inventory-only`이며 공개 대상이 아니다.

## 1. 확인한 로컬 경로

다음 위치에서 RoadScanner 저장소 또는 별도 자료를 검색했으나 로컬 체크아웃은 발견하지 못했다.

- `C:\Users\user\Desktop\portfolio-workspace`
- `C:\Users\user\Documents\GitHub`
- `C:\Users\user\source\repos`
- `C:\Users\user\eclipse-workspace`
- `C:\Users\user\Downloads`

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
sourceStatus: inventory-only
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
- 팀원: 최유정, 김정민, 송세림, 오동훈, 이주영, 장태근, 차지욱, 차현경
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
- 대표 이미지와 상세 이미지의 최종 공개 승인

## 8. 사용자 역할 확인 항목

README는 최유정을 8인 팀원 중 한 명으로 기록한다. `cheezcyj`가 작성한 공개 커밋에서는 다음 변경을 확인했다.

- Q&A DAO·도메인·컨트롤러·서비스·MyBatis 매퍼 변경
- 질문 CRUD, 검색, 페이지네이션, 공지 분리와 답변 화면 변경
- JSP, JavaScript, CSS와 공통 레이아웃 통합
- 파일 업로드 검증과 main 브랜치 기능 통합

현재 `roles`는 이 커밋 범위에 맞춰 작성했다. Owner는 역할명이 실제 팀 내 표현과 맞는지, 공동 작업을 개인 단독 구현처럼 보이게 하지 않는지 검토해야 한다.

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

## 10. 프로젝트 기간 확인

- 시작일: 2023년 7월 5일
- 완료일: 2023년 8월 29일
- 근거: README의 프로젝트 개요 표

GitHub 저장소 생성일이나 첫 커밋일을 프로젝트 시작일로 대체하지 않았다.

## 11. 프로젝트 상태 확인

README에 종료일이 명시되어 있어 `status: completed`로 분류했다. 종료일 뒤 README 보완과 2023년 8월 30일 구조·화면 정리 커밋이 있지만, 현재 운영 중이라는 근거는 없다.

## 12. repository 공개 승인

저장소가 Public인 사실과 URL은 확인했다. 콘텐츠에 `repositoryUrl`을 포함했지만 프로젝트 카드와 상세는 draft 정책으로 공개되지 않는다. 최종 공개 전에 Owner가 저장소 내부의 설정 파일, 빌드 산출물과 모델 파일까지 외부에 연결해도 되는지 다시 승인해야 한다.

## 13. demo URL 여부

README와 저장소 메타데이터에서 현재 동작하는 공개 demo URL을 확인하지 못했다. 소스의 예측 API 주소는 공개 demo가 아니므로 `demoUrl`을 작성하지 않았다.

## 14. cover 준비 항목

현재 cover는 없다. Owner가 직접 소유하고 공개를 승인한 실제 화면을 준비한 뒤 별도 미디어 단계에서 크기, 포맷, 대체 텍스트와 화면 내 개인정보를 검토해야 한다. 이번 단계에서는 이미지 생성·다운로드·복사를 하지 않았다.

## 15. gallery 준비 항목

현재 gallery는 없다. 후보 화면은 업로드·인식 결과, 피드백 통계, Q&A 목록·상세와 관리자 화면이지만, 원본 확보와 공개 승인이 선행되어야 한다. README의 외부 호스팅 이미지는 다운로드하지 않았다.

## 16. 공개 가능한 정량 성과

현재 공개 가능한 정확도, 속도, 사용자 수, Lighthouse 점수, 수상 내역과 같은 정량 성과는 확인되지 않았다. 수치가 필요하면 측정 방법과 원본 근거를 Owner가 제공해야 한다.

## 17. sourceStatus verified 전환 조건

- 제목과 한 줄 설명 승인
- 팀 구성, 기간, 목표와 기능 사실관계 승인
- 사용자 역할과 기여 범위 승인
- 기술 스택 승인
- 저장소 링크 공개 승인
- cover와 gallery의 소유권·개인정보·공개 범위 승인
- 본문에 포함할 문제 해결과 회고를 Owner가 직접 확인

조건을 충족한 뒤에만 `sourceStatus: verified` 전환을 별도 단계로 진행한다.

## 18. draft 해제 조건

`sourceStatus: verified` 전환, 대표 이미지 준비, 상세 페이지 시각 검수, 외부 링크 안전성 확인과 Owner의 최종 공개 승인이 모두 필요하다. 이번 단계에서는 `draft: true`를 유지한다.

## 19. Owner 체크리스트

- [ ] 프로젝트 제목
- [ ] 한 줄 설명
- [ ] 사실관계
- [ ] 사용자 역할
- [ ] 기술 스택
- [ ] 프로젝트 상태
- [ ] 시작일
- [ ] 완료일
- [ ] 저장소 공개 여부
- [ ] demo URL
- [ ] 대표 이미지
- [ ] 상세 이미지
- [ ] 공개 가능한 성과
- [ ] sourceStatus verified 전환
- [ ] 최종 공개 승인
