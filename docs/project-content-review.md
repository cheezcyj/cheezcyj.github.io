# 첫 프로젝트 콘텐츠 Owner 검토

작성일: 2026-07-16
대상 브랜치: `redesign/astro-v0`
공개 상태: 사실관계 Owner 승인 완료, `draft: true` 유지

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
```

의도적으로 제외한 필드는 `cover`, `gallery`, `demoUrl`, `completedAt`, `legacyUrls`, `slug`다. `draft: true`와 `featured: false`는 공개 보류 상태로 유지한다.

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

- 프로젝트 완료일
- 성능 개선 수치와 Lighthouse 점수
- 방문자 또는 사용자 수
- 수상 내역
- 실제 운영·디자인 성과 수치
- Astro 버전의 배포 완료 결과
- 존재하지 않거나 검증되지 않은 demo URL
- 승인된 cover와 gallery 이미지

## 6. Owner 승인 문장

- 프로젝트 제목 `CHEEZCYJ Portfolio Redesign`을 승인했다.
- 한 줄 설명과 본문 사실관계를 승인했다.
- 기존 Jekyll 콘텐츠와 URL 문제에 대한 설명을 승인했다.
- v0의 시각적 분위기를 Astro로 전환했다는 설명 범위를 승인했다.
- 현재 상태와 향후 작업에 사용한 공개용 문구를 승인했다.
- 배운 점에 정리한 기술적 판단을 승인했다.

## 7. 역할 표현 승인 항목

- `Web Design`, `Web Publishing`, `Frontend Development`, `Content Architecture` 공개 역할을 승인했다.
- 사이트 개편 방향, 요구사항, v0 템플릿 선정과 디자인 방향 조정 역할을 승인했다.
- 브랜드 색상, 정보 구조와 콘텐츠 컬렉션 구조 결정 역할을 승인했다.
- Astro 마이그레이션 범위와 단계, 공개 정책과 자산 보존 기준 결정 역할을 승인했다.
- 반응형 화면과 접근성 검수, 구현 결과 검토와 수정 방향 결정 역할을 승인했다.

## 8. AI/Codex 작업과 사용자 역할 구분 검토

사용자가 요구사항, 디자인 방향, 콘텐츠 구조, 마이그레이션 정책과 검증 기준을 결정하고 최종 검수를 담당했다는 표현을 승인했다. Codex는 코드 작성과 반복 검증을 보조한 것으로 한 번만 간결하게 설명한다. 자동화 보조를 사용자의 단독 수작업으로 표현하지 않으면서 기획·디자인·기술 의사결정이 중심에 오도록 정리한 문장을 승인했다.

## 9. 시작일 확인 항목

v0 메인 디자인 작업을 포함한 전체 리디자인 작업의 시작 기준으로 `2026-07-15`를 승인했다. frontmatter에 `startedAt: 2026-07-15`를 반영했다.

## 10. 공개 가능한 저장소 URL 확인

로컬 git remote와 frontmatter가 가리키는 `https://github.com/cheezcyj/cheezcyj.github.io`를 공개 가능한 저장소 URL로 승인했다.

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

승인 반영 완료:

- `sourceStatus: inventory-only` → `sourceStatus: verified`
- `startedAt: 2026-07-15` 추가
- 프로젝트 제목, 한 줄 설명과 본문 사실관계 승인
- 역할과 AI/Codex 구분 표현 승인
- 기술 스택과 repository URL 승인

공개 전 남은 조건:

- `draft: true` → `draft: false`
- `featured` 활성화 여부 결정
- 승인된 `cover`와 alt 추가
- 승인된 `gallery`와 각 alt 추가
- 향후 demo 등 추가 링크가 생기면 실제 목적지 검증
- Linux CI 결과 확인
- GitHub Pages 배포와 최종 공개 승인

## 15. Phase 4B-2 UI 구현 상태

- [x] v0 기반 프로젝트 카드 구현
- [x] 홈 수평 레일 구현
- [x] 반응형 프로젝트 목록 grid 구현
- [x] collection-relative ID 기반 상세 route 구현
- [x] 개발 환경 전용 draft 카드·상세 미리보기 구현
- [x] draft 상세 `noindex, nofollow` 적용
- [x] 실제 이미지가 없을 때 neutral media fallback 적용
- [x] cover와 gallery 요구사항 문서화

production에서는 기존 `getPublishedEntries('projects')`를 그대로 사용하므로 `draft: true`인 현재 프로젝트가 홈과 목록 HTML 또는 상세 route에 포함되지 않는다. 상세 route와 미리보기 UI 구현은 콘텐츠 공개 승인을 의미하지 않는다.

## 검토 체크리스트

- [x] 프로젝트 제목 승인
- [x] 한 줄 설명 승인
- [x] 본문 사실관계 승인
- [x] 역할 표현 승인
- [x] AI/Codex와 사용자 역할 구분 승인
- [x] 시작일 확인
- [x] 기술 스택 확인
- [x] 저장소 공개 여부 확인
- [x] `sourceStatus: verified` 전환 승인
- [ ] 대표 이미지 승인
- [ ] 상세 이미지 승인
- [x] media 요구사항 문서화
- [ ] 공개 가능한 성과 확인
- [ ] `featured` 여부 결정
- [ ] `draft` 해제
- [ ] Linux CI 확인
- [x] 프로젝트 카드 구현
- [x] 상세 route 구현
- [x] dev-only draft 미리보기 구현
- [ ] GitHub Pages 배포
- [ ] 최종 공개 승인
