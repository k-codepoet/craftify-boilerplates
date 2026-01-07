# React Router SSR + Cloudflare Workers

Cloudflare Workers에서 서버 사이드 렌더링을 지원하는 풀스택 boilerplate.

## 기술 스택

- React Router 7 (SSR)
- Cloudflare Workers
- Tailwind CSS v4
- TypeScript
- shadcn/ui 호환 테마 시스템

## 사용법

```bash
# 1. 복제
cp -r boilerplates/web/react-router-ssr-cloudflare apps/{프로젝트명}
cd apps/{프로젝트명}

# 2. package.json name 수정
# "@boilerplates/react-router-ssr-cloudflare" → "@apps/{프로젝트명}"

# 3. wrangler.toml name 수정
# name = "my-app" → name = "{프로젝트명}"

# 4. 의존성 설치
pnpm install

# 5. 개발 서버 시작
pnpm dev
```

## 명령어

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 개발 서버 (HMR) |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm start` | Wrangler 로컬 서버 |
| `pnpm deploy` | Cloudflare 배포 |
| `pnpm typecheck` | 타입 체크 |

## 구조

```
├── .github/
│   └── workflows/
│       └── deploy.yml    # CI/CD 워크플로우
├── app/
│   ├── app.css           # Tailwind + 테마 변수
│   ├── entry.server.tsx  # SSR 엔트리
│   ├── root.tsx          # 루트 레이아웃
│   ├── routes.ts         # 라우트 정의
│   ├── routes/           # 페이지 컴포넌트
│   └── lib/              # 유틸리티
├── workers/
│   └── app.ts            # Cloudflare Worker 엔트리
├── wrangler.toml         # Cloudflare 설정
└── vite.config.ts        # Vite 설정
```

## shadcn/ui 컴포넌트 추가

```bash
npx shadcn@latest add button
```

## 배포

### 수동 배포

```bash
# Cloudflare 계정 로그인 (최초 1회)
npx wrangler login

# 배포
pnpm deploy
```

### 자동 배포 (GitHub Actions)

GitHub Actions 워크플로우가 포함되어 있습니다:

- **main 브랜치 push** → 프로덕션 자동 배포
- **PR 생성** → 프리뷰 URL 자동 생성 (PR 코멘트로 안내)

#### 설정 방법

**1. Cloudflare 정보 확인**

```bash
# Cloudflare 로그인
npx wrangler login

# Account ID 확인
npx wrangler whoami
```

또는 [Cloudflare Dashboard](https://dash.cloudflare.com) URL에서 Account ID 확인:
`https://dash.cloudflare.com/{ACCOUNT_ID}/...`

**2. Cloudflare API 토큰 생성**

- [API Tokens](https://dash.cloudflare.com/profile/api-tokens) 접속
- "Create Token" → "Edit Cloudflare Workers" 템플릿 사용
- Account Resources: 본인 계정 선택
- Zone Resources: All zones (또는 특정 도메인)

**3. GitHub Secrets 설정**

**방법 A: GitHub CLI (권장)**

```bash
# GitHub CLI 로그인 (최초 1회)
gh auth login

# Secrets 설정
gh secret set CLOUDFLARE_API_TOKEN --body "your-api-token"
gh secret set CLOUDFLARE_ACCOUNT_ID --body "your-account-id"

# 설정 확인
gh secret list
```

**방법 B: GitHub 웹 UI**

1. GitHub 저장소 → Settings → Secrets and variables → Actions
2. "New repository secret" 클릭
3. 다음 2개 추가:
   - Name: `CLOUDFLARE_API_TOKEN`, Value: 생성한 API 토큰
   - Name: `CLOUDFLARE_ACCOUNT_ID`, Value: Cloudflare 계정 ID

**4. wrangler.toml 프로젝트명 수정**
   ```toml
   name = "my-app"  # 실제 프로젝트명으로 변경

   [env.production]
   name = "my-app"  # 프로덕션 Worker 이름

   [env.preview]
   name = "my-app-preview"  # 프리뷰 Worker 이름
   ```

#### 배포 URL

- **프로덕션**: `https://{프로젝트명}.{계정}.workers.dev`
- **프리뷰**: `https://{프로젝트명}-preview.{계정}.workers.dev`

커스텀 도메인은 Cloudflare Dashboard에서 설정:
Workers & Pages > {프로젝트} > Settings > Domains & Routes
