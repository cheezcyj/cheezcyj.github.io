# 공개 저장소 정보 위생 검사 보고서

- 작성일: 2026-07-19
- 대상 브랜치: `redesign/astro-v0`
- 대상 PR: `main` ← `redesign/astro-v0`, Draft PR #1
- 범위: 현재 Git 추적 트리, PR 본문, 제한적 Git 이력

## 1. 감사 범위와 원칙

감사 시작 시 추적 파일 180개를 대상으로 로컬 환경 경로, 임시 경로, 로컬 서비스 문자열, 이메일, 전화번호와 자격증명 후보를 검사했다. 구성은 일반 텍스트 파일 129개, 바이너리 46개, 1바이트 `.gitkeep` 5개다. 이 보고서를 포함한 정리 후 추적 파일은 181개다.

바이너리를 텍스트로 검색하지 않았으며, 이미지의 개인정보와 비식별화 상태는 기존 미디어 검수와 `verify:media` 결과를 사용한다. 이번 단계에서는 문서를 삭제하거나 Git 이력을 재작성하지 않고 현재 트리만 정리했다.

## 2. 발견 및 정리 결과

초기 트리에는 Windows 사용자 홈 기반 절대 경로가 8개 파일에 118건 있었다.

- Markdown: 10건
- JSON과 CSV 검토 산출물: 108건
- 원본 인벤토리 JSON: 47건
- 원본 인벤토리 CSV: 43건
- 비식별화 manifest JSON: 18건

현재 트리에서는 사용자 홈 경로, 로컬 작업공간 폴더명, 외부 원본 폴더명과 컨테이너 임시 경로 패턴이 모두 0건이다. 문서의 경로는 저장소 상대 경로 또는 `<workspace>`, `<external-media-source>/roadscanner` 같은 표시용 토큰으로 바꿨다.

## 3. Markdown 정리

기존 Markdown 10개를 수정했다.

- RoadScanner 조사·Owner 검토·비식별화·production·공개 보고서의 사용자별 경로를 일반 토큰이나 저장소 상대 경로로 변경
- 로컬 검색 위치를 사용자별 폴더명 대신 역할 기반 토큰으로 변경
- v0 템플릿의 제3자 연락처 문자열을 일반적인 템플릿 연락처 설명으로 변경
- 승인된 공개 연락처 `cheezmicro@gmail.com`은 유지

이 보고서 1개를 추가했으며 기존 문서는 삭제하지 않았다.

## 4. JSON과 CSV 정리

JSON 2개와 CSV 1개를 정리했다.

- `inventory.json`: 외부 원본 루트는 표시용 토큰으로, 출력 위치와 contact sheet는 저장소 상대 경로로 변경하고 43개 `absolute_path` 필드를 제거
- `inventory.csv`: `absolute_path` 열과 43개 값을 제거하고 상대 경로, 파일명, MIME, 크기, SHA-256, dimensions와 분류 데이터는 유지
- `redaction-manifest.json`: 외부 원본 8개는 표시용 토큰 경로로, 검토 출력 8개는 저장소 상대 경로로 변경

해시, 크기, dimensions, crop·mask 좌표, 분류와 원본 보호 기록은 변경하지 않았다.

## 5. 재발 방지

검토 산출물 생성기 2개는 런타임에서만 실제 `Path`를 사용하고 추적 JSON과 CSV에는 상대 경로 또는 표시용 토큰만 기록하도록 변경했다. 원본 탐색, 해시 계산, crop, 불투명 mask와 metadata 제거 동작은 유지했다.

프로젝트 미디어 설정과 변환·검증 스크립트 3개에서는 로컬 sibling 폴더명을 제거했다. RoadScanner 원본을 직접 재변환할 때만 `ROADSCANNER_MEDIA_SOURCE` 환경 변수로 외부 루트를 전달한다. 해당 변수가 없는 CI에서는 기존 `sourcesLocalOnly` 정책대로 원본 mapping을 건너뛰고 production WebP 자체를 검증한다.

## 6. 이메일과 개인정보 검토

- 승인된 공개 연락처: `cheezmicro@gmail.com` 유지
- legacy Jekyll 연락처 처리 파일의 일반 예제 도메인: placeholder로 분류해 유지
- v0 템플릿 제3자 연락처: 실제 문자열 제거
- 승인되지 않은 실제 이메일: 0건
- 전화번호: 0건
- 주소와 인증값: 실제 값 발견 0건

RoadScanner 검토 문서에 나오는 계정명, 이메일, 인증번호와 관리자 정보는 노출 위험을 설명하는 일반 문장이다. 실제 값은 문서에 옮겨 적지 않았다.

## 7. 자격증명과 Git 이력 검사

현재 추적 트리에서 GitHub 토큰, AWS 키, 개인키, 비밀번호, API 키, 비밀값과 인증 헤더 계열의 실제 자격증명 후보는 0건이다. 지정된 자격증명 패턴으로 제한적으로 검사한 전체 Git 이력도 일치 커밋이 0개다.

로컬 절대 경로가 추가되거나 변경된 이력은 다음 6개 커밋에서 확인됐다.

- `1db92fd`
- `7ae07e6`
- `14b5779`
- `0590003`
- `6f6aa14`
- `34c2804`

이 값들은 자격증명이 아니므로 이번 범위에서 rebase, filter-repo, force push와 history rewrite를 수행하지 않았다. 과거 feature 브랜치 이력의 로컬 경로는 잔여 공개 위험으로 기록하며, 최종 병합 방식과 원격 브랜치 보존 여부는 Owner가 결정한다.

## 8. 의도적으로 유지한 문자열

다음 문자열은 문맥상 필요한 예외로 유지했다.

- `localhost`: publication 차단 정책과 미디어에서 제거한 대상을 설명
- `127.0.0.1`: 로컬 production 검수 기록
- `file://`: 기존 Jekyll Respond.js 호환성 주석
- `example.com`과 예제 이메일 도메인: placeholder 차단 또는 legacy 예제
- `https://cheezcyj.github.io`와 공개 GitHub 저장소 URL: production에 필요한 공개 URL

## 9. 공개 유지 권장 문서

다음 문서는 설계 결정, 마이그레이션 근거, 배포와 검증 기록으로서 공개 유지 가치가 있다.

- v0 디자인 분석과 migration inventory·plan
- Astro·asset·content foundation 및 보존 보고서
- Pages 배포 보고서
- 프로젝트 UI·미디어 계획·integration 보고서
- RoadScanner production media와 publication 최종 보고서

## 10. 향후 정리 권장 문서

다음 자료는 삭제하지 않았지만 내부 검토 과정이 중심이므로 Owner 승인 후 비공개 보관 또는 공개용 요약으로 통합할 수 있다.

- project content·media review 상세 문서
- `roadscanner-draft-report.md`, `roadscanner-content-review.md`, `roadscanner-media-review.md`, `roadscanner-media-owner-review.md`, `roadscanner-media-redaction-review.md`
- `docs/media-review/` 아래 UI 캡처, contact sheet, 원본 inventory, 분류표와 생성 보고서

특히 검토용 캡처와 contact sheet는 기존 비식별화 검수 결과를 유지하되, 장기 공개 필요성은 별도로 판단하는 것이 안전하다.

## 11. PR 본문 검사

Draft PR #1의 제목과 본문에는 사용자 홈 경로, 로컬 작업공간명, 외부 원본 폴더명, 컨테이너 임시 경로, 이메일과 자격증명 후보가 0건이다. 공개 URL과 workflow run 정보는 유지했다.

## 12. 검증 결과

- `pnpm install --frozen-lockfile`: 성공, lockfile 변경 없음
- `pnpm format:check`: 성공
- `pnpm check`: 30개 파일, 오류·경고·힌트 0
- `pnpm verify:assets`: legacy asset 9개, 오류 0
- `pnpm verify:media`: 프로젝트 2개, 승인 WebP 8개, 오류 0
- `pnpm verify:content`: 콘텐츠 2건, 공개 1건, 오류 0
- `pnpm build`: 성공, 정적 페이지 7개
- `git diff --check`: 오류 0
- 추적 트리 경로 재감사: 사용자별 경로와 로컬 폴더 식별자 0건
- 추적 트리 자격증명 재감사: 실제 후보 0건
- 이메일 재감사: 승인된 공개 연락처와 일반 placeholder만 존재
- `dist` 재감사: 로컬 경로, 내부 검토 경로, v0 템플릿 연락처와 Draft Preview 0건

RoadScanner 상세 route는 생성됐고 기존 draft 프로젝트 상세 route는 생성되지 않았다. UI, frontmatter 공개 상태, production WebP, workflow, package와 lockfile은 변경하지 않았다.

## 13. 잔여 위험

- 현재 tree는 정리됐지만 과거 feature 브랜치 커밋에는 비밀정보가 아닌 로컬 경로가 남아 있다.
- 내부 중간 산출물의 공개 유지 여부는 Owner가 아직 결정하지 않았다.
- 바이너리 review artifact는 텍스트 감사 대상이 아니며 기존 시각·미디어 검수를 신뢰한다.
- Pages repository source는 아직 legacy이며 이번 단계에서 변경하지 않는다.
- Draft 해제, main 병합과 Pages 배포는 이번 단계의 범위가 아니다.
