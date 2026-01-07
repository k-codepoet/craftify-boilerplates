# React Router SPA + Cloudflare Pages

Cloudflare Pages에 배포하는 SPA boilerplate. 정적 파일 호스팅용.

## 기술 스택

- React Router 7 (SPA mode)
- Cloudflare Pages
- Tailwind CSS v4
- TypeScript
- shadcn/ui 호환 테마 시스템

## 사용법

```bash
# 1. 복제
cp -r boilerplates/web/react-router-spa-cloudflare apps/{프로젝트명}
cd apps/{프로젝트명}

# 2. package.json name 수정
# "@boilerplates/react-router-spa-cloudflare" → "@apps/{프로젝트명}"

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
| `pnpm preview` | 빌드 결과 미리보기 |
| `pnpm deploy` | Cloudflare Pages 배포 |
| `pnpm typecheck` | 타입 체크 |

## 구조

```
├── .github/
│   └── workflows/
│       └── deploy.yml    # CI/CD 워크플로우
├── app/
│   ├── app.css       # Tailwind + 테마 변수
│   ├── root.tsx      # 루트 레이아웃
│   ├── routes.ts     # 라우트 정의
│   ├── routes/       # 페이지 컴포넌트
│   └── lib/          # 유틸리티
└── vite.config.ts    # Vite 설정
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

# 배포 (프로젝트 이름 입력 프롬프트)
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

#### 배포 URL

- **프로덕션**: `https://{프로젝트명}.pages.dev`
- **프리뷰**: `https://{branch}.{프로젝트명}.pages.dev`

Cloudflare Pages는 브랜치별로 자동으로 프리뷰 URL을 생성합니다.
커스텀 도메인은 Cloudflare Dashboard에서 설정.
