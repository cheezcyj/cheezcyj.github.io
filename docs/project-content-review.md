# 첫 프로젝트 콘텐츠 Owner 검토

작성일: 2026-07-16
대상 브랜치: `redesign/astro-v0`
공개 상태: 비공개 초안

## 1. 생성한 entry 경로

`src/content/projects/cheezcyj-portfolio-redesign.md`

canonical collection ID는 `cheezcyj-portfolio-redesign`이다. 별도의 `slug` frontmatter는 사용하지 않는다.

## 2. 현재 frontmatter 전체

```yaml
title: 'CHEEZCYJ Portfolio Redesign'
description: '기존 Jekyll 포트폴리오를 Astro 기반의 정적 포트폴리오 및 학습 아카이브로 전환하는 프로젝트입니다.'
draft: true
featured: false
tags:
  - Astro
  - TypeScript
  - Tailwind CSS
  - GitHub Pages
sourceStatus: inventory-only
status: in-progress
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
  - 기존 Jekyll PNG 9개의 공개 URL과 SHA-256 무결성 보존
  - design, projects, study, posts 타입 기반 Content Collections 설계
  - draft와 sourceStatus를 필수로 하는 공개 차단 정책 구성
  - focus trap과 Escape 종료를 포함한 접근 가능한 모바일 내비게이션 구현
  - 자산 및 콘텐츠 자동 검증 스크립트 구성
```

의도적으로 제외한 필드는 `cover`, `gallery`, `demoUrl`, `startedAt`, `completedAt`, `legacyUrls`다.

## 3. 저장소에서 직접 확인한 사실

- Git remote는 `https://github.com/cheezcyj/cheezcyj.github.io.git`이다.
- 현재 구현 브랜치는 `redesign/astro-v0`이며 `main`과 `legacy-jekyll`은 기존 Jekyll 기준 revision을 가리킨다.
- `package.json`에는 Astro 7, TypeScript, Tailwind CSS 4, pnpm과 Node 24 조건이 명시되어 있다.
- `astro.config.mjs`는 `site: https://cheezcyj.github.io`, `output: static`으로 설정되어 있다.
- `BaseLayout`, `SiteHeader`, `SiteFooter`, `Hero`, `SectionHeading`, `SkipToContent`, `CursorSpotlight`가 존재한다.
- 모바일 메뉴 스크립트에는 focus trap, Escape 종료, 초점 복귀, inert와 body scroll lock 처리가 있다.
- cursor spotlight는 fine pointer와 reduced-motion 조건을 검사한다.
- `design`, `projects`, `study`, `posts` Content Collections와 중앙 공개 query가 존재한다.
- asset/content 검증 스크립트와 format, check, build 명령이 존재한다.
- 이 초안 작성 전 실제 Markdown/MDX content entry는 0개였다.

## 4. 문서에서 확인한 사실

- 기존 사이트는 Jekyll Freelancer 테마와 Bootstrap, jQuery, 모달 중심 구조를 사용한다.
- 기존 Jekyll post 6개는 본문이 없고 템플릿 예시 메타데이터를 공유한다.
- 임시 Jekyll build에서 post permalink 때문에 `/index.html` 출력 충돌이 확인됐다.
- 이어드림 46개 항목은 목차 정보만 있으며 저장소 안에 학습 본문이 없다.
- v0 원본은 Next.js와 React 기반이며 작품 이미지와 프로젝트 데이터는 샘플로 분류됐다.
- 기존 PNG 9개는 같은 URL로 보존됐고 원본/public SHA-256 일치 검증이 구성됐다.
- v0 참조 이미지 17개는 Astro public에 복사되지 않았다.
- Windows 로컬 검증은 통과했지만 Linux 원격 CI는 아직 실행되지 않았다.

## 5. 추측하지 않고 생략한 정보

- 프로젝트의 정확한 시작일과 완료일
- 성능 개선 수치와 Lighthouse 점수
- 방문자 또는 사용자 수
- 수상 내역
- 실제 운영·디자인 성과 수치
- Astro 버전의 배포 완료 결과
- 존재하지 않거나 검증되지 않은 demo URL
- 승인된 cover와 gallery 이미지

## 6. Owner가 확인해야 하는 문장

- 프로젝트 제목에 `CHEEZCYJ`를 사용하는 것이 최종 브랜드 표기와 일치하는가?
- 한 줄 설명이 프로젝트의 실제 범위를 정확히 나타내는가?
- 기존 Jekyll 콘텐츠와 URL 문제에 대한 설명이 사실관계와 의도에 맞는가?
- v0의 시각적 분위기를 Astro로 전환했다는 설명 범위가 적절한가?
- 현재 상태와 향후 작업이 실제 공개 계획과 일치하는가?
- 배운 점의 기술적 판단이 소유자의 실제 경험을 정확히 반영하는가?

## 7. 역할 표현 검토 항목

- `Web Design`, `Web Publishing`, `Frontend Development`, `Content Architecture`를 모두 공개 역할로 표시해도 되는가?
- 사이트 개편 방향, 콘텐츠 구조와 공개 정책 결정이 소유자의 실제 역할을 정확히 설명하는가?
- 반응형 화면과 접근성 검수 역할을 프로젝트 소개에 포함해도 되는가?
- 구현 자동화의 비중을 고려했을 때 각 역할의 표현 강도가 적절한가?

## 8. AI/Codex 작업과 사용자 역할 구분 검토

초안은 사용자의 역할을 요구사항·디자인 방향·콘텐츠 구조·마이그레이션 순서·안전 조건 결정과 결과 검토로 설명한다. Codex는 파일 작성, 코드 구현 보조, 반복 검증과 문서 정리를 수행한 것으로 구분한다.

다음 표현을 owner가 확인해야 한다.

- 자동화 보조가 포함된 구현을 사용자의 단독 수작업처럼 읽히게 하지 않는가?
- 반대로 사용자가 결정한 기획·디자인·기술 정책과 검증 역할이 충분히 드러나는가?
- 공개 포트폴리오에서 AI 보조 사실을 현재 정도로 설명하는 것이 적절한가?

## 9. 시작일 확인 항목

Astro 마이그레이션 분석이 처음 기록된 commit은 2026-07-16의 `5e503bf`다. 그러나 이 날짜가 owner가 정의하는 실제 프로젝트 시작일과 같다고 확정할 수 없어 `startedAt`을 생략했다. 공개 전에 정확한 시작 기준과 날짜를 확인한다.

## 10. 공개 가능한 저장소 URL 확인

로컬 git remote와 frontmatter는 `https://github.com/cheezcyj/cheezcyj.github.io`를 가리킨다. 저장소 링크를 포트폴리오에 공개해도 되는지, 공개 시점에도 이 URL을 유지할지 owner 승인이 필요하다.

## 11. 대표 이미지 준비 항목

- 실제 리디자인 화면을 사용한 cover 후보
- 이미지 사용 권리와 공개 범위
- 최종 파일 경로와 형식
- 의미를 전달하는 한국어 alt
- width와 height 메타데이터
- v0 및 기존 테마 샘플 자산이 아닌지 확인

## 12. 상세 이미지 준비 항목

- 데스크톱과 모바일 화면 중 공개할 장면 선정
- 민감 정보와 개발 도구 UI 노출 여부 확인
- 각 이미지의 설명과 alt
- 순서와 gallery 구성
- 원본 보관 위치 및 최적화 방식

## 13. 공개 가능한 성과와 수치

현재 저장소에는 공개 가능한 성능 개선율, Lighthouse 점수, 사용자 수, 수상 또는 운영 성과를 입증하는 자료가 없다. 수치를 추가하려면 측정 환경, 기준 버전, 측정일과 재현 가능한 결과를 함께 owner가 제공·승인해야 한다.

## 14. 공개 전 frontmatter 변경 조건

- `draft: true` → `draft: false`
- `sourceStatus: inventory-only` → `sourceStatus: verified`
- `featured` 활성화 여부 결정
- 승인된 `cover`와 alt 추가
- 한 줄 설명과 본문 전체 owner 승인
- repository와 향후 demo 등 실제 링크 검증
- 정확한 기준일이 확인되면 `startedAt` 추가
- 프로젝트 카드와 상세 route 구현
- Linux CI 결과 확인

## 검토 체크리스트

- [ ] 프로젝트 제목 승인
- [ ] 한 줄 설명 승인
- [ ] 본문 사실관계 승인
- [ ] 역할 표현 승인
- [ ] AI/Codex와 사용자 역할 구분 승인
- [ ] 시작일 확인
- [ ] 기술 스택 확인
- [ ] 저장소 공개 여부 확인
- [ ] 대표 이미지 승인
- [ ] 상세 이미지 승인
- [ ] 공개 가능한 성과 확인
- [ ] 공개 승인
