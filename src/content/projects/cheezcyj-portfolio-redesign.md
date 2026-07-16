---
title: 'CHEEZCYJ Portfolio Redesign'
description: '기존 Jekyll 포트폴리오를 Astro 기반의 정적 포트폴리오 및 학습 아카이브로 전환하는 프로젝트입니다.'
draft: true
featured: false
tags:
  - Astro
  - TypeScript
  - Tailwind CSS
  - GitHub Pages
sourceStatus: verified
status: in-progress
startedAt: 2026-07-15
stack:
  - Astro
  - TypeScript
  - Tailwind CSS
  - pnpm
roles:
  - Web Design
  - Web Publishing
  - Frontend Development
  - Content Architecture
repositoryUrl: 'https://github.com/cheezcyj/cheezcyj.github.io'
highlights:
  - v0 디자인의 시각 언어를 Astro 정적 컴포넌트와 디자인 토큰으로 전환
  - 기존 Jekyll 자산 9개의 URL과 SHA-256 무결성 보존
  - 네 가지 타입 기반 Content Collections 설계
  - draft와 sourceStatus 기반 콘텐츠 공개 정책 구성
  - 키보드 접근 가능한 모바일 내비게이션 구현
  - 자산 및 콘텐츠 자동 검증 구성
---

# 프로젝트 개요

CHEEZCYJ Portfolio Redesign은 기존 Jekyll 기반 포트폴리오를 Astro 기반의 완전 정적 포트폴리오 및 학습 아카이브로 전환하는 프로젝트다. 디자인 작업, 개발 프로젝트, 학습 기록과 기타 글을 서로 다른 콘텐츠 컬렉션으로 관리하고, GitHub Pages 환경에 맞는 정적 결과물을 만드는 것을 목표로 한다.

현재 개발 중이며 콘텐츠와 상세 화면을 단계적으로 구축하고 있다. Astro 결과물은 아직 GitHub Pages 운영 버전으로 전환되지 않았고 `main` 병합 전이다.

## 배경과 문제

기존 사이트는 Jekyll Freelancer 테마를 바탕으로 Bootstrap, jQuery와 모달 중심의 화면 구조를 사용한다. 저장소 분석 결과 기존 여섯 게시물에는 실제 프로젝트 본문이 없고 동일한 템플릿 예시 정보가 들어 있었다. Jekyll의 post permalink 설정으로 게시물과 홈이 같은 `/index.html`을 생성하는 충돌도 임시 빌드에서 확인됐다.

이어드림 학습 자료는 `_includes/modals.html`의 계층형 목차 정보로 남아 있지만 저장소 안에는 각 항목의 실제 학습 본문이 없다. 따라서 목차를 완성된 학습 기록처럼 공개하지 않고, 원문이 확인된 항목만 이후에 승격하는 정책이 필요했다.

시각 디자인 참고 원본은 Next.js와 React로 만들어진 v0 프로젝트다. 이 원본에는 다크 네이비 배경, 크림색 텍스트와 골드 포인트 같은 시각적 기준뿐 아니라 샘플 프로젝트와 샘플 이미지도 함께 들어 있다. 디자인 구조와 실제 공개 콘텐츠를 구분하고, 검증되지 않은 값이 새 사이트에 노출되지 않도록 별도의 공개 정책을 먼저 설계했다.

## 프로젝트 목표

- Astro 기반의 완전 정적 사이트로 전환
- GitHub Pages에 맞는 출력 구조 유지
- 디자인, 개발 프로젝트, 학습 기록과 기타 글을 독립 컬렉션으로 분리
- v0의 시각적 분위기를 Astro 정적 컴포넌트와 디자인 토큰으로 전환
- 기존 자산 URL과 파일 무결성 보존
- 키보드와 모바일 사용을 고려한 반응형 내비게이션 제공
- 샘플 및 미검증 콘텐츠의 공개 차단
- 단계별 로컬 검증과 분리된 커밋을 통한 안전한 마이그레이션

## 담당 역할

본 프로젝트에서는 사이트 개편 방향과 요구사항을 정의하고, v0 템플릿을 선정해 다크 네이비·크림·골드 중심의 브랜드 색상과 디자인 방향을 조정했다. 디자인, 개발 프로젝트, 학습 기록과 기타 글로 이어지는 정보 구조와 콘텐츠 컬렉션 구조도 설계했다.

Astro 마이그레이션의 범위와 단계를 결정하고, 반응형 화면과 접근성을 검수하며 콘텐츠 공개 정책과 기존 자산 보존 기준을 정했다. 구현 결과를 단계별로 검토해 수정 방향과 최종 적용 여부를 판단했다.

개발 과정에서 Codex는 코드 작성과 반복 검증을 보조했으며, 요구사항·디자인 방향·콘텐츠 구조·마이그레이션 정책과 검증 기준의 결정 및 최종 검수는 사용자가 담당했다.

## 기술 구성

- Astro 7 기반 정적 출력
- TypeScript strict 설정
- Tailwind CSS 4와 Vite 플러그인
- pnpm과 고정된 Node 24 실행 환경
- Astro Content Collections와 Zod 기반 스키마
- 모바일 메뉴와 커서 효과를 위한 Vanilla TypeScript
- 로컬 검증용 GitHub Actions workflow
- 향후 GitHub Pages 전환을 고려한 root site 설정

Next.js와 React는 최종 Astro 구현의 런타임 의존성이 아니라 v0 디자인 참고 원본의 기술이다. 현재 Astro 프로젝트에는 두 기술을 추가하지 않았다.

## 주요 구현

### Astro 디자인 기반

공통 레이아웃과 헤더·푸터, Hero, 섹션 제목, 본문 바로가기와 커서 효과를 Astro 정적 컴포넌트로 구성했다. 색상, 글꼴 fallback, 유동형 타이포그래피, 간격, 컨테이너와 반응형 breakpoint는 역할 중심의 디자인 토큰과 Tailwind CSS 4 테마에 연결했다.

### 접근성과 인터랙션

모바일에서는 전체 화면 메뉴를 제공하고, 메뉴가 열린 동안 본문과 푸터를 inert 처리하며 body scroll을 잠근다. Tab과 Shift+Tab focus trap, Escape 종료, 닫은 뒤 메뉴 버튼으로 초점 복귀를 구현했다. 전환은 reduced-motion 설정을 따르며, cursor spotlight는 fine pointer이면서 reduced-motion이 아닌 환경에서만 초기화된다.

### 콘텐츠 구조

`design`, `projects`, `study`, `posts` 네 컬렉션을 Astro Content Collections로 정의했다. 공통 메타데이터와 컬렉션별 필드를 타입으로 검증하고, 공개 페이지는 중앙화된 query 유틸리티를 통해 공개 기준을 통과한 항목만 가져온다.

### 공개 안전장치

모든 콘텐츠는 `draft`와 `sourceStatus`를 명시해야 한다. 공개 후보는 `draft: false`와 `sourceStatus: verified`를 모두 만족해야 하며, 학습 기록은 추가로 `contentStatus: complete`가 필요하다. 템플릿 문구, 샘플 이미지와 잘못된 링크를 차단하고 canonical ID는 frontmatter의 별도 slug가 아니라 컬렉션 내부 파일 경로로 계산한다. 프로젝트 상태와 시작일·완료일 사이의 논리도 스키마와 검증 스크립트에서 확인한다.

### 자산 보존

기존 Jekyll PNG 9개는 원본을 유지한 채 같은 공개 URL로 `public`에 복사했다. 자산 검증기는 원본과 public 복사본의 SHA-256, 크기, MIME type과 이미지 크기를 비교하며, 정적 빌드 결과에도 같은 경로가 생성되는지 확인했다. v0 샘플 자산은 manifest에 기록하되 Astro 공개 폴더로 복사되지 않도록 검증한다.

### 자동 검증

현재 저장소에서 실행하는 검증 명령은 다음과 같다.

- `pnpm format:check`
- `pnpm check`
- `pnpm verify:assets`
- `pnpm verify:content`
- `pnpm build`

## 마이그레이션 안전장치

구현은 `main`이 아니라 `redesign/astro-v0` 브랜치에서 진행한다. 기존 운영 상태는 `legacy-jekyll` 브랜치로 보존하고, Jekyll 파일은 Astro build와 URL 호환 검증이 끝날 때까지 삭제하지 않는다. 각 단계는 로컬 검증을 통과한 뒤 기능별 커밋으로 나누며, 원격 배포 전에 기존 자산 원본과 공개 복사본의 무결성을 다시 확인한다.

Ubuntu 기반 GitHub Actions 검증 workflow는 준비되어 있지만 아직 원격 push나 PR을 실행하지 않았으므로 Linux CI 성공으로 간주하지 않는다.

## 현재 상태

- 현재 개발 중
- 콘텐츠와 상세 화면을 단계적으로 구축 중
- 프로젝트 카드와 상세 페이지 구현 전
- SEO, feed와 legacy route 호환 작업 전
- GitHub Pages 배포 workflow 전환 전
- `main` 병합 전
- 배포 완료 프로젝트가 아님

## 향후 작업

- 대표 이미지와 상세 이미지 준비 및 최종 공개 조건 검토
- 프로젝트 카드와 상세 페이지 구현
- 디자인 포트폴리오 콘텐츠 등록
- 이어드림 학습 기록의 원문 확인과 구조화
- 기타 글 등록
- SEO, feed와 legacy route 호환
- GitHub Pages 배포 workflow 전환
- 검증 완료 후 기존 Jekyll 런타임 제거
- Linux CI 실행과 결과 확인

## 배운 점

- 디자인 이전은 참고 프레임워크의 코드를 그대로 복사하는 작업이 아니라 시각 규칙과 상호작용 의도를 목표 구조에 맞게 다시 구현하는 과정이다.
- 콘텐츠 공개 정책을 카드나 상세 UI보다 먼저 정의하면 샘플 데이터와 미검증 자료가 실콘텐츠처럼 노출되는 위험을 줄일 수 있다.
- 정적 사이트 마이그레이션에서도 기존 URL과 자산 바이트의 보존 여부를 독립적으로 검증해야 한다.
- 접근성과 반응형 동작은 화면 완성 이후의 보정이 아니라 레이아웃과 내비게이션 기반을 만들 때부터 포함해야 한다.
- 단계별 브랜치와 검증 gate는 운영 중인 기존 사이트의 파일을 조기에 변경하거나 삭제할 위험을 줄인다.
