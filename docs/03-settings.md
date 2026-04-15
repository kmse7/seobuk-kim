# Settings.json 최적화

## 설정 파일 우선순위

Claude Code는 3단계 설정 체계를 사용합니다. 아래 순서대로 로드되며, 나중 파일이 이전 파일을 덮어씁니다.

1. **~/.claude/settings.json** (글로벌, 모든 프로젝트)
2. **.claude/settings.json** (프로젝트 수준)
3. **.claude/settings.local.json** (로컬, git 무시)

로컬 환경만의 설정(API 키, 개인 환경 변수)은 `.claude/settings.local.json`에 보관합니다.

## 권한 모드 (defaultMode)

권한 모드는 Claude가 위험한 작업(파일 쓰기, 셸 실행, 파일 삭제)을 어떻게 처리할지 결정합니다.

```json
{
  "defaultMode": "bypassPermissions"
}
```

| 모드 | 동작 | 사용 시점 |
|------|------|----------|
| **bypassPermissions** | 권한 요청 없이 작업 실행 | 신뢰하는 프로젝트, 자동화 스크립트 |
| **dontAsk** | 한 번 승인 후 세션 내 반복 |자주 같은 작업 반복 |
| **default** (기본값) | 매번 권한 요청 | 신규 프로젝트, 민감한 작업 |
| **plan** | 계획만 제시, 실행 안 함 | 검토 및 학습용 |

프로젝트 초기에는 `default`로 시작해 작업 패턴을 파악한 후 `bypassPermissions`으로 전환하는 것이 안전합니다.

## 환경 변수 (env)

```json
{
  "env": {
    "CLAUDE_MODEL": "claude-opus-4-1",
    "ENABLE_TOOL_SEARCH": "auto",
    "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "75"
  }
}
```

### 주요 환경 변수

| 변수 | 설명 | 예시 |
|------|------|------|
| CLAUDE_MODEL | 사용할 모델 | claude-opus-4-1, claude-3-5-sonnet |
| ENABLE_TOOL_SEARCH | MCP 도구 자동 로드 | auto (지연 로드), true, false |
| CLAUDE_AUTOCOMPACT_PCT_OVERRIDE | 자동 컴팩트 시점 (%) | 75 (75% 도달 시 컴팩트) |

## Hooks 설정

Hooks는 특정 이벤트에 자동 실행되는 스크립트입니다.

```json
{
  "hooks": {
    "PreCompact": [
      {
        "type": "shell",
        "command": "git status --short | head -20"
      }
    ],
    "PostToolUse": [
      {
        "type": "shell",
        "command": "echo 'Tool executed at $(date)'"
      }
    ]
  }
}
```

### 사용 가능한 Hooks

| Hook | 시점 | 용도 |
|------|------|------|
| **PreCompact** | 컨텍스트 컴팩트 전 | 작업 저장, 상태 확인, 파일 백업 |
| **PostToolUse** | 도구 실행 후 | 로깅, 캐시 정리, 알림 |
| **PreRun** | 세션 시작 | 환경 초기화, 의존성 확인 |
| **PostRun** | 세션 종료 | 정리, 리포트 생성 |

### 컨텍스트 보존 예시 (PreCompact)

세션 종료 전 중요 정보를 저장하도록 설정:

```json
{
  "hooks": {
    "PreCompact": [
      {
        "type": "shell",
        "command": "git diff --stat > /tmp/work-in-progress.txt && echo 'Changes saved to /tmp/work-in-progress.txt'"
      }
    ]
  }
}
```

## Statusline 커스텀

Claude Code 하단 상태 표시줄을 커스텀합니다.

```json
{
  "statusline": {
    "left": ["context-percent", "cost", "model"],
    "right": ["timer", "token-count"]
  }
}
```

| 항목 | 설명 |
|------|------|
| context-percent | 사용 중인 컨텍스트 비율 |
| cost | 누적 API 비용 |
| model | 현재 모델명 |
| timer | 세션 경과시간 |
| token-count | 현재 토큰 수 |

## Worktree Symlink 설정

git worktree를 사용할 때 각 워크트리마다 용량을 낭비하지 않도록 공유 디렉토리로 symlink 생성:

```json
{
  "worktreeSymlinks": {
    "node_modules": "../node_modules",
    ".venv": "../.venv",
    ".next": "../.next"
  }
}
```

프로젝트 루트에서:

```bash
ln -s ../node_modules node_modules
ln -s ../.venv .venv
```

이 설정으로 각 워크트리는 같은 `node_modules`을 참조하여 디스크 용량 절약.

## 자동 컴팩트 설정

컨텍스트 사용률이 지정 값에 도달하면 자동으로 컴팩트 실행:

```json
{
  "env": {
    "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "75"
  }
}
```

- `75`: 75% 도달 시 컴팩트
- `80`: 80% 도달 시 컴팩트 (기본값)
- `90`: 90% 도달 시 컴팩트 (더 극단적)

컨텍스트를 많이 사용하는 대형 프로젝트는 70-75%, 중소 프로젝트는 80-85%로 설정하는 것이 권장됩니다.

## 정리 주기 설정

오래된 임시 파일을 정기적으로 삭제합니다.

```json
{
  "cleanupPeriodDays": 7
}
```

`.claude/` 디렉토리 내 7일 이상 된 캐시 파일 자동 삭제.

## 최소 설정 예시 (권장)

```json
{
  "defaultMode": "bypassPermissions",
  "env": {
    "ENABLE_TOOL_SEARCH": "auto",
    "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "75"
  },
  "statusline": {
    "left": ["context-percent", "cost"]
  },
  "cleanupPeriodDays": 7,
  "hooks": {
    "PreCompact": [
      {
        "type": "shell",
        "command": "git status --short"
      }
    ]
  }
}
```

## 정리

- 글로벌 설정은 `~/.claude/settings.json`
- 프로젝트별 설정은 `.claude/settings.json`
- 로컬 비밀은 `.claude/settings.local.json`
- `defaultMode`는 프로젝트 신뢰도에 맞게 설정
- `ENABLE_TOOL_SEARCH: auto`로 MCP 도구 효율화
- PreCompact hook으로 컴팩트 전 상태 저장
