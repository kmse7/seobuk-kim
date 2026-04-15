---
name: cicd-setup
description: 새 프로젝트 CI/CD 셋업 — GitHub Actions self-hosted runner + pm2 production 배포 파이프라인 구성
---

# CI/CD Setup (Mac mini Self-hosted Runner)

새 프로젝트에 GitHub Actions self-hosted runner 기반 CI/CD를 구성한다.
Mac mini (minikim) 환경 전용. runner는 arm64/macOS, launchd로 자동시작.

## Usage

- `/cicd-setup` → 인터뷰부터 시작
- `/cicd-setup 프로젝트명` → 프로젝트 정보 기반으로 바로 진행

## 사전 확인 사항

1. GitHub repo가 존재하는가? (org/repo 확인)
2. pm2 프로세스 이름은? (예: `photoism-dashboard`, `mn-settle`)
3. 앱 포트는? (예: 3002)
4. 프로젝트 루트에 `package.json`이 있는가?
5. ETL 등 별도 빌드 대상이 있는가?

## Steps

### 1. 인터뷰

다음 정보를 순서대로 확인한다 (모르면 질문):

- **repo**: `kmse7/<repo-name>` 형식
- **runner name**: `mac-mini-<project-short-name>` 규칙 사용. 예: `mac-mini-dashboard`, `mac-mini-settle`
- **pm2 name**: 기존 pm2 프로세스 이름 (`pm2 list`로 확인 가능)
- **build command**: 기본 `npm run build`. ETL 등 추가 빌드 있으면 추가
- **app directory**: 모노레포인 경우 앱 루트 (예: `app/`, `web/`)
- **port**: pm2가 사용하는 포트

### 2. runner 등록 확인

기존 runner가 있는지 확인:
```bash
gh api repos/kmse7/<repo>/actions/runners --jq '.runners[].name'
```

없으면 사용자에게 안내:
```
runner 등록이 필요합니다.
1. GitHub → repo → Settings → Actions → Runners → New self-hosted runner
2. OS: macOS, Architecture: ARM64
3. 안내된 명령어를 Mac mini에서 실행
4. runner 디렉토리: ~/actions-runner-<project-short-name>/
5. 완료 후 알려주세요
```

### 3. workflow 파일 생성

`.github/workflows/ci.yml` 생성:

```yaml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  check:
    name: Type Check & Build
    runs-on: [self-hosted, macOS, ARM64, <runner-name>]
    steps:
      - uses: actions/checkout@v4

      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: <app-dir>/package-lock.json

      - name: Install dependencies
        working-directory: <app-dir>
        run: npm ci

      - name: Type check
        working-directory: <app-dir>
        run: npx tsc --noEmit

      - name: Build
        working-directory: <app-dir>
        run: npm run build

  deploy:
    name: Deploy
    needs: check
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: [self-hosted, macOS, ARM64, <runner-name>]
    steps:
      - uses: actions/checkout@v4

      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: <app-dir>/package-lock.json

      - name: Install dependencies
        working-directory: <app-dir>
        run: npm ci

      - name: Build
        working-directory: <app-dir>
        run: npm run build

      - name: Reload pm2
        run: pm2 reload <pm2-name> || pm2 restart <pm2-name>
```

**주의사항:**
- ETL 빌드가 있으면 `check` job에 step 추가 (`cd mart/etl && npm run build`)
- 모노레포가 아닌 경우 `working-directory` 생략, `cache-dependency-path`는 `package-lock.json`

### 4. pm2 ecosystem.config.js 확인/생성

프로젝트 루트에 `ecosystem.config.js`가 없으면 생성:

```js
module.exports = {
  apps: [{
    name: '<pm2-name>',
    cwd: '/Users/minikim/projects/<project-dir>/<app-dir>',
    script: 'node_modules/.bin/next',
    args: 'start -p <port>',
    env: {
      NODE_ENV: 'production',
      PORT: <port>
    }
  }]
}
```

pm2에 등록:
```bash
pm2 start ecosystem.config.js
pm2 save
```

### 5. launchd 서비스 등록 확인

runner가 자동시작 설정되어 있는지 확인:
```bash
launchctl list | grep actions.runner
```

없으면 runner 디렉토리에서:
```bash
cd ~/actions-runner-<project-short-name>
./svc.sh install
./svc.sh start
```

### 6. 검증

```bash
# runner 온라인 상태 확인
gh api repos/kmse7/<repo>/actions/runners --jq '.runners[] | {name, status}'

# 최근 workflow 실행 확인
gh run list --repo kmse7/<repo> --limit 5
```

main에 빈 커밋으로 테스트:
```bash
git commit --allow-empty -m "chore: test CI/CD pipeline"
git push
gh run watch --repo kmse7/<repo>
```

### 7. 메모리 업데이트

`~/.claude/projects/-Users-minikim/memory/infra_db_inventory.md`의 CI/CD 섹션에 추가:
```
| mac-mini-<name> | kmse7/<repo> | ~/actions-runner-<name>/ | actions.runner.<name> |
```

pm2 섹션에 추가:
```
| <pm2-name> | <port> | production (next start) | <project-dir> |
```

## 완료 체크리스트

- [ ] runner가 GitHub에서 Online 상태
- [ ] `.github/workflows/ci.yml` 커밋됨
- [ ] `ecosystem.config.js` 존재 + pm2에 등록됨
- [ ] launchd 서비스 등록됨 (재부팅 후 자동시작)
- [ ] test push → check + deploy job 모두 green
- [ ] `infra_db_inventory.md` 업데이트됨
