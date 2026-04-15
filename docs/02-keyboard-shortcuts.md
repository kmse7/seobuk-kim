# Claude Code 키보드 단축키 & Shell 설정

Claude Code를 더 빠르게 사용하기 위한 필수 단축키와 권장 설정을 정리합니다.

## 필수 키보드 단축키

Claude Code는 표준 터미널 단축키를 따릅니다.

| 단축키 | 동작 | 사용 시기 |
|--------|------|----------|
| `Escape` | 현재 입력 취소 | 길게 작성한 메시지 버림 |
| `Ctrl+C` | 현재 AI 응답 중단 | 길어지는 답변을 멈추고 싶을 때 |
| `Ctrl+D` | Claude Code 종료 | 세션 빠져나가기 (또는 `/exit`) |
| `Tab` | 자동완성 (파일명, 명령어) | 파일 경로 자동 완성 |
| `Up Arrow` | 이전 메시지 재호출 | 같은 질문 다시 입력 |
| `Down Arrow` | 다음 메시지 (히스토리 탐색) | 이전 메시지들 되돌리기 |
| `Ctrl+A` | 라인 시작으로 커서 이동 | 긴 메시지 처음부터 수정 |
| `Ctrl+E` | 라인 끝으로 커서 이동 | 마지막 부분 수정 |
| `Ctrl+U` | 현재 라인 전체 삭제 | 처음부터 다시 작성 |
| `Ctrl+L` | 화면 정리 | 스크롤 올리기 힘들 때 |

## Shell Alias 설정

자주 사용하는 명령어를 단축하는 별칭(alias)을 등록합니다.

### .zshrc에 추가

```bash
# ~/.zshrc 또는 ~/.bashrc에 추가

# 기본 단축키
alias cc="claude"
alias ccp="claude -p"              # non-interactive 모드
alias ccr="claude --resume latest" # 마지막 세션 재개
alias ccs="claude --status"        # 현재 상태 확인

# 특정 모드로 실행
alias ccd="claude --mode default"      # 승인 요청 (기본값)
alias cca="claude --mode acceptEdits"  # 자동 적용
alias ccp="claude --mode plan"         # 계획 모드 (읽기만)

# 프로젝트별 단축키
alias cc-web="cd ~/projects/web && claude"
alias cc-api="cd ~/projects/api && claude"

# 유용한 조합
alias ccx="claude --clear-context"  # 컨텍스트 초기화 후 시작
```

적용:

```bash
source ~/.zshrc
# 또는 터미널 재시작
```

### 자주 쓰는 패턴

```bash
# 빠른 검색
cc "Find all database queries in src/"

# 파일 읽기 후 질문
cc "Read src/app.js and explain the main flow"

# 테스트 실행
cc "Run npm test and fix any failures"

# 특정 폴더에서 세션 시작
cd ~/projects/mobile && cc
```

## tmux와 함께 사용하기

Claude Code는 터미널에서 동작하므로 tmux와 완벽하게 호환됩니다.

### tmux 기본 사용

Claude Code 세션과 다른 터미널 작업을 동시에 진행합니다.

```bash
# tmux 세션 시작
tmux new-session -s claude

# Claude Code 실행
claude
```

다른 창에서:

```bash
# 새 창 열기 (기존 세션 내)
tmux new-window -t claude

# 기존 세션 접속
tmux attach -t claude
```

### Claude Code와 터미널 함께 사용

Claude Code의 대화와 별도로 직접 명령어를 실행하려면:

```bash
# 기본: Claude Code가 메인 창
tmux new-window -t claude  # 새 창에서 다른 작업 수행
```

예시:

```
[창 1] Claude Code 세션
> Build artifacts using new database schema

[창 2] 실제 터미널
$ npm run build
$ npm test
$ git status
```

### 추천 tmux 설정

`~/.tmux.conf` 추가:

```bash
# 기본 접두사 변경 (선택사항)
set -g prefix C-b

# 새 창/패인 현재 경로에서 열기
bind c new-window -c "#{pane_current_path}"
bind - split-window -h -c "#{pane_current_path}"
bind _ split-window -v -c "#{pane_current_path}"

# 마우스 지원 (선택사항)
set -g mouse on

# 색상 지원
set -g default-terminal "screen-256color"
```

적용:

```bash
tmux source-file ~/.tmux.conf
```

## 권장 .zshrc 설정

Claude Code 사용 경험을 개선하는 .zshrc 설정:

```bash
# ~/.zshrc

# ============ Claude Code 설정 ============

# 별칭
alias cc="claude"
alias ccr="claude --resume latest"
alias ccp="claude -p"

# Claude Code가 기본 모드로 시작되도록
export CLAUDE_MODE="default"

# 프롬프트에 현재 프로젝트명 표시 (선택사항)
function prompt_claude_status() {
  if [ -f "package.json" ] || [ -f "go.mod" ] || [ -f "Cargo.toml" ]; then
    echo "($(basename $PWD)) "
  fi
}

# 프롬프트 커스터마이징
PROMPT='$(prompt_claude_status)%n@%m:%c$ '

# ============ 일반 터미널 설정 ============

# Vi 모드 (vi 스타일 키 바인딩)
bindkey -v

# History 설정
HISTFILE=~/.zsh_history
HISTSIZE=10000
SAVEHIST=10000
setopt SHARE_HISTORY

# 자동완성
autoload -Uz compinit && compinit

# 편리한 cd
setopt AUTO_CD

# Globbing 개선
setopt EXTENDED_GLOB
```

적용:

```bash
source ~/.zshrc
```

## 터미널 생산성 팁

### Claude Code + 에디터 병행

Claude Code와 IDE를 동시에 열어두면:

1. Claude Code에서 코드 제안 받음
2. IDE에서 실시간 테스트
3. 피드백을 Claude Code에 전달

```bash
# IDE와 Claude Code 동시 실행
code ~/my-project &
sleep 2
claude
```

### 빠른 테스트-수정 루프

```bash
# 창 1: Claude Code
$ cc
> Fix the failing test in src/math.test.js

# 창 2: 실제 테스트 실행
$ npm test -- --watch
```

Claude Code가 수정을 제안하면, 창 2의 watch 모드에서 즉시 테스트 결과 확인.

### Claude Code 히스토리 재사용

지난 세션 다시 열기:

```bash
claude --resume latest      # 마지막 세션
claude --resume <session-id> # 특정 세션 (session-id 확인 필요)
```

또는 alias 사용:

```bash
ccr
```

## 문제 해결

### 긴 응답이 끝나지 않을 때

```
Ctrl+C  # Claude Code의 응답 중단
```

그 후:

```
/clear  # 컨텍스트 초기화하고 다시 시작
```

### 터미널이 깨졌을 때

```bash
reset  # 터미널 상태 복구
```

또는:

```bash
Ctrl+L  # Claude Code 내에서 화면 정리
```

### 파일 경로 자동완성 안 될 때

```bash
# Tab 키가 먹지 않으면 수동으로 경로 입력
Read ./src/components/Button.tsx

# 또는 전체 경로 사용
Read /Users/username/projects/app/src/app.js
```

## 다음 단계

- [00-quickstart.md](00-quickstart.md) - 설치 및 기본 사용법
- [01-basic-usage.md](01-basic-usage.md) - 파일 작업, 코드 질문, 검색
