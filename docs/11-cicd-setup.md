# CI/CD 셋업 가이드: GitHub Actions + pm2 배포

## 개요

새 프로젝트를 시작할 때 자동으로 실행되는 CI/CD 파이프라인 구성 방법. PR 검증 → 메인 배포 → 라이브 배포까지 자동화.

---

## /cicd-setup 스킬 사용법

가장 빠른 방법.

```
/cicd-setup
```

### 대화형 질문

```
프로젝트 프레임워크? > Next.js
언어? > TypeScript
DB? > PostgreSQL
배포 환경? > Vercel (또는 self-hosted)
```

### 결과 파일

```
.github/
├── workflows/
│   ├── pr-validation.yml
│   ├── deploy-main.yml
│   └── deploy-production.yml
├── actions/
│   └── notify.js

ecosystem.config.js
pm2.config.js
deploy.sh

.env.example
```

---

## GitHub Actions Self-Hosted Runner 설치

Vercel이나 클라우드 배포가 아니라 자체 서버에 배포할 때.

### 1. Runner 다운로드 및 설치

```bash
# 프로젝트 폴더
mkdir -p ~/runners/photoism
cd ~/runners/photoism

# GitHub에서 runner 토큰 생성
# Settings > Actions > Runners > New self-hosted runner

# 다운로드
curl -o actions-runner-linux-x64-X.X.X.tar.gz \
  -L https://github.com/actions/runner/releases/download/...
tar xzf actions-runner-linux-x64-*.tar.gz

# 설정
./config.sh --url https://github.com/YOUR_ORG/YOUR_REPO \
  --token YOUR_TOKEN
```

### 2. 백그라운드 실행 (systemd)

```bash
# 서비스 등록
sudo ./svc.sh install

# 시작
sudo ./svc.sh start

# 상태 확인
sudo ./svc.sh status

# 로그
journalctl -u actions.runner.* -f
```

### 3. 설정 확인

GitHub > Settings > Actions > Runners에서 "Online" 상태 확인.

---

## PR 검증 파이프라인

PR이 생성되면 자동으로 typecheck + build 검증.

### 파일: .github/workflows/pr-validation.yml

```yaml
name: PR Validation

on:
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run typecheck
        continue-on-error: false

      - name: Lint
        run: npm run lint
        continue-on-error: true

      - name: Build
        run: npm run build
        continue-on-error: false

      - name: Run tests
        run: npm run test
        continue-on-error: true

      - name: Notify on failure
        if: failure()
        run: |
          echo "PR validation failed"
          exit 1
```

### 검증 항목

| 항목 | 필수 | 실패 시 |
|------|------|--------|
| Typecheck | O | PR 병합 차단 |
| Build | O | PR 병합 차단 |
| Lint | X | 경고만 |
| Tests | X | 경고만 |

---

## Main 브랜치 배포 파이프라인

main에 머지되면 자동으로 빌드 + pm2 리로드.

### 파일: .github/workflows/deploy-main.yml

```yaml
name: Deploy to Main

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: [self-hosted, photoism]  # 특정 runner 지정
    timeout-minutes: 30

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci --omit=dev

      - name: Build
        run: npm run build
        env:
          NODE_ENV: production

      - name: Run migrations
        run: npm run migrate
        continue-on-error: true

      - name: Reload with pm2
        run: |
          pm2 reload ecosystem.config.js --env production
          pm2 save
        env:
          NODE_ENV: production

      - name: Health check
        run: |
          sleep 5
          curl -f http://localhost:3000/health || exit 1

      - name: Notify deployment
        if: success()
        run: |
          echo "Deployment successful"
          # Slack 알림 추가 가능

      - name: Notify failure
        if: failure()
        run: |
          echo "Deployment failed, rolling back"
          pm2 reload ecosystem.config.js --env production
          exit 1
```

---

## ecosystem.config.js 작성

pm2 배포 설정. 앱 시작, 환경 변수, 로그 위치 등.

### 최소 설정

```javascript
module.exports = {
  apps: [
    {
      name: "photoism",
      script: "npm",
      args: "start",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      max_memory_restart: "500M",
    },
  ],

  deploy: {
    production: {
      user: "deploy",
      host: "api.example.com",
      ref: "origin/main",
      repo: "git@github.com:ORG/photoism.git",
      path: "/home/deploy/photoism",
      "post-deploy": "npm install && npm run build && pm2 reload ecosystem.config.js --env production",
      "pre-deploy-local": "echo 'Deploying to production'",
    },
  },
};
```

### 주요 옵션

| 옵션 | 설명 |
|------|------|
| `instances: "max"` | CPU 코어 수만큼 프로세스 시작 |
| `exec_mode: "cluster"` | 클러스터 모드 (로드 밸런싱) |
| `max_memory_restart` | 메모리 초과 시 재시작 |
| `error_file` | 에러 로그 경로 |
| `merge_logs` | 여러 프로세스 로그를 한 파일로 |

---

## Cloudflare Tunnel 연동

외부 IP 노출 없이 안전하게 배포.

### 1. Tunnel 생성

```bash
# Cloudflare CLI 설치
brew install cloudflare/cloudflare/cloudflared

# 인증
cloudflared tunnel login

# 터널 생성
cloudflared tunnel create photoism

# DNS 레코드 자동 추가
cloudflared tunnel route dns photoism api.example.com
```

### 2. 설정 파일: ~/.cloudflared/config.yml

```yaml
tunnel: photoism
credentials-file: /home/deploy/.cloudflared/TUNNEL_ID.json

ingress:
  - hostname: api.example.com
    service: http://localhost:3000
  - service: http_status:404
```

### 3. 백그라운드 실행

```bash
# Systemd 서비스
sudo cloudflared service install

# 시작
sudo systemctl start cloudflared
sudo systemctl status cloudflared
```

---

## 실용 예시: Next.js 프로젝트 배포

### 디렉토리 구조

```
my-next-app/
├── .github/workflows/
│   ├── pr-validation.yml
│   └── deploy-main.yml
├── ecosystem.config.js
├── package.json
├── tsconfig.json
├── next.config.js
└── src/
    ├── pages/
    ├── components/
    └── api/
```

### package.json 스크립트

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --fix",
    "typecheck": "tsc --noEmit",
    "test": "jest",
    "migrate": "prisma migrate deploy",
    "seed": "node scripts/seed.js"
  },
  "devDependencies": {
    "eslint": "^8.0.0",
    "typescript": "^5.0.0",
    "jest": "^29.0.0"
  }
}
```

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  env: {
    API_URL: process.env.API_URL || "http://localhost:3000",
  },
};

module.exports = nextConfig;
```

### 배포 순서

```bash
# 1. 로컬에서 테스트
npm run build
npm start

# 2. PR 생성
git checkout -b feature/new-api
# ... 코드 작성 ...
git push origin feature/new-api

# GitHub: PR 생성 → 자동 검증 실행

# 3. PR 병합
# GitHub: Merge pull request

# 4. main 배포 자동 실행
# - build 실행
# - migration 실행
# - pm2 reload
# - health check

# 5. 배포 확인
curl https://api.example.com/health
```

---

## 모니터링 및 롤백

### 배포 로그 확인

```bash
# pm2 로그 실시간
pm2 logs photoism

# 최근 로그 (마지막 100줄)
pm2 logs photoism --lines 100

# 특정 프로세스 로그
pm2 logs "photoism-0"
```

### 수동 롤백

배포 후 문제 발생 시:

```bash
# 1. 이전 커밋으로 돌아가기
git revert HEAD
git push origin main

# 2. GitHub Actions 자동 재배포 (실패한 커밋 다시 배포됨)

# 또는 수동 롤백:
git reset --hard HEAD~1
git push origin main -f  # 주의: 팀 협업 중이면 위험
```

### Health Check 스크립트

배포 후 자동으로 상태 확인:

```bash
#!/bin/bash
# scripts/health-check.sh

HEALTH_URL="http://localhost:3000/health"
MAX_RETRIES=10
RETRY_DELAY=2

for i in $(seq 1 $MAX_RETRIES); do
  if curl -f "$HEALTH_URL" > /dev/null 2>&1; then
    echo "Health check passed"
    exit 0
  fi
  echo "Retry $i/$MAX_RETRIES..."
  sleep $RETRY_DELAY
done

echo "Health check failed"
exit 1
```

.github/workflows/deploy-main.yml에서 호출:
```yaml
- name: Health check
  run: bash scripts/health-check.sh
```

---

## 팁

1. **PR 검증은 필수 통과**: build 및 typecheck는 `continue-on-error: false`로 설정
2. **Self-hosted runner는 전용**: 다른 프로젝트와 공유하지 말 것 (리소스 경합)
3. **환경 변수 분리**: .env.example에는 값 없이, 실제 값은 GitHub Secrets에서 관리
4. **Rollback 계획**: 배포 전에 항상 롤백 경로 확인
5. **로그 보관**: `/logs` 폴더는 정기적으로 정리 (디스크 부족 방지)

## 체크리스트

새 프로젝트 시작할 때:

- [ ] `/cicd-setup` 실행
- [ ] GitHub Actions runner 설정
- [ ] pm2 ecosystem.config.js 작성
- [ ] 환경 변수 설정 (.env.example)
- [ ] Health check 엔드포인트 구현 (`/api/health`)
- [ ] 배포 테스트 (staging 먼저)
- [ ] Slack/이메일 알림 설정 (선택)
- [ ] 롤백 계획 문서화
