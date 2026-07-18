# Phase 4C-5 RoadScanner 공개 전환 검증

- 검증일: 2026-07-18
- 브랜치: `redesign/astro-v0`
- 기준 HEAD: `e540fc42c8c46b38fbe800eb73968d692bc6a743`
- 기준 Ubuntu CI: `Check Astro foundation` run `29643054809` 성공
- 검증 대상: production build와 `http://127.0.0.1:4322`

## 1. 공개 승인 근거

Owner가 RoadScanner 콘텐츠, UI, 로고, Cover, 피드백 통계, 비식별화된 Q&A와 Upload 화면의 포트폴리오 공개를 최종 승인했다. 승인 범위에는 기존 WebP 네 장과 현재 본문이 포함되며, 영상과 별도 demo URL은 포함되지 않는다.

## 2. 변경한 frontmatter

`src/content/projects/roadscanner.md`에서 다음 한 항목만 변경했다.

```yaml
draft: false
```

## 3. 유지한 frontmatter

다음 값과 나머지 콘텐츠는 변경하지 않았다.

- `featured: false`
- `sourceStatus: verified`
- `status: completed`
- `title`, `description`, `tags`
- `startedAt`, `completedAt`
- `stack`, `roles`, `repositoryUrl`, `highlights`
- `cover`, `gallery`, 본문

## 4. 홈 query 동작

`src/pages/index.astro`는 프로젝트에 `getFeaturedEntries`를 사용하지 않는다. Development Projects는 개발 환경에서는 두 프로젝트 전체를 `sortEntries`로 정렬하고, production에서는 `getPublishedEntries('projects')`로 공개 기준을 통과한 프로젝트 전체를 가져온다.

따라서 RoadScanner는 `draft: false`, `sourceStatus: verified`와 나머지 publication gate를 통과해 production 홈에 노출된다.

## 5. `featured: false` 영향

현재 홈 프로젝트 query는 `featured`를 검사하지 않으므로 `featured: false`는 RoadScanner의 홈 노출을 막지 않는다. 이번 단계에서는 이 필터 동작을 수정하지 않았다.

## 6. 프로젝트 목록 노출

`src/pages/projects/index.astro`는 production에서 `getPublishedEntries('projects')`를 사용한다. RoadScanner 카드 한 장이 표시되고 Local Draft Preview 안내와 Draft Preview badge는 표시되지 않는다.

카드에서 제목, 설명, 완료 상태, 7개 stack, Cover와 `/projects/roadscanner/` 링크가 정상적으로 확인됐다. Grid는 320·390에서 1열, 768에서 2열, 1024·1440에서 3열 규칙을 사용한다.

## 7. 상세 route 생성 결과

`src/pages/projects/[...id].astro`의 `getStaticPaths`는 production에서 `getPublishedEntries('projects')`를 사용한다. Build 결과 `dist/projects/roadscanner/index.html`이 생성됐고 production preview에서 HTTP 200으로 응답했다.

기존 첫 프로젝트는 계속 draft이므로 `dist/projects/cheezcyj-portfolio-redesign/index.html`이 생성되지 않았다.

## 8. 카드 순서

Production의 published project는 RoadScanner 한 개이므로 홈과 `/projects/`에서 첫 번째이자 유일한 카드다.

개발 환경에서 전체 프로젝트를 표시할 때는 `order`가 없는 항목을 관련 날짜 내림차순으로 정렬한다. 2026-07-15에 시작한 CHEEZCYJ Portfolio Redesign이 먼저이고, 2023-08-29에 완료한 RoadScanner가 두 번째다.

## 9. Cover 결과

- 경로: `/images/projects/roadscanner/cover.webp`
- 파일 크기: 60,130 B
- dimensions: 800×386
- SHA-256: `a4618076eaaceb1744d60638573879fa89644874a4bc69590df48dfdab3c321a`
- alt: 차량과 전방 감지 카메라 그래픽 위에 RoadScanner 로고가 표시된 시작 화면
- 5개 viewport에서 `naturalWidth: 800`, `naturalHeight: 386`, broken 0

Cover production 파일의 픽셀 비율은 유지된다. 카드와 상세 Cover 영역은 기존 16:9 `object-fit: cover` UI를 사용한다.

## 10. Gallery 결과

다음 순서로 세 장이 연결됐다.

1. `/images/projects/roadscanner/feedback-statistics.webp` — 1920×964
2. `/images/projects/roadscanner/qna-list.webp` — 1920×964
3. `/images/projects/roadscanner/upload-entry.webp` — 1920×964

모든 viewport에서 끝까지 스크롤한 뒤 세 이미지의 로드 완료, 자연 크기 1920×964, 렌더링 비율 약 1.992와 alt를 확인했다. Gallery는 `object-fit: contain`이며 깨진 이미지가 없다.

## 11. Desktop 검수

1024×768과 1440×900에서 다음을 확인했다.

- 홈과 프로젝트 목록에 RoadScanner 카드 표시
- Draft Preview 문구 없음
- 프로젝트 목록 3열 grid 규칙
- 상세 h1, 설명, Cover, 상태, 기간, 역할, stack과 highlights 표시
- Gallery 첫 이미지는 전체 폭, 나머지 두 이미지는 2열 배치
- 헤더, breadcrumb, 목록 복귀 링크와 footer 표시
- document 가로 overflow 없음

## 12. Mobile 검수

320×844과 390×844에서 다음을 확인했다.

- 프로젝트 목록 1열
- 제목과 설명의 줄바꿈 정상
- Cover 로드 및 카드 링크 정상
- 상세 상태, 기간, 역할과 stack의 세로 배치 정상
- Gallery 세 장의 세로 배치 정상
- 헤더와 모바일 navigation 구조 유지
- document 가로 overflow 없음

320px에서는 rail viewport에 브라우저 scrollbar 폭과 같은 15px의 내부 수평 여유가 계산된다. Arrow control은 모바일 CSS에서 `display: none`이고 document overflow는 없으며, 390px 이상에서는 rail overflow가 없다. Published 카드가 한 장이므로 다음 카드 일부 노출 affordance는 적용 대상이 아니다.

## 13. 외부 링크 검수

- href: `https://github.com/cheezcyj/RoadScanner`
- `target="_blank"`
- `rel="noreferrer"`
- `tabIndex: 0`으로 키보드 접근 가능
- 링크 텍스트가 비어 있지 않음
- demo URL과 Live Demo 링크 없음

## 14. 개인정보 재검수

RoadScanner 본문, 카드와 미디어 경로에서 다음 항목은 0건이다.

- localhost
- Bandicam
- `98%`와 검증되지 않은 성능 수치
- 인증번호와 관리자 계정 정보
- revision-2와 media-review 경로
- `C:\Users\user`와 로컬 절대 경로
- Draft Preview

검토 JPEG와 source 문서는 dist에 포함되지 않았다. Owner가 승인한 Q&A 화면은 비식별화된 production WebP다.

사이트 공통 footer에는 이번 RoadScanner 콘텐츠와 무관한 기존 공개 연락처 `mailto:cheezmicro@gmail.com`이 모든 HTML 페이지에 한 번씩 출력된다. 이번 단계의 허용 범위가 `roadscanner.md`의 draft 변경으로 제한돼 있어 수정하지 않았으며 push 전 Owner 확인 사항으로 남긴다.

## 15. Console 결과

5개 viewport와 홈, 프로젝트 목록, RoadScanner 상세 페이지를 순회한 결과 Console error 0, warning 0이다.

## 16. 반응형 결과

실제 `window.innerWidth`와 `innerHeight`를 다음 값으로 맞춰 검수했다.

- 320×844
- 390×844
- 768×1024
- 1024×768
- 1440×900

모든 조합에서 document 가로 overflow 0, broken image 0, 빈 alt 0이다. 목록 grid는 1/1/2/3/3열로 계산됐다.

## 17. SEO 결과

- document title: `RoadScanner — CHOE YOOJEONG`
- meta description: RoadScanner frontmatter description과 일치
- canonical: `https://cheezcyj.github.io/projects/roadscanner/`
- Open Graph title: `RoadScanner — CHOE YOOJEONG`
- Open Graph description: frontmatter description과 일치
- Open Graph URL: canonical과 일치
- h1: `RoadScanner` 한 개
- robots meta: 없음
- draft preview 전용 metadata: 없음
- Open Graph image: 현재 공통 SEO 구조에 구현되지 않아 없음

새 SEO 필드는 추가하지 않았다.

## 18. `verify:content` 결과

성공했다.

- Content entries scanned: 2
- Published entries: 1
- Duplicate collection IDs: 0
- Duplicate public URL candidates: 0
- Duplicate legacy URLs: 0
- Placeholder publication violations: 0
- Date errors: 0

RoadScanner만 published이고 기존 첫 프로젝트는 draft를 유지한다.

## 19. `verify:media` 결과

성공했다.

- Approved projects: 2
- Approved WebP files: 8
- Missing files: 0
- Invalid MIME types: 0
- Dimension mismatches: 0
- Duplicate hashes: 0
- Local source mappings skipped: 0
- Frontmatter media mismatches: 0
- Unapproved sample files: 0

## 20. `verify:assets` 결과

성공했다.

- Legacy assets verified: 9
- Source/public SHA-256 matches: 9
- v0 reference assets excluded: 17
- Duplicate public URLs: 0
- Case-insensitive public path collisions: 0

## 21. Build 결과

`pnpm build`가 성공했고 총 7개의 정적 페이지가 생성됐다. 기존 6개 페이지에 `/projects/roadscanner/` 상세 route 한 개가 추가됐다.

Build 과정에서 비어 있는 `design`, `study`, `posts` 컬렉션 경고가 출력됐지만 실패가 아니며 기존 foundation 상태와 같다.

## 22. Dist 직접 검사

다음 파일이 모두 존재한다.

- `dist/index.html`
- `dist/projects/index.html`
- `dist/projects/roadscanner/index.html`
- `dist/images/projects/roadscanner/cover.webp`
- `dist/images/projects/roadscanner/feedback-statistics.webp`
- `dist/images/projects/roadscanner/qna-list.webp`
- `dist/images/projects/roadscanner/upload-entry.webp`

홈과 목록에는 RoadScanner 상세 링크가 각각 네 번 포함되고 RoadScanner 카드는 한 장이다. 상세 HTML에는 제목, 설명, repository URL, Cover와 Gallery 경로가 포함된다.

Dist 전체 HTML·JavaScript 검사 결과 Draft Preview, localhost, Bandicam, `98%`, revision-2, media-review, 인증번호, 관리자 계정, 로컬 사용자 경로와 영문 placeholder 문자열은 0건이다. Source map도 생성되지 않았다. 공통 footer의 기존 공개 연락처 이메일은 별도 확인 사항이다.

## 23. 기존 프로젝트 보존

CHEEZCYJ Portfolio Redesign 콘텐츠와 WebP는 수정하지 않았다. 기존 WebP SHA-256은 다음과 같이 유지됐다.

- `cover.webp`: `5c22317a49eb91e37a76a019d10b323a218bf8d595fb2dd3f31f4bda57397108`
- `mobile-navigation.webp`: `0dafad15070cb6c4aa86565e09db07a36d5f922b1f8ad5c52d22c23601569f5b`
- `project-detail-mobile.webp`: `3b5e031d215b652ba9d41d88c124d3e3ad82c3f452cdc2b8f44caac355e88432`
- `project-rail-desktop.webp`: `35a88b0c404991e02e78279b1e80f96cd42e66fa602a42489d5cdd59a9579e85`

기존 프로젝트 상세 route는 production에 생성되지 않았다.

## 24. 알려진 경고

- `design`, `study`, `posts` 컬렉션이 비어 있다는 기존 build 경고
- 이전 Ubuntu CI의 `pnpm/action-setup@v4` 내부 Node.js 20 사용 중단 annotation: workflow 실패가 아닌 후속 유지보수 항목
- 320px rail viewport 내부의 사용자에게 표시되지 않는 15px 수평 여유
- 모든 페이지 공통 footer의 기존 공개 연락처 이메일

이번 공개 전환에서 workflow, rail, footer와 다른 콘텐츠는 변경하지 않았다.

## 25. Push 전 Owner 확인 사항

- RoadScanner `draft: false`, `featured: false` 최종 확인
- 홈과 목록에서 RoadScanner가 유일한 production 카드인 현재 동작 확인
- 공통 footer의 공개 연락처 이메일 유지 여부 확인
- 320px rail 내부 15px 수평 여유를 후속 UI 단계에서 정리할지 확인
- Open Graph image가 현재 미구현 상태인 점 확인
- 로컬 커밋 검토 후 별도 지시에 따라 branch push와 Ubuntu CI 실행

이번 단계에서는 push, PR, merge, main 변경과 Pages 배포를 수행하지 않았다.
