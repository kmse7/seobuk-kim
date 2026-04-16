# AI가 웹사이트를 직접 조작하게 하기 — 브라우저 자동화

## 이게 뭔가요?

브라우저 자동화는 **AI가 크롬 브라우저를 열고, 클릭하고, 스크린샷 찍는 것**입니다.

### 비유

```
당신: "우리 사이트 로그인 되는지 확인해봐"

❌ 일반 AI:
"됩니다" (실제로 안 봤는데 대충 대답)

✅ Claude Code (자동화):
1. 크롬 브라우저 자동 열기
2. 사이트에 접속
3. 로그인 버튼 클릭
4. 이메일/비밀번호 입력
5. "로그인 완료" 메시지 확인
6. "네, 로그인 잘 됩니다!" (확실한 답)
```

---

## 언제 쓰나요?

### 상황 1: "우리 사이트 스크린샷 찍어줄래"

```
AI한테:
로그인 화면의 스크린샷 찍어줄래?
사이트: https://myapp.com
```

AI가 해주는 것:
1. 브라우저 자동 열기
2. 사이트 접속
3. 스크린샷 촬영
4. 파일로 저장

### 상황 2: "우리 사이트 로그인 되는지 확인해봐"

```
AI한테:
우리 사이트 로그인 되는지 확인해봐.
이메일: test@example.com
비밀번호: [설정해둔 테스트 계정 비밀번호]
```

AI가 해주는 것:
1. 로그인 페이지 접속
2. 자동 로그인 시도
3. "로그인 성공" 또는 "로그인 실패" 보고

### 상황 3: "Google Cloud 콘솔에서 설정 바꿔줘"

```
AI한테:
Google Cloud 콘솔에 들어가서
이 프로젝트의 OAuth URI를 추가해줄래?
http://localhost:3000/callback
```

AI가 해주는 것:
1. Google 콘솔 접속 (자동 로그인)
2. 설정 페이지 이동
3. URI 입력란 찾기
4. 새 URI 입력
5. 저장 버튼 클릭
6. 완료 보고

---

## 로그인이 필요한 사이트 — "한 번 로그인해두면 다음부터 자동"

### 이런 상황일 때

```
Google Cloud 콘솔이나 GitHub 같은 곳에서
매번 로그인하기 귀찮을 때
```

### AI한테 이렇게 말하세요

```
Google Cloud 콘솔에 로그인해줄래?
이메일: kmse7@seobuk.kr
```

AI가 자동으로:
1. 브라우저 열기
2. Google 콘솔 접속
3. 로그인 진행
4. 정보 저장

### 해결법: Chrome 프로필로 로그인 정보 저장

#### 1단계: AI한테 로그인 요청

```
Google Cloud 콘솔에 로그인해줄래?
이메일: kmse7@seobuk.kr
```

#### 2단계: AI가 자동으로

1. 크롬 브라우저 자동 열기
2. Google 로그인 페이지 이동
3. 이메일 입력
4. 비밀번호 입력 (설정에서 가져옴)
5. 로그인 완료

#### 3단계: 다음부터 자동

```
다음 번에는:
AI: Google Cloud 콘솔에 접속할게.
(로그인 정보 있으니까 자동으로 됨)
```

### 💡 팁
- 로그인 정보는 Mac의 Keychain에 안전하게 저장
- 첫 로그인 후 다음부터는 자동
- 여러 사이트를 다룰 때 편리

---

## 일반 크롬과 동시에 쓰기 — "AI용 브라우저는 따로"

### 이런 상황일 때

```
AI가 자동으로 웹사이트를 만지고 있는데,
내가 일반 크롬에서 다른 일을 하고 싶을 때
```

### 문제

```
만약 같은 프로필을 쓰면:
[AI가 자동으로 클릭 중...]
[나는 일반 크롬을 사용...]
→ 서로 충돌! 문제 발생
```

### 해결법: Chromium 사용

AI는 Chromium (가벼운 브라우저) 사용
당신은 일반 Chrome 사용

```
AI의 브라우저: /Chromium (AI 전용)
당신의 브라우저: /Chrome (개인 용)
→ 충돌 없음!
```

### 💡 팁
- 당신은 Chrome 그대로 사용
- AI는 자동으로 Chromium 사용
- 따로 설정할 필요 없음

---

## 💡 실제 활용 예시 3가지

### 예시 1: 웹사이트 모니터링

```
AI한테:
매일 오전 9시에 우리 사이트 상태 확인해줘.
- 홈페이지 접속 가능?
- 로그인 버튼 작동?
- 결제 페이지 정상?
```

AI가 매일 자동으로:
1. 사이트 접속
2. 각 기능 확인
3. 문제 있으면 슬랙 알림 보내기

### 예시 2: 자동 배포 확인

```
AI한테:
배포 후에 자동으로:
1. 사이트 접속
2. 새로운 버튼이 보이나?
3. 스크린샷 찍어줄래?
```

AI가 해주는 것:
1. 배포 완료 대기
2. 자동 접속
3. 스크린샷 촬영
4. "배포 성공! 스크린샷 첨부"

### 예시 3: 경쟁사 모니터링

```
AI한테:
우리 경쟁사 사이트 매일 체크해줄래?
1. 스크린샷 찍기
2. 뭐 바뀐 게 있으면 알려주기
```

AI가 해주는 것:
1. 매일 경쟁사 사이트 방문
2. 스크린샷 촬영
3. 어제와 비교
4. "이 부분이 변경됐습니다"

---

## 설정이 필요해요

현재 설정:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@anthropic-ai/mcp-server-playwright"]
    }
  }
}
```

이미 설정되어 있으면 그냥 쓰면 됩니다.

---

## ⚠️ 주의사항

### 1️⃣ 로그인 정보 관리

```
✅ 좋은 방법:
- Mac Keychain에 저장
- 강한 비밀번호 사용
- 테스트 계정 별도 생성

❌ 위험한 방법:
- 실제 계정 비밀번호 직접 입력
- 평문으로 저장
```

### 2️⃣ 사이트 부하 주의

```
너무 자주 자동 클릭하면:
- 사이트 서버에 부하 증가
- 봇으로 탐지될 수 있음

좋은 습관:
- 필요한 만큼만 실행
- 시간 간격 두기
- 과도한 자동화 피하기
```

### 3️⃣ 개인정보 주의

```
절대 하면 안 됨:
- 실제 사용자의 이메일/비밀번호 입력
- 신용카드 정보 입력

대신:
- 테스트 계정 사용
- 테스트 데이터만 입력
```

---

## 💡 실천 팁

- ✅ 스크린샷은 `/design-review`와 함께 사용
- ✅ 로그인은 테스트 계정으로
- ✅ 자동화는 반복되는 작업부터
- ✅ 문제 발생 시 스크린샷으로 기록
- ❌ 실제 사용자 계정으로 테스트하지 말 것
- ❌ 사이트 부하를 무시하고 과도하게 자동화하지 말 것

---

## 다음 단계

[07-mcp-servers.md](07-mcp-servers.md)를 읽으면:
- AI에게 회사 시스템 접근 권한 주기
- GitHub, 데이터베이스, 웹 검색 자동화
- 외부 도구와 연결하는 법

을 배울 수 있습니다.

Playwright MCP를 통해 Claude가 브라우저를 제어할 수 있습니다.

### ~/.claude.json 설정

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@anthropic-ai/mcp-server-playwright"]
    }
  }
}
```

또는 글로벌 설치:

```bash
npm install -g @anthropic-ai/mcp-server-playwright
```

그 후:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "playwright-server"
    }
  }
}
```

## Chrome 프로필 유지로 로그인 세션 보존

매번 로그인하지 않으려면 Chrome 사용자 프로필을 유지합니다.

### 프로필 디렉토리 생성

```bash
mkdir -p ~/.claude-chrome-profile
```

### Claude 설정

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@anthropic-ai/mcp-server-playwright"],
      "env": {
        "PLAYWRIGHT_CHROME_USER_DATA_DIR": "/Users/[username]/.claude-chrome-profile"
      }
    }
  }
}
```

### 프로필 초기화

첫 실행 시 로그인하면 이후 세션에서 자동 유지됩니다.

```javascript
const page = await browser.newPage();
await page.goto('https://accounts.google.com');
// 브라우저 창에서 수동 로그인
// 자동으로 프로필에 저장됨
```

## Chrome vs Chromium 선택

| 브라우저 | 특징 | 선택 기준 |
|---------|------|---------|
| **Chrome** | 실제 Chrome 사용, 확장 프로그램 지원 | 실 환경 테스트, 복잡한 사이트 |
| **Chromium** | 가볍고 빠름, 격리됨 | CI/CD, 헤드리스 자동화 |

### Chrome 사용

```json
{
  "browser": "chrome",
  "browserArgs": ["--user-data-dir=/Users/[username]/.claude-chrome-profile"]
}
```

### Chromium 사용 (기본값)

```json
{
  "browser": "chromium"
}
```

## Google OAuth 로그인 자동화

### 1단계: 키체인에서 비밀번호 조회

macOS에서 저장된 비밀번호를 가져옵니다.

```bash
security find-generic-password -a "google-oauth" -w
```

또는 특정 계정:

```bash
security find-generic-password -a "kmse7@seobuk.kr" -w
```

### 2단계: Claude 설정에 환경 변수 설정

`.claude/settings.json`:

```json
{
  "env": {
    "GOOGLE_EMAIL": "kmse7@seobuk.kr",
    "GOOGLE_PASSWORD": "$(security find-generic-password -a kmse7@seobuk.kr -w)"
  }
}
```

### 3단계: OAuth 로그인 자동화 코드

```javascript
async function loginWithGoogle(page, email, password) {
  await page.goto('https://accounts.google.com/login');

  // 이메일 입력
  await page.fill('input[type="email"]', email);
  await page.click('#identifierNext');

  // 비밀번호 입력
  await page.waitForSelector('input[type="password"]');
  await page.fill('input[type="password"]', password);
  await page.click('#passwordNext');

  // 로그인 완료 대기
  await page.waitForNavigation();
  return page;
}
```

### 4단계: Playwright에서 실행

```javascript
const email = process.env.GOOGLE_EMAIL;
const password = process.env.GOOGLE_PASSWORD;

const page = await browser.newPage();
await loginWithGoogle(page, email, password);
```

## 스크린샷 캡처

### 기본 스크린샷

```javascript
await page.screenshot({ path: 'screenshot.png' });
```

### 전체 페이지 스크린샷

```javascript
await page.screenshot({
  path: 'full-page.png',
  fullPage: true
});
```

### 특정 요소만 스크린샷

```javascript
const element = await page.$('.modal');
await element.screenshot({ path: 'modal.png' });
```

### 디자인 리뷰 연동

스크린샷 후 즉시 리뷰 요청:

```bash
# 1. 스크린샷 생성
playwright screenshot https://myapp.com modal.png

# 2. 디자인 리뷰
/design-review
[modal.png 첨부]
이 모달 UX 개선점 찾아줄래?
```

## Chrome 147+ CDP 제한과 해결법

Chrome 147부터 CDP(Chrome DevTools Protocol)에 제한이 생겼습니다.

### 문제

```
Error: Chrome DevTools Protocol not available
```

### 해결: 별도 user-data-dir 사용

```bash
# 새로운 독립 프로필 생성
mkdir -p ~/.claude-chrome-isolated
```

`.claude/settings.json`:

```json
{
  "env": {
    "PLAYWRIGHT_CHROME_USER_DATA_DIR": "/Users/[username]/.claude-chrome-isolated"
  }
}
```

또는 Playwright 코드에서:

```javascript
const browser = await chromium.launch({
  args: [
    `--user-data-dir=/Users/[username]/.claude-chrome-isolated`,
    '--disable-blink-features=AutomationControlled'
  ]
});
```

## 일반 Chrome과 Playwright 동시 사용

Playwright와 일반 Chrome이 같은 프로필을 사용하면 잠금 발생합니다.

### 해결: Chromium 사용

Playwright에서는 Chromium을, 일반 브라우징은 Chrome 사용:

```json
{
  "browser": "chromium"
}
```

또는 강제:

```javascript
const browser = await chromium.launch();
```

### 또는 프로필 분리

```bash
# Playwright용 프로필
mkdir -p ~/.claude-chrome-profile
# 일반 Chrome
open /Applications/Google\ Chrome.app --args --user-data-dir=~/.chrome-personal
```

## 실용 예시: Google Cloud Console OAuth URI 추가

```javascript
// 1. 로그인
await page.goto('https://console.cloud.google.com');
await loginWithGoogle(page, process.env.GOOGLE_EMAIL, process.env.GOOGLE_PASSWORD);

// 2. OAuth 설정 페이지 이동
await page.goto('https://console.cloud.google.com/apis/credentials');

// 3. 수정 버튼 클릭
await page.click('text=Edit OAuth 2.0 Client ID');

// 4. URI 필드 찾기
const uriInput = await page.$('input[placeholder*="Redirect"]');

// 5. 새 URI 추가
const currentURI = await uriInput.inputValue();
const newURI = 'http://localhost:3000/callback';
await uriInput.fill(currentURI + '\n' + newURI);

// 6. 저장
await page.click('button:has-text("Save")');

// 7. 스크린샷으로 확인
await page.screenshot({ path: 'oauth-updated.png' });

console.log('OAuth URI added successfully');
```

## Playwright 팁

### 요소 대기

```javascript
// 요소 나타날 때까지 대기 (최대 30초)
await page.waitForSelector('.loading', { state: 'hidden' });

// 특정 텍스트 대기
await page.waitForFunction(() =>
  document.body.textContent.includes('Ready')
);

// 네트워크 요청 완료 대기
await page.waitForLoadState('networkidle');
```

### 네비게이션 대기

```javascript
// 클릭 후 페이지 로드 대기
await Promise.all([
  page.waitForNavigation(),
  page.click('a[href="/dashboard"]')
]);
```

### 여러 요소 처리

```javascript
const links = await page.$$('a[href^="/"]');
for (const link of links) {
  const text = await link.textContent();
  console.log(text);
}
```

## 정리

- **프로필 유지**: `--user-data-dir` 설정으로 세션 보존
- **OAuth 자동화**: 키체인에서 비밀번호 조회 → 자동 로그인
- **디자인 리뷰**: 스크린샷 캡처 후 `/design-review` 호출
- **Chrome 147+**: 별도 user-data-dir 사용
- **동시 사용**: Playwright는 Chromium, 일반 브라우징은 Chrome
