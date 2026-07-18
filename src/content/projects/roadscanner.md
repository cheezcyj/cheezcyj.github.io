---
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
---

## 프로젝트 개요

RoadScanner는 자율주행 목적의 교통표지판 이미지 인식을 주제로 진행한 8인 팀 웹 프로젝트다. 저장소 README에 기록된 프로젝트 기간은 2023년 7월 5일부터 8월 29일까지다.

사용자가 교통표지판 이미지를 업로드하면 인식 결과를 확인하고, 결과에 대한 피드백과 통계를 살펴볼 수 있도록 구성했다. 회원 기능, 이미지 데이터 관리, Q&A와 공지 관리 기능도 같은 웹 애플리케이션에 포함했다.

## 프로젝트 목표

- 딥러닝 모델로 교통표지판 이미지를 식별하고 분류한다.
- 인식 성능과 결과를 시각화해 직관적으로 확인할 수 있게 한다.
- 사용자 피드백을 수집해 모델 평가와 개선에 활용한다.

## 담당 역할

README의 팀원 목록에 최유정이 포함되어 있다. `cheezcyj` 계정의 커밋에서는 Q&A DAO와 도메인 구조, 컨트롤러·서비스·MyBatis 매퍼, JSP와 JavaScript 화면을 추가하거나 수정한 기록을 확인할 수 있다.

또한 검색과 페이지네이션, 공지 분리, 이미지 파일 검증을 포함한 Q&A 흐름을 보정하고, 공통 헤더·내비게이션·푸터와 여러 JSP 화면을 통합한 커밋이 남아 있다. 업로드와 회원 기능을 main 구조에 합치고 관련 화면과 서비스를 정리한 변경도 확인된다.

Owner는 메인 기능 개발과 머신러닝·딥러닝 개발에도 참여했다고 확인했다. 다만 공개 저장소에서 모델 학습 코드, 데이터셋과 학습 환경은 확인되지 않으므로 세부 학습 방식이나 성능 수치는 이 콘텐츠에 포함하지 않았다.

## 기술 구성

- Java 8과 Spring MVC 5.3.27 기반의 Maven WAR 프로젝트
- JSP, JSTL, JavaScript와 CSS로 구성한 서버 렌더링 화면
- MyBatis 매퍼와 Oracle JDBC를 사용한 데이터 접근 구조
- Spring Cloud AWS와 AWS SDK for Java를 사용한 S3 파일 저장 구조
- Spring `RestTemplate`으로 업로드 이미지 URL을 Flask 예측 API에 전달하는 연동
- Chart.js와 Ajax를 사용한 전체·월별 피드백 통계 화면

저장소에는 `road_scanner.h5` 모델 파일이 포함되어 있지만, 모델 학습 코드와 학습 환경은 이 저장소에서 확인되지 않는다.

## 주요 기능

- 회원가입, 로그인, 아이디·비밀번호 찾기, 마이페이지와 회원 탈퇴
- 교통표지판 이미지 업로드와 인식 결과 조회
- 인식 결과에 대한 피드백 수집과 전체·월별 통계 시각화
- 이미지 데이터 목록, 선택 상태 변경과 삭제를 포함한 관리 화면
- 질문 작성·조회·수정·삭제, 검색, 페이지네이션, 공지와 답변 관리
- 관리자용 회원, 게시물과 이미지 데이터 관리 화면

## 구현 과정

2023년 7월 말 Q&A 데이터 구조와 CRUD 기반을 추가한 뒤, 8월에는 Q&A 전용 JSP 화면과 컨트롤러를 연결했다. 이후 검색, 페이지네이션, 공지 분리, 첨부 이미지 검증과 공통 레이아웃을 순차적으로 보정했다.

8월 말에는 로그인과 파일 업로드 기능을 main 구조에 통합하고 JSP, JavaScript와 CSS 화면을 정리했다. 프로젝트 기간 종료 다음 날의 커밋에는 업로드·이미지 관리·회원 서비스와 전체 화면 구조를 함께 보정한 기록이 있다.

## 현재 상태

README에 프로젝트 종료일이 2023년 8월 29일로 기록되어 있어 완료 프로젝트로 분류했다. 공개 GitHub 저장소는 확인되지만, 현재 동작하는 배포 주소는 확인되지 않았다. Owner가 제목, 설명, 사실관계, 역할, 기술 스택, 기간과 저장소 연결을 승인해 출처 상태는 검증 완료로 전환했지만, 미디어와 최종 공개 승인이 남아 있어 비공개 초안으로 유지한다.
