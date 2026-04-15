# Troubleshooting: 자주 겪는 문제 + 해결법

실전 경험을 바탕으로 한 빠른 문제 해결 가이드.

---

## Claude Code 느려질 때

### 증상
- 응답 지연 (30초 이상)
- 메시지 입력 후 로딩 화면 길어짐
- Statusline에 "90% 이상" 표시

### 해결법

#### 1. /compact (우선 시도)

```
/compact
```

현재 세션의 대화를 자동 요약. 컨텍스트 사용량 60-70%로 단계별.

**효과**: 응답 속도 50% 향상

#### 2. /clear (재시작 필요 시)

```
/clear
```

현재 세션의 모든 이전 메시지 삭제. 완전히 새로운 상태에서 시작.

**주의**: 이전 대화 내용 손실. 중요한 정보는 파일로 저장 후 사용.

#### 3. 자동 컴팩트 설정

```bash
# ~/.zshrc 에 추가
export CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=80
```

80% 도달 시 자동 컴팩트. Claude Code 재시작 필요.

#### 4. 파일 정리

```bash
# 현재 디렉토리의 불필요한 파일 삭제
rm -rf node_modules/  # node_modules는 .gitignore에 보통 있음
rm -rf .next/         # Next.js 빌드 결과
rm -rf dist/          # 일반 빌드 결과

# 임시 파일 정리
find . -name "*.log" -delete
find . -name ".DS_Store" -delete
```

### 예방

```
한 세션 = 한 기능
↓
40-50K 토큰으로 충분
↓
컨텍스트 60% 미만 유지
↓
항상 빠른 응답
```

---

## MCP 서버 안 뜰 때

### 증상

```
Error: MCP server failed to start
Configuration error: enabledMcpServers
```

또는 특정 도구가 사용 불가:

```
Tool "github" not found
```

### 해결법

#### 1. enabledMcpServers 확인

settings.json에서:

```json
{
  "enabledMcpServers": {
    "github": true,
    "brave-search": true,
    "context7": true
  }
}
```

비활성화된 서버가 있으면 `true`로 변경.

#### 2. 글로벌 설치로 전환

npx 대신 글로벌 설치:

```bash
# 잘못된 설정 (npx, 느림)
npx @brave/browser-search

# 올바른 설정 (글로벌, 빠름)
npm install -g @brave/browser-search
which brave-search  # 경로 확인
```

#### 3. MCP 서버 로그 확인

```bash
# Claude Code 콘솔
Cmd + ` (백틱)
```

에러 메시지 확인:

```
[MCP] github: ENOENT: no such file
[MCP] brave-search: connection timeout
```

#### 4. 수동 재시작

```bash
# settings.json 편집
"forceRestartMcp": true

# Claude Code 재시작
Cmd + Shift + P > "Restart"
```

#### 5. MCP 서버 재설치

```bash
# 제거
npm uninstall -g @brave/browser-search

# 설치
npm install -g @brave/browser-search

# 확인
which brave-search
# /usr/local/bin/brave-search

# 경로를 settings.json에 등록
"mcpServers": {
  "brave": {
    "command": "/usr/local/bin/brave-search"
  }
}
```

---

## Playwright Chrome 충돌

### 증상

```
Error: Browser not found
Puppeteer: Install Chrome manually or use downloadBrowser()
```

또는 프로세스 충돌:

```
FATAL: Error: Port 9222 is already in use
```

### 해결법

#### 1. 명시적 브라우저 선택

settings.json에서:

```json
{
  "playwrightConfig": {
    "use": {
      "browser": "chromium"  // chrome 대신 chromium
    }
  }
}
```

#### 2. 사용자 데이터 디렉토리 분리

```bash
# 스크립트에서 (예: Playwright 테스트)
const browser = await chromium.launch({
  userDataDir: `/tmp/claude-${Date.now()}`
});
```

#### 3. 좀비 Chrome 프로세스 정리

```bash
# 실행 중인 Chrome 확인
ps aux | grep -i chrome

# 강제 종료
pkill -9 Chrome

# 포트 확인
lsof -i :9222
kill -9 <PID>
```

#### 4. Playwright 재설치

```bash
npm uninstall -g playwright
npm install -g playwright
npx playwright install  # 브라우저 다운로드
```

---

## Google 로그인 매번 필요

### 증상

- 매 세션마다 Google 로그인 프롬프트
- 쿠키/세션이 저장되지 않음
- "일회용" 인증 상태

### 해결법

#### 1. Chrome 프로필 유지

settings.json:

```json
{
  "playwrightConfig": {
    "use": {
      "profile": "/Users/YOUR_USER/Library/Application Support/Google/Chrome/Default"
    }
  }
}
```

또는 임시 프로필:

```json
{
  "playwrightConfig": {
    "use": {
      "userDataDir": "/Users/YOUR_USER/.claude/browser-profile"
    }
  }
}
```

#### 2. 로컬 스토리지 보존

테스트 코드:

```javascript
await context.addInitScript(() => {
  // localStorage는 자동 보존됨
  // 필요한 쿠키만 명시
  localStorage.setItem('auth_token', 'your_token');
});
```

#### 3. 환경 변수로 토큰 관리

.env:

```
GOOGLE_AUTH_TOKEN=ya29.xxx...
```

코드:

```javascript
const token = process.env.GOOGLE_AUTH_TOKEN;
// Google API 직접 호출 (OAuth 스킵)
```

#### 4. 서비스 계정 사용 (권장)

Google Cloud Console:
- 서비스 계정 생성
- JSON 키 다운로드
- 애플리케이션에서 사용

```javascript
const {GoogleAuth} = require('google-auth-library');

const auth = new GoogleAuth({
  keyFilename: '/path/to/service-account.json',
});

const client = await auth.getClient();
```

---

## mosh 좀비 세션

### 증상

```
Mosh did not make progress sending packets
```

연결은 활성화되어 보이지만 응답 없음.

### 원인

- 오래된 mosh 연결이 남아있음
- 네트워크 인터페이스 변화 (Wi-Fi ↔ 4G)
- mosh-server 데몬이 응답 불가

### 해결법

#### 1. 로컬 mosh 프로세스 정리

```bash
ps aux | grep mosh
# 명령 찾기

# 강제 종료
pkill -9 mosh

# 환경 변수 초기화
unset MOSH_KEY MOSH_PREDICTION
```

#### 2. 서버의 mosh 데몬 정리

```bash
ssh user@remote-server

# 데몬 확인
ps aux | grep mosh-server

# 강제 종료
pkill -9 mosh-server

# 또는 원격에서 한 줄로
ssh user@remote-server "pkill -9 mosh-server"
```

#### 3. 네트워크 타임아웃 조정

~/.bashrc 또는 ~/.zshrc:

```bash
export MOSH_SERVER_NETWORK_TMOUT=86400  # 24시간
export MOSH_CLIENT_NETWORK_TMOUT=60     # 60초
```

#### 4. 새로 접속

```bash
mosh user@remote-server
# 또는
mosh user@remote-server -- tmux attach -t photoism
```

---

## 리소스 부족

### 증상

```
Out of memory
Cannot allocate memory
Killed (OOM)
```

또는 시스템 느려짐.

### 체크리스트

#### 1. 좀비 Claude 세션 정리

```bash
ps aux | grep claude

# 응답 없는 프로세스 종료
kill -9 <PID>
```

#### 2. mosh 좀비 세션 정리

```bash
ps aux | grep mosh
pkill -9 mosh  # 모든 mosh 프로세스 종료

# 또는 선택적으로
kill -9 <특정_PID>
```

#### 3. Docker 컨테이너 정리

```bash
# 실행 중인 컨테이너
docker ps

# 중지된 컨테이너 정리
docker container prune

# 이미지 정리
docker image prune

# 전체 정리 (주의: 데이터 손실 가능)
docker system prune -a
```

#### 4. Chrome 탭 정리

Playwright 테스트 후 Chrome 프로세스가 남음:

```bash
pkill -9 chrome
pkill -9 chromium
```

#### 5. 메모리 상태 확인

```bash
# macOS
top -l 1 | head -20

# Linux
free -h
htop

# 큰 파일 찾기
du -sh /*  # 루트에서
du -sh ~/  # 홈 폴더에서
```

---

## Git Hook 실패

### 증상

```
husky > pre-commit hook failed
error: commit did not complete
```

또는 lint 에러로 커밋 불가.

### 해결법

#### 1. 에러 원인 조사

```bash
# 직접 hook 실행
npm run lint

# 타입 체크
npm run typecheck

# 에러 메시지 읽고 수정
```

#### 2. 새 커밋 생성 (amend 금지)

```
금지: git commit --amend --no-verify
      ↑ --no-verify는 hook 스킵 (나쁜 습관)

권장: 에러 수정 후 새 커밋
      git add .
      git commit -m "fix: resolve lint errors"
```

#### 3. Hook 임시 비활성화 (긴급 상황만)

```bash
# 특정 커밋에만
git commit -m "msg" --no-verify

# 이후 즉시 복구
git commit --amend -m "fix: add proper fixes"
```

#### 4. Hook 설정 확인

.husky/pre-commit:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint:fix  # auto-fix 활성화?
npm run typecheck
```

---

## Gemini CLI Rate Limit

### 증상

```
Error: Rate limit exceeded
429 Too Many Requests
```

### 원인

- API 할당량 초과
- 계정 제한
- 모델 변경 필요

### 해결법

#### 1. 계정 확인

```bash
gcloud auth list
gcloud config list project

# 올바른 계정인지 확인
```

#### 2. 요청 간 딜레이 추가

```bash
# 스크립트에서
for i in {1..10}; do
  gemini-api-call
  sleep 2  # 2초 대기
done
```

#### 3. 모델 변경

```json
{
  "model": "gemini-2.0-flash",  // 변경
  "generationConfig": {
    "temperature": 1,
    "topP": 0.95,
    "topK": 40,
    "maxOutputTokens": 8192,
  }
}
```

또는 claude로 전환:

```bash
export CLAUDE_API_KEY=sk-ant-...
# Claude API 사용 (rate limit 안 할 수도)
```

#### 4. API 할당량 확인

Google Cloud Console:
- APIs & Services > Quotas
- Gemini API의 할당량 확인
- 필요 시 할당량 증가 요청

---

## dbhub MCP 좀비

### 증상

```
Tool "dbhub-query" not found
Database connection failed
```

또는:

```
Cannot find module 'dbhub'
```

### 해결법

#### 1. 글로벌 설치로 전환

```bash
# 제거
npm uninstall -g @dbhub/mcp

# 글로벌 설치
npm install -g @dbhub/mcp

# 경로 확인
which dbhub-mcp
```

#### 2. settings.json 업데이트

```json
{
  "mcpServers": {
    "dbhub": {
      "command": "/usr/local/bin/dbhub-mcp",
      "args": [],
      "env": {
        "DBHUB_API_KEY": "your-api-key"
      }
    }
  }
}
```

#### 3. 프로세스 정리

```bash
ps aux | grep dbhub
pkill -9 dbhub

# Claude Code 재시작
```

#### 4. 연결 테스트

```bash
# 직접 API 호출
curl https://api.dbhub.io/v1/db/list \
  -H "Authorization: Bearer YOUR_TOKEN"

# 응답이 있으면 API는 정상
# Claude Code만 재시작하면 됨
```

---

## 빠른 참조

| 문제 | 우선 시도 | 2번째 | 3번째 |
|------|---------|-------|-------|
| 느림 | /compact | /clear | 재시작 |
| MCP 안 뜸 | 화이트리스트 확인 | 글로벌 설치 | 재시작 |
| Chrome 충돌 | userDataDir | pkill | 재설치 |
| Google 로그인 | profile 설정 | 토큰 관리 | 서비스 계정 |
| mosh 좀비 | pkill mosh | 타임아웃 조정 | 새로 접속 |
| OOM | 좀비 정리 | Docker prune | 재부팅 |
| Git hook 실패 | lint 수정 | 새 커밋 | 원인 조사 |

---

## 체크리스트: 시스템 점검

매주 1회 실행:

```bash
# 세션 정리
tmux kill-server 2>/dev/null

# 좀비 프로세스 정리
pkill -9 mosh
pkill -9 chrome
pkill -9 node

# 로그 정리
rm -rf /tmp/*.log
rm -rf ~/.claude/logs/*.log

# 디스크 확인
df -h  # 85% 이상이면 정리

# 메모리 상태
free -h  # Linux
vm_stat | grep "Pages free"  # macOS
```

---

## 팁

1. **로그는 진짜 중요**: 에러 메시지를 끝까지 읽으면 80% 자해결
2. **주기적 정리**: 주 1회 좀비 프로세스 정리가 예방책
3. **글로벌 설치 우선**: npx는 느림, npm install -g 추천
4. **amend 금지**: Git hook 실패 시 새 커밋으로 (amend는 히스토리 복잡하게 함)
5. **환경 변수는 스크립트로**: 매번 입력하지 말고 ~/.zshrc에 저장
