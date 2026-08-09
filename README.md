# CHOE YOOJEONG Portfolio

[cheezcyj.github.io](https://cheezcyj.github.io)는 2D/3D 디자인, 웹퍼블리싱, 풀스택 개발 프로젝트와 배움·경험을 기록하는 정적 포트폴리오 아카이브입니다.

기존 Jekyll 사이트를 Astro 7 기반으로 전환했으며, 반응형 화면과 프로젝트 아카이브를 운영합니다.

## 주요 구성

- 데스크톱·모바일 공통 내비게이션과 접근성 보정
- 프로젝트 카드, 수평 레일과 정적 상세 페이지
- Content Collections 기반 콘텐츠 관리

## 기술 스택

- Astro 7 정적 출력
- TypeScript strict
- Tailwind CSS 4
- Astro Content Collections
- pnpm과 Node 24

## 공개 프로젝트

### RoadScanner

도로 장면에서 교통표지판 후보를 검출하고 GTSRB 43종을 분류하는 8인 팀 웹 프로젝트입니다. 이미지 분석, 결과 피드백과 통계, 공개 Q&A, 비공개 문의, 회원·관리자 기능을 제공합니다.

- [프로젝트 상세](https://cheezcyj.github.io/projects/roadscanner/)
- [공개 저장소](https://github.com/cheezcyj/RoadScanner)

## 로컬 실행

`.node-version`에 기록된 Node 버전과 `package.json`의 pnpm 버전을 사용합니다.

```shell
pnpm install --frozen-lockfile
pnpm dev
```

production 결과물은 `dist`에 생성됩니다.

```shell
pnpm build
pnpm preview
```

## 콘텐츠

콘텐츠는 `src/content` 아래 네 컬렉션에 둡니다.

- `design`
- `projects`
- `study`
- `posts`
