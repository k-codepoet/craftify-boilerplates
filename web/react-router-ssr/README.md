# React Router SSR

SSR 풀스택 boilerplate. 서버 사이드 렌더링을 지원합니다.

## 기술 스택

- React Router 7.10 (SSR)
- Tailwind CSS v4
- TypeScript
- shadcn/ui 호환 테마 시스템

## 사용법

```bash
# 1. 복제
cp -r boilerplates/web/react-router-ssr apps/{프로젝트명}
cd apps/{프로젝트명}

# 2. package.json name 수정
# "@boilerplates/react-router-ssr" → "@apps/{프로젝트명}"

# 3. 의존성 설치
pnpm install

# 4. 개발 서버 시작
pnpm dev
```

## 명령어

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 개발 서버 (HMR) |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm preview` | 빌드 후 로컬 서버 실행 |
| `pnpm typecheck` | 타입 체크 |

## 구조

```
├── app/
│   ├── app.css           # Tailwind + 테마 변수
│   ├── entry.server.tsx  # SSR 엔트리
│   ├── root.tsx          # 루트 레이아웃
│   ├── routes.ts         # 라우트 정의
│   ├── routes/           # 페이지 컴포넌트
│   └── lib/              # 유틸리티
└── vite.config.ts        # Vite 설정
```

## shadcn/ui 컴포넌트 추가

```bash
npx shadcn@latest add button
```
