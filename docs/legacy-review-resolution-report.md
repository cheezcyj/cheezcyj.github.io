# 잔여 Jekyll REVIEW 처리 보고서

- 작성일: 2026-07-19
- 작업 브랜치: `redesign/astro-v0`
- 원격 rollback 브랜치: `origin/legacy-jekyll`
- rollback SHA: `63b397e42164bac6d50149c14b7901da5a67e42d`

## 1. REVIEW 파일 2개

Jekyll runtime 51개 제거 뒤 `_includes/modals.html`과 root `feed.xml`을 보존 가치 또는 URL 대체 미완료 사유로 REVIEW 상태에 두었다. 이번 단계에서는 두 파일의 정보를 Astro 구조에 옮기고 검증을 통과한 뒤 현재 브랜치에서 제거했다.

## 2. `_includes/modals.html` 처리

원격 rollback Git object에서 이어드림 menu link를 추출했다. 원본 식별값은 다음과 같다.

- Git blob SHA: `bb232b80eeb02ca9b6017da9fd954fd4c25c1d9c`
- 원본 byte 크기: 15,664
- SHA-256: `c34ddf32262b1e92f8dfad8998ec35c4011554ae38488bd7cc312570950263cd`

원본 항목은 정확히 46개다. week 8개, topic 10개, item 28개이며 `커리큘럼`과 `AI실무기본` 그룹에 각각 23개가 있다. 빈 제목, 빈 `data-week`, 제목 불일치와 중복은 0개다. 연결된 실제 학습 본문은 없다.

## 3. Study inventory

비공개 entry는 `src/content/study/yeardream-school-6-inventory.md`에 생성했다. 정확한 기계 판독 기준은 `docs/legacy-study-inventory.json`에 보존한다.

- canonical collection ID: `yeardream-school-6-inventory`
- `draft: true`
- `featured: false`
- `sourceStatus: inventory-only`
- `contentStatus: inventory-only`
- `sequence: 0`
- 실제 학습일, cover, 완료 상태와 성과: 없음

`pnpm verify:study-inventory`는 manifest source hash와 46개 항목의 순서·종류·부모·제목·원본 속성을 검증한다. CI에서는 tracked manifest와 Markdown을 비교하고, 로컬에 rollback ref가 있으면 원본 Git object까지 추가 비교한다. 세 publication gate로 인해 공개 query와 production route에는 포함되지 않는다.

## 4. 기존 `feed.xml` 상태

root `feed.xml`은 YAML frontmatter와 Liquid를 사용하는 Jekyll Atom 템플릿이었다. `site.posts`에서 최대 10개를 가져오지만 기존 post는 실제 본문이 없는 placeholder였다. 이 파일은 `public`에 없고 Astro endpoint도 아니어서 현재 Astro artifact에는 포함되지 않았다.

## 5. Astro RSS 구현

공식 `@astrojs/rss` 4.0.19를 사용해 `src/pages/feed.xml.ts` 정적 endpoint를 만들었다. `astro.config.mjs`의 `site`와 기존 canonical project route utility를 사용하며 URL은 계속 `/feed.xml`이다. `BaseLayout.astro`에는 RSS discovery link를 추가했다.

RSS는 `getPublishedEntries('projects')` 결과 중 실제 상세 route와 유효한 날짜가 있는 프로젝트만 사용한다. 날짜 우선순위는 `completedAt`, `startedAt`, `updatedAt`이다.

### 포함 콘텐츠

- RoadScanner 1개
- link: `https://cheezcyj.github.io/projects/roadscanner/`
- pubDate: RoadScanner `completedAt`
- categories: 프로젝트 tags

### 제외 콘텐츠

- draft인 CHEEZCYJ Portfolio Redesign
- inventory-only 이어드림 study entry
- 비어 있는 design과 posts
- 상세 route가 구현되지 않은 다른 콘텐츠 유형
- legacy placeholder

## 6. RSS 검증

`pnpm verify:feed`는 `fast-xml-parser` 5.10.1로 build 후 `dist/feed.xml`을 파싱한다.

- RSS 2.0과 XML 문법
- channel title, description, `ko-KR`, production site URL
- RoadScanner title, description, link, pubDate와 categories
- RSS item link와 생성된 project detail route 집합의 일치
- draft·inventory·Jekyll Liquid·placeholder·localhost·로컬 절대 경로 0
- 중복 item link 0
- build HTML의 RSS discovery link

검증 결과 item은 1개이며 project detail route 1개와 일치했다.

## 7. 제거한 REVIEW 파일

다음 대체 조건을 모두 확인한 뒤 현재 브랜치에서 제거했다.

- `_includes/modals.html`
- `feed.xml`

원본은 `origin/legacy-jekyll`에 그대로 보존돼 있다. 현재 tracked tree의 Jekyll runtime과 REVIEW 파일은 0개다.

## 8. 전체 검증 결과

- content entries: 3
- published entries: 1
- study inventory: 46개, 누락·중복 0
- approved projects: 2
- WebP: 8
- legacy assets: 9
- Astro check: 오류·경고·힌트 0
- build: HTML 페이지 7개와 `/feed.xml` 생성
- RoadScanner detail route: 생성
- draft project와 study inventory detail route: 미생성

## 9. Workflow와 배포

`Check Astro foundation`과 `Deploy Astro site to Pages` build job에 `verify:study-inventory`와 build 후 `verify:feed`를 추가했다. Pages deploy 조건은 계속 `main` push로 제한되며 trigger와 권한은 변경하지 않았다. feature branch와 Draft PR에서는 build만 검증하고 실제 Pages 배포는 하지 않는다.

## 10. Rollback 방식

병합 전에는 `origin/legacy-jekyll`이 고정 rollback SHA를 가리키는지 확인한다. 병합 후 문제가 생기면 main을 강제 reset하지 않고 마이그레이션 squash commit을 revert한다. Jekyll 원본 자체가 필요하면 rollback 브랜치에서 별도 복구 branch를 만든다.

## 11. 최종 merge readiness 영향

잔여 REVIEW 두 파일은 대체와 검증을 완료해 merge blocker에서 해소할 수 있다. PR은 계속 Draft로 유지하며 다음 항목은 Owner 승인 전 완료 처리하지 않는다.

- 전체 Files changed 최종 검토
- Owner merge 승인
