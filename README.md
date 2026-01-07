# Craftify Boilerplates

Craftify에서 사용하는 프로덕션 레디 프로젝트 템플릿 모음입니다.

## 빠른 시작

```bash
# degit으로 boilerplate 가져오기
npx degit k-codepoet/craftify-boilerplates/web/react-router-ssr my-app
npx degit k-codepoet/craftify-boilerplates/web/react-router-spa my-app

cd my-app
pnpm install
pnpm dev
```

## 개발 명령어

### 루트 레벨 (Turbo)
```bash
pnpm install    # 의존성 설치
pnpm dev        # 모든 패키지 개발 서버 시작
pnpm build      # 모든 패키지 빌드
pnpm lint       # 모든 패키지 린트
pnpm clean      # 빌드 결과물 정리
```

### 개별 Boilerplate
```bash
pnpm dev        # 개발 서버 (HMR)
pnpm build      # 프로덕션 빌드
pnpm typecheck  # TypeScript 타입 체크
```

## 구조

```
web/                    # 웹 프론트엔드/풀스택
├── react-router-ssr/          # React Router v7 + SSR
├── react-router-spa/          # React Router v7 + SPA (Static)
├── tanstack-start-ssr/        # (예정) TanStack Start + SSR
└── nextjs-ssr/                # (예정) Next.js + SSR

api/                    # 백엔드 API
├── hono/                      # (예정) Hono API
└── ...

lib/                    # 라이브러리/패키지
└── typescript-package/        # (예정) TypeScript 패키지 템플릿
```

## Boilerplate 목록

### Web

| 이름 | 프레임워크 | 렌더링 | 상태 |
|------|-----------|--------|------|
| `react-router-ssr` | React Router v7 | SSR | ✅ |
| `react-router-spa` | React Router v7 | SPA | ✅ |
| `tanstack-start-ssr` | TanStack Start | SSR | 📋 예정 |
| `tanstack-router-spa` | TanStack Router | SPA | 📋 예정 |
| `nextjs-ssr` | Next.js | SSR/SSG | 📋 예정 |

#### react-router-ssr
프로덕션 애플리케이션을 위한 풀스택 SSR 템플릿.
- Server-side rendering with `renderToReadableStream`
- isbot 검출로 검색엔진 크롤러 최적화

#### react-router-spa
빠른 프로토타이핑을 위한 정적 SPA 템플릿.
- 클라이언트 사이드 렌더링만 사용
- 어떤 정적 호스팅에도 배포 가능 (Pages, Vercel, Netlify)
- 빌드 결과물: `build/client/` 디렉토리

### API

| 이름 | 프레임워크 | 상태 |
|------|-----------|------|
| `hono` | Hono | 📋 예정 |

## 네이밍 규칙

```
{framework}-ssr   # SSR 렌더링
{framework}-spa   # SPA (Static) 렌더링
```

배포 플랫폼(Cloudflare, Vercel 등)은 템플릿 이름에 포함하지 않습니다.
프로젝트 생성 후 필요에 따라 배포 설정을 추가합니다.

## 공통 기술 스택

- **패키지 매니저**: pnpm v10.12+
- **모노레포**: Turbo v2.5+
- **빌드 도구**: Vite 7
- **프레임워크**: React Router v7
- **스타일링**: Tailwind CSS v4 (OKLch 컬러 시스템)
- **타입**: TypeScript 5 (strict mode)
- **UI 컴포넌트**: shadcn/ui 호환 (new-york 스타일)
- **아이콘**: lucide-react
- **폰트**: Inter (Google Fonts)

### 프로젝트 내부 구조
```
app/
├── app.css           # 글로벌 스타일 + Tailwind + 테마 변수
├── root.tsx          # 루트 레이아웃 (에러 바운더리 포함)
├── routes.ts         # React Router v7 라우트 설정
├── routes/           # 페이지 컴포넌트
├── components/       # UI 컴포넌트 (shadcn/ui)
├── lib/utils.ts      # 유틸리티 (cn 함수)
└── hooks/            # 커스텀 훅
```

### Path Alias
모든 boilerplate는 `~/*` → `./app/*` 경로 별칭 사용.

## Craftify 연동

이 boilerplate들은 `/craftify:poc` 명령어와 연동됩니다:

```bash
# Craftify가 자동으로 적절한 boilerplate를 선택
/craftify:poc
```

## 라이선스

MIT
