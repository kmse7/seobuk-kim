# Playwright 브라우저 자동화

## Playwright MCP 설정

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
