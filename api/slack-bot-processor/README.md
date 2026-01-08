# Slack Bot Processor

Self-hosted Slack bot for file processing pipelines. Socket Mode 기반으로 Public URL 없이 동작.

## 지원 파일

| 타입 | 확장자 | 처리 |
|------|--------|------|
| 이미지 | jpg, png, webp, gif, tiff | 리사이즈 후 재업로드 |
| PDF | pdf | 텍스트 추출 |
| Word | docx | 텍스트 추출 |

## Quick Start

```bash
cp .env.example .env   # Slack 토큰 설정
pnpm install
pnpm dev               # 또는 docker compose up -d
```

## 문서

- [SETUP.md](./SETUP.md) - Slack App 설정, 배포, 커스텀 프로세서 추가

## 구조

```
src/
├── index.ts           # 앱 진입점 (Socket Mode)
├── handlers/          # 이벤트 핸들러
├── processors/        # 파일 처리기 (image, document)
└── lib/
    ├── guards.ts      # 스킵 조건 (재귀 방지 등)
    └── slack.ts       # 유틸리티
```
