# RoadScanner MP4 contact sheet 상태

Phase 4C-3.1에서 MP4 contact sheet는 생성하지 않았다.

- 확인 순서: `ffmpeg` → `ffprobe` → Python OpenCV `VideoCapture` → Python `imageio` → Python `imageio-ffmpeg`
- 결과: 모든 decoder가 현재 환경에 설치되어 있지 않음
- MP4 추출 frame: 0개
- MP4 contact sheet: 0개
- 중단 이유: 이번 단계는 기존 도구만 사용하도록 제한하며 패키지 설치와 실행 파일 다운로드를 금지함
- 재개 조건: 기존 `ffmpeg`/`ffprobe` 또는 OpenCV·imageio-ffmpeg가 제공된 환경에서 우선 MP4 3개의 10%·30%·50%·70%·90% frame을 추출

GIF의 5.00초와 6.42초 frame은 Pillow로 추출했으며 `../video-frames/`에 별도 보관한다. GIF frame은 MP4 frame 검수 완료로 계산하지 않는다.
