---
title: 'RoadScanner'
description: '교통표지판 이미지를 업로드해 인식 결과를 확인하고, 피드백·통계·Q&A·회원 관리 기능을 제공한 8인 팀 웹 프로젝트입니다.'
draft: true
featured: false
cover:
  src: /images/projects/roadscanner/cover.webp
  alt: 차량과 전방 감지 카메라 그래픽 위에 RoadScanner 로고가 표시된 시작 화면
  width: 800
  height: 386
gallery:
  - src: /images/projects/roadscanner/feedback-statistics.webp
    alt: 사용자 피드백 통계를 막대그래프와 표로 보여 주는 화면
    width: 1920
    height: 964
  - src: /images/projects/roadscanner/qna-list.webp
    alt: 검색, 답변 상태, 페이지네이션 구조가 보이는 비식별화된 Q&A 게시판 화면
    width: 1920
    height: 964
  - src: /images/projects/roadscanner/upload-entry.webp
    alt: 교통표지판 이미지를 업로드하는 진입 화면
    width: 1920
    height: 964
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

RoadScanner는 자율주행 목적의 교통표지판 이미지 인식을 주제로 2023년 7월 5일부터 8월 29일까지 진행한 8인 팀 웹 프로젝트다.

사용자가 교통표지판 이미지를 업로드하면 인식 결과를 확인하고, 결과에 대한 피드백과 통계를 살펴볼 수 있도록 구성했다. 회원 기능, 이미지 데이터 관리, Q&A와 공지 관리 기능도 같은 웹 애플리케이션에 포함했다.

## 프로젝트 목표

- 딥러닝 모델로 교통표지판 이미지를 식별하고 분류한다.
- 인식 성능과 결과를 시각화해 직관적으로 확인할 수 있게 한다.
- 사용자 피드백을 수집해 모델 평가와 개선에 활용한다.

## 담당 역할

8인 팀 프로젝트에서 메인 기능과 머신러닝·딥러닝 개발에 참여했다. Q&A 게시판의 데이터 구조와 CRUD를 구성하고 검색, 페이지네이션, 공지 분리와 답변 기능을 구현했다.

JSP와 JavaScript 기반 화면에 공통 헤더·내비게이션·푸터를 연결하고, 이미지 파일 검증을 포함한 Q&A 흐름을 다듬었다. 업로드·회원·게시판 기능을 main 브랜치에 통합하고 관련 화면과 서비스를 정리했다.

## 기술 구성

- Java 8과 Spring MVC 5.3.27 기반의 Maven WAR 프로젝트
- JSP, JSTL, JavaScript와 CSS로 구성한 서버 렌더링 화면
- MyBatis 매퍼와 Oracle JDBC를 사용한 데이터 접근 구조
- Spring Cloud AWS와 AWS SDK for Java를 사용한 S3 파일 저장 구조
- Spring `RestTemplate`으로 업로드 이미지 URL을 Flask 예측 API에 전달하는 연동
- Chart.js와 Ajax를 사용한 전체·월별 피드백 통계 화면

Spring 웹 애플리케이션은 업로드 이미지 URL을 별도 Flask 예측 API로 전달하는 구조이며, 프로젝트 저장소에는 `road_scanner.h5` 모델 파일이 포함돼 있다.

## 주요 기능

- 회원가입, 로그인, 아이디·비밀번호 찾기, 마이페이지와 회원 탈퇴
- 교통표지판 이미지 업로드와 인식 결과 조회
- 인식 결과에 대한 피드백 수집과 전체·월별 통계 시각화
- 이미지 데이터 목록, 선택 상태 변경과 삭제를 포함한 관리 화면
- 질문 작성·조회·수정·삭제, 검색, 페이지네이션, 공지와 답변 관리
- 관리자용 회원, 게시물과 이미지 데이터 관리 화면

## 구현 과정

2023년 7월 말 Q&A 데이터 구조와 CRUD 기반을 구성한 뒤, 8월에는 Q&A 전용 JSP 화면과 컨트롤러를 연결했다. 이후 검색, 페이지네이션, 공지 분리, 첨부 이미지 검증과 공통 레이아웃을 순차적으로 다듬었다.

8월 말에는 로그인과 파일 업로드 기능을 main 구조에 통합하고 JSP, JavaScript와 CSS 화면을 정리했다. 업로드·이미지 관리·회원 서비스와 전체 화면 구조를 함께 연결하며 기능 간 흐름을 완성했다.

## 현재 상태

RoadScanner는 2023년 8월에 완료한 팀 프로젝트다. 소스 코드는 공개 GitHub 저장소에서 확인할 수 있으며, 현재 동작하는 별도 배포 URL은 없다.
