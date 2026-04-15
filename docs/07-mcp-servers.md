# MCP 서버 연결

## MCP란?

**MCP** (Model Context Protocol)는 Claude가 외부 서비스와 통신하는 표준 프로토콜입니다. Claude가 GitHub, 데이터베이스, 웹 검색, 라이브러리 문서 등에 직접 접근할 수 있게 해줍니다.

| 기능 | MCP 없이 | MCP 있이 |
|------|----------|---------|
| GitHub 접근 | 수동 복사/붙여넣기 | `gh` CLI 자동 실행 |
| DB 쿼리 | 직접 SQL 작성 | MCP로 실행 및 결과 확인 |
| 웹 검색 | 링크만 제시 | 실시간 검색 결과 조회 |
| 라이브러리 문서 | 메모리에 의존 | 최신 공식 문서 조회 |

## ~/.claude.json에 서버 추가

Claude의 홈 디렉토리에 설정 파일을 생성합니다.

```bash
cat > ~/.claude.json << 'EOF'
{
  "mcpServers": {
    "github": {
      "command": "gh",
      "args": ["api"]
    },
    "brave-search": {
      "command": "npx",
      "args": ["@brave/brave-search-mcp"]
    },
    "playwright": {
      "command": "npx",
      "args": ["@anthropic-ai/mcp-server-playwright"]
    }
  }
}
EOF
```

## 주요 MCP 서버 및 용도

### GitHub MCP

PR, Issue, 코드 검색 등을 직접 처리합니다.

**설정**:
```json
{
  "github": {
    "command": "gh",
    "args": ["api"]
  }
}
```

**사용 예**:
```
내 저장소에서 "auth" 이슈 모두 찾아줄래?
```

Claude가 자동으로 실행:
```bash
gh issue list --label auth
```

**주요 기능**:
- PR 생성/리뷰
- Issue 생성/관리
- 코드 검색
- 커밋 히스토리 조회

### Context7 MCP

라이브러리 공식 문서를 실시간 조회합니다.

**설정**:
```json
{
  "context7": {
    "command": "npx",
    "args": ["@anthropic-ai/mcp-server-context7"]
  }
}
```

**사용 예**:
```
React 18의 useEffect 클린업 함수 문서 보여줄래?
```

Claude가 자동으로 Context7 조회 후 최신 문서 제시.

**지원 라이브러리**:
- React, Vue, Angular
- Next.js, Remix, Svelte
- TypeScript, Node.js
- Django, Flask, FastAPI
- 수백 개 라이브러리 지원

### Brave Search MCP

웹 검색, 뉴스, 이미지, 비디오 검색을 수행합니다.

**설정**:
```json
{
  "brave-search": {
    "command": "npx",
    "args": ["@brave/brave-search-mcp"]
  }
}
```

**환경 변수** (API 키 필요):
```bash
export BRAVE_SEARCH_API_KEY="your-api-key"
```

**사용 예**:
```
Claude 4 출시 뉴스 찾아줄래?
```

**지원 검색**:
- `brave_web_search`: 웹 페이지
- `brave_news_search`: 뉴스
- `brave_image_search`: 이미지
- `brave_video_search`: 비디오
- `brave_local_search`: 지역 비즈니스

### DBHub MCP

MySQL, PostgreSQL 등 데이터베이스 쿼리를 직접 실행합니다.

**설정**:
```json
{
  "dbhub": {
    "command": "npx",
    "args": ["@anthropic-ai/mcp-server-dbhub"]
  }
}
```

**환경 변수**:
```bash
export DBHUB_API_KEY="your-api-key"
export DATABASE_URL="postgresql://user:pass@localhost/dbname"
```

**사용 예**:
```
지난 달 판매액이 가장 높은 상품 top 5 찾아줄래?
```

Claude가 자동으로 SQL 작성 → 실행 → 결과 분석.

**주의: 좀비 프로세스 해결**

DBHub 사용 후 좀비 npx 프로세스가 남을 수 있습니다.

해결법:

```bash
# 좀비 프로세스 확인
ps aux | grep npx

# 강제 종료
killall -9 npx
```

또는 글로벌 설치로 회피:

```bash
npm install -g @anthropic-ai/mcp-server-dbhub
```

```json
{
  "dbhub": {
    "command": "dbhub-server"
  }
}
```

### Linear MCP

Linear 이슈 트래커와 통합합니다.

**설정**:
```json
{
  "linear": {
    "command": "npx",
    "args": ["@anthropic-ai/mcp-server-linear"]
  }
}
```

**환경 변수**:
```bash
export LINEAR_API_KEY="your-linear-api-key"
```

**사용 예**:
```
이번 스프린트 오픈된 이슈 모두 보여줄래?
```

**주요 기능**:
- Issue 생성/조회/업데이트
- 팀별 이슈 필터링
- 스프린트 관리

### Confluence MCP

사내 Confluence 문서에 접근합니다.

**설정**:
```json
{
  "confluence": {
    "command": "npx",
    "args": ["@anthropic-ai/mcp-server-confluence"]
  }
}
```

**환경 변수**:
```bash
export CONFLUENCE_URL="https://company.atlassian.net/wiki"
export CONFLUENCE_EMAIL="user@company.com"
export CONFLUENCE_API_TOKEN="your-api-token"
```

**사용 예**:
```
온보딩 문서에서 개발 환경 셋업 부분 찾아줄래?
```

### Playwright MCP

브라우저 자동화를 수행합니다. (별도 섹션 참고)

**설정**:
```json
{
  "playwright": {
    "command": "npx",
    "args": ["@anthropic-ai/mcp-server-playwright"]
  }
}
```

## ToolSearch로 자동 탐색

MCP 도구를 동적으로 탐색하고 로드합니다.

**.claude/settings.json**:
```json
{
  "env": {
    "ENABLE_TOOL_SEARCH": "auto"
  }
}
```

| 값 | 동작 |
|-----|------|
| **auto** | 필요할 때 지연 로드, 메모리 효율적 |
| **true** | 세션 시작 시 모든 도구 로드 |
| **false** | 자동 탐색 비활성화 |

`auto` 권장: 성능 + 유연성 최적화.

## npx vs 글로벌 설치

| 방식 | 장점 | 단점 |
|------|------|------|
| **npx** (기본) | 프로젝트 버전 관리, 격리 | 느림, 좀비 프로세스 가능 |
| **글로벌** | 빠름, 안정적 | 버전 관리 어려움 |

### npx (기본)

```json
{
  "github": {
    "command": "npx",
    "args": ["@octokit/cli", "api"]
  }
}
```

### 글로벌 설치

```bash
npm install -g @octokit/cli
```

```json
{
  "github": {
    "command": "github-api"
  }
}
```

### DBHub 좀비 문제 해결

DBHub은 반드시 글로벌 설치 권장:

```bash
npm install -g @anthropic-ai/mcp-server-dbhub
```

```json
{
  "dbhub": {
    "command": "dbhub-server"
  }
}
```

## 트러블슈팅: MCP 서버 안 뜰 때

### 1단계: 설정 파일 확인

```bash
cat ~/.claude.json
```

JSON 문법 검증:

```bash
jq . ~/.claude.json
```

### 2단계: 서버 직접 실행 테스트

```bash
# npx 기반
npx @anthropic-ai/mcp-server-github help

# 글로벌 설치 기반
github-server --version
```

### 3단계: 권한 확인

```bash
# 실행 가능한지 확인
which npx
which github-server

# 권한 부여 (필요 시)
chmod +x ~/.node_modules/bin/github-server
```

### 4단계: Claude 로그 확인

Claude의 오류 로그를 확인합니다.

```bash
tail -50 ~/.claude/logs/mcp.log
```

### 5단계: MCP 서버 재시작

```bash
# Claude 재시작
killall Claude

# 서비스 프로세스 정리
ps aux | grep mcp
killall -9 npx  # 필요 시
```

## 전체 설정 예시

```json
{
  "mcpServers": {
    "github": {
      "command": "gh",
      "args": ["api"]
    },
    "context7": {
      "command": "npx",
      "args": ["@anthropic-ai/mcp-server-context7"]
    },
    "brave-search": {
      "command": "npx",
      "args": ["@brave/brave-search-mcp"]
    },
    "dbhub": {
      "command": "dbhub-server"
    },
    "linear": {
      "command": "npx",
      "args": ["@anthropic-ai/mcp-server-linear"]
    },
    "playwright": {
      "command": "npx",
      "args": ["@anthropic-ai/mcp-server-playwright"]
    }
  }
}
```

## 정리

- **MCP**: Claude가 외부 서비스에 접근하는 표준 프로토콜
- **주요 서버**: GitHub, Context7, Brave Search, DBHub, Linear, Confluence, Playwright
- **ToolSearch**: `ENABLE_TOOL_SEARCH=auto`로 지연 로드
- **npx vs 글로벌**: DBHub, Playwright 같은 복잡한 도구는 글로벌 설치 추천
- **좀비 프로세스**: `killall -9 npx`로 정리
- **트러블슈팅**: 설정 파일 검증 → 직접 실행 테스트 → 로그 확인
