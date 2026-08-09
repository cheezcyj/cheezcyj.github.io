---
title: 'RoadScanner'
description: '전체 도로 장면에서 교통표지판 후보를 검출하고 GTSRB 43종 분류, 보안, Q&A와 관리 기능을 연결한 8인 팀 웹 프로젝트입니다.'
draft: false
featured: false
cover:
  src: /images/projects/roadscanner/cover.webp
  alt: 야간 도로 배경 위에 RoadScanner 로고와 AI Road Sign Recognition 문구가 표시된 최신 메인 화면
  width: 1264
  height: 711
gallery:
  - src: /images/projects/roadscanner/upload-entry.webp
    alt: 드래그 앤 드롭과 파일 선택을 제공하는 교통표지판 사진 분석 화면
    width: 1264
    height: 711
  - src: /images/projects/roadscanner/private-inquiry.webp
    alt: 본인과 관리자만 확인할 수 있는 비공개 문의 작성 화면
    width: 1264
    height: 711
  - src: /images/projects/roadscanner/qna-list.webp
    alt: 공지와 일반 글, 검색과 페이지네이션을 제공하는 Q&A 게시판 화면
    width: 1264
    height: 711
  - src: /images/projects/roadscanner/feedback-statistics.webp
    alt: 오류 유형별 누적 피드백을 막대그래프와 표로 보여 주는 관리자 통계 화면
    width: 1264
    height: 711
tags:
  - Team Project
  - Traffic Sign Detection
  - GTSRB Classification
  - ML Pipeline
  - Security Hardening
sourceStatus: verified
status: completed
startedAt: 2023-07-05
completedAt: 2023-08-29
stack:
  - Java
  - Spring MVC 5.3
  - JSP
  - MyBatis
  - Oracle Database
  - H2
  - JavaScript
  - Python
  - Flask
  - TensorFlow
  - ONNX Runtime
  - AWS S3
roles:
  - Main Feature Development
  - Full-stack Development
  - Machine Learning / Deep Learning Development
  - Traffic Sign Detection Pipeline
  - Security Hardening
  - Local Test Environment
  - UI and Feature Integration
repositoryUrl: 'https://github.com/cheezcyj/RoadScanner'
highlights:
  - 전체 도로 장면의 표지판 후보를 검출한 뒤 독일 GTSRB 43종으로 분류하고 신뢰 기준 밖 입력은 인식 불가로 처리
  - 사진 선택·미리보기·분석 결과·의견 제출을 하나의 흐름으로 연결
  - 공개 Q&A와 분리된 비공개 문의, 공지, 계정·이미지 데이터·피드백 통계 관리 기능 구성
  - CSRF 방어, BCrypt 비밀번호, 로그인·메일 발급 제한, 입력 정제와 권한 검증 보강
  - H2 기반 local-smoke와 Java·Python 통합 실행 및 단위·통합·회귀 테스트 구성
---

## 프로젝트 개요

RoadScanner는 2023년 7월 5일부터 8월 29일까지 8인 팀으로 만든 교통표지판 인식 웹 프로젝트다. 이미지 업로드와 분류 결과, 피드백 통계, Q&A, 회원과 관리자 기능을 하나의 Spring MVC 애플리케이션으로 구현했다.

현재 공개 저장소는 전체 도로 장면에서 표지판 후보를 찾은 뒤 GTSRB 43종으로 분류하며, 지원 범위 밖 입력은 인식 불가로 처리한다. 화면과 인증·권한, 로컬 실행 환경과 테스트 구성도 함께 제공한다.

## 현재 프로젝트 구성

- 메인·업로드·회원·Q&A·관리자 화면을 하나의 시각 체계로 구성
- 전체 장면 검출, crop, GTSRB 43종 분류와 OOD·신뢰도 판정을 하나의 Python 분석 파이프라인으로 통합
- 공개 Q&A와 분리된 비공개 문의 및 관리자 답변 흐름 추가
- Oracle 운영 구성을 유지하면서 H2 기반 로컬·통합 테스트 환경 마련
- Java 웹 서버와 Python 분석 서비스를 함께 시작하고 종료하는 로컬 통합 실행 스크립트 구성
- 일반화된 로컬 테스트 데이터만 사용한 최신 기능 시연 자료와 재현 문서 정리

## 핵심 이용 흐름

### 방문자

서비스 소개와 지원 범위를 확인하고 로그인·회원가입, 아이디·비밀번호 찾기와 Q&A 조회·검색 기능을 이용할 수 있다.

### 회원

사진을 드래그 앤 드롭하거나 파일로 선택한 뒤 미리보기, 분석 실행, 결과 확인과 의견 제출까지 한 흐름으로 진행한다. 마이페이지와 공개 Q&A 작성·수정·삭제, 본인과 관리자만 확인하는 비공개 문의도 제공한다.

### 관리자

계정 상태, 문의 답변, 공지와 게시물, 분석 이미지 데이터와 피드백 통계를 관리한다. 분석 피드백은 오류 유형별 누적 수치와 월별 변화로 확인할 수 있다.

## 교통표지판 분석 파이프라인

전체 사진을 작은 분류 모델에 바로 넣지 않고 다음 순서로 처리한다.

1. ONNX Runtime 기반 검출기가 도로 장면에서 교통표지판 후보 위치를 찾는다.
2. 검출 영역을 정사각형에 가깝게 잘라 TensorFlow/Keras 분류기에 전달한다.
3. 분류기는 독일 GTSRB 데이터셋의 43개 클래스로 결과를 예측한다.
4. confidence, top-1 margin, OOD 기준과 여러 후보의 합의 조건을 확인한다.
5. 기준을 통과한 경우에만 결과를 확정하고, 나머지는 결과 ID 44인 인식 불가로 처리한다.

검출기는 일반적인 표지판 위치를 찾지만 의미 분류 범위는 독일 GTSRB 43종에 한정된다. 다른 국가의 표지판이나 지원 범위 밖 이미지는 올바른 의미를 보장하지 않으므로 보수적으로 거부하도록 설계했다. 저장소에는 모델 계약, 데이터셋 출처, 학습·평가 방법과 한계를 함께 기록했다.

## 풀스택·보안 구성

- Java 8, Spring MVC 5.3.39, JSP/JSTL 기반 Maven WAR 구성
- MyBatis와 Oracle JDBC를 사용한 운영 데이터 접근, H2 Oracle 모드를 사용한 로컬·통합 테스트
- AWS SDK for Java v2를 사용한 S3 객체 저장과 로컬 파일 저장 대체 구현
- Spring RestTemplate과 제한된 응답 계약을 통한 Flask /predict 연동
- BCrypt 비밀번호 저장과 길이 정책, 로그인 실패 제한과 이메일 인증 발급 제한
- synchronizer token 방식의 CSRF 방어, 역할별 접근 제어와 Q&A rich text 정제
- 업로드 이미지 MIME·크기·decode 검증, 분석 URL host allowlist와 redirect·과대 응답 차단
- 모델·클래스 맵·OOD·검출기 artifact와 Java/Python 결과 카탈로그의 hash 불일치 시 fail-closed 처리

## 로컬 실행과 검증

외부 서비스가 없는 local-smoke에서는 H2 데이터베이스, 로컬 파일 저장, 메모리 메일함과 안전한 분석 대체 구현을 사용한다. 실제 분석이 필요한 local,local-ml 구성에서는 통합 스크립트가 Flask 서비스의 준비 상태를 확인한 뒤 Spring 웹 서버를 시작하며, 두 프로세스는 loopback 주소에만 바인딩된다.

Java 쪽에는 단위 테스트, H2 DAO 통합 테스트와 JaCoCo 기준이 있고 Python 쪽에는 분류·검출·OOD·prototype·API·경로 위생을 확인하는 단위 및 회귀 테스트가 있다. 저장소는 검증 명령과 한계를 공개하지만 현재 별도 운영 배포나 GitHub Actions 실행을 제공하지 않으므로, 테스트 체계와 운영 서비스 상태를 같은 의미로 표현하지 않는다.

## 담당 역할

2023년 팀 프로젝트에서는 메인 기능과 머신러닝·딥러닝 개발에 참여했다. Q&A 데이터 구조와 CRUD, 검색·페이지네이션·공지·답변 흐름을 구현하고 JSP UI와 업로드·회원·게시판 기능을 통합했다.

공개 저장소에서는 웹과 ML 구조를 현재 개발 환경에서 다시 실행하고 검증할 수 있도록 정비했다. 전체 장면 검출과 분류·거부 파이프라인, 보안 정책, 로컬 실행·테스트 환경, UI와 공개 문서를 함께 구성했다.

## 현재 상태와 한계

2023년 팀 프로젝트의 완료 기록과 현재 구현 상태를 함께 정리했다. 소스 코드와 재현 문서는 공개 GitHub 저장소에서 확인할 수 있지만 현재 동작하는 별도 공개 배포 URL은 없다.

저장소의 분류·검출 수치는 각각 정해진 데이터와 작은 validation 범위에서 측정한 결과다. 이를 실제 도로 환경의 안전 성능이나 무감독 운영 성능으로 해석하지 않으며, 국가별 의미 체계 확장과 독립 full-scene test set 검증은 후속 과제로 남겨 두었다.
