# cmux: 멀티세션 워크스페이스 가이드

## cmux란?

Claude Multiplexer (cmux)는 한 개의 Claude Code 인스턴스에서 여러 독립적인 세션을 동시에 관리한다. tmux 기반으로 프로젝트별, 기능별 세션을 분리하여 컨텍스트 오염을 방지한다.

### 핵심 이점

- **컨텍스트 격리**: 각 세션이 독립적인 메모리 공간 사용
- **병렬 작업**: 프로젝트 A 배포 중에 프로젝트 B 개발
- **세션 보존**: 연결 끊어도 백그라운드에서 실행 유지
- **협업 가능**: tmux send-keys로 세션 간 명령 전달

---

## 설치 및 세팅

### 1. 사전 설치

```bash
# macOS
brew install tmux mosh

# Linux (Ubuntu/Debian)
sudo apt-get install tmux mosh

# Linux (CentOS/RHEL)
sudo yum install tmux mosh
```

### 2. Claude Code 워크스페이스 초기화

```
/setup-workspace
```

대화형 프롬프트:
- 프로젝트 이름 (photoism, settle, card 등)
- 세션 구조 선택 (프로젝트별 vs 기능별)
- 에이전트 수 (몇 개 워커가 필요한가)

결과:
```
.cmux/
├── tmux.conf
├── sessions.json
└── scripts/
    ├── start.sh
    ├── attach.sh
    └── kill.sh
```

---

## tmux 세션 구성 패턴

### 패턴 1: 프로젝트별 세션

각 프로젝트가 독립적인 세션을 가짐.

```
cmux sessions:

photoism
├── window 0: main dev
├── window 1: tests
└── window 2: deployment

settle
├── window 0: api dev
├── window 1: db migration
└── window 2: monitoring

card
├── window 0: frontend
├── window 1: backend
└── window 2: infra
```

### 패턴 2: 기능별 세션

한 프로젝트 내에서 역할별 세션 분리.

```
photoism-frontend
├── dev environment
└── test runner

photoism-backend
├── api server
├── worker jobs
└── db operations

photoism-devops
├── CI/CD logs
├── monitoring
└── incident response
```

### 추천 구성

```
# 중소 팀 (프로젝트 2-3개)
프로젝트별 세션 + 프로젝트 내 기능별 윈도우

# 대규모 팀 (프로젝트 5개 이상)
기능별 세션 (역할 분담)
```

---

## tmux 필수 명령어

### 세션 관리

```bash
# 모든 세션 확인
tmux list-sessions

# 특정 세션 접속
tmux attach-session -t photoism
tmux attach -t photoism  # 단축형

# 세션 나가기 (백그라운드 유지)
Ctrl+B D  # detach

# 세션 종료
tmux kill-session -t photoism

# 모든 세션 종료
tmux kill-server
```

### 윈도우 관리

```bash
# 윈도우 목록 (세션 내)
Ctrl+B W

# 새 윈도우
Ctrl+B C

# 윈도우 이동
Ctrl+B 0  # 윈도우 0 (번호 기반)
Ctrl+B N  # next
Ctrl+B P  # previous

# 윈도우 이름 변경
Ctrl+B ,
# 프롬프트에 새 이름 입력

# 윈도우 종료
Ctrl+B X
```

### 명령 전송

```bash
# 특정 세션의 특정 윈도우에 명령 전송
tmux send-keys -t photoism:0 "npm run dev" Enter

# 세션의 모든 윈도우에 명령 전송
tmux send-keys -t settle "git pull origin main" Enter

# 현재 윈도우 동기화 (모든 파인에 동시 입력)
Ctrl+B :
# 프롬프트에: set synchronize-panes
```

### 화면 분할

```bash
# 수평 분할
Ctrl+B "

# 수직 분할
Ctrl+B %

# 분할 영역 이동
Ctrl+B O  # next pane
Ctrl+B ;  # toggle last pane

# 분할 영역 크기 조정
Ctrl+B Ctrl+Up/Down/Left/Right
```

---

## tmux 세션 간 메시지 전달

프로젝트 간 정보 공유나 수동 트리거가 필요할 때 사용.

### 사례 1: API 배포 완료 후 프론트엔드 배포

```bash
# API 세션에서 배포 완료
# → 프론트 세션에 신호 전달

tmux send-keys -t photoism-frontend:0 "npm run build:prod" Enter

# 또는 스크립트로 자동화
scripts/deploy-after-api.sh
```

### 사례 2: DB 마이그레이션 후 API 재시작

```bash
# 마이그레이션 세션이 완료되면
# → API 워커를 재시작

tmux send-keys -t settle-api:0 "npm restart" Enter

# 확인 명령
tmux capture-pane -t settle-api:0 -p | tail -20
```

### 사례 3: 모니터링 세션에서 이상 감지 후 즉시 action

```bash
# monitoring 세션에서 에러율 급증 감지
# → devops 세션에 알림 + 명령 실행

tmux send-keys -t card-devops:0 "kubectl get pods -n production" Enter
tmux send-keys -t card-devops:0 "kubectl logs -f deployment/api -n production" Enter
```

### send-keys 스크립트 예

```bash
#!/bin/bash
# scripts/cross-session-trigger.sh

SESSION_NAME=$1
WINDOW=$2
COMMAND=$3

tmux send-keys -t ${SESSION_NAME}:${WINDOW} "${COMMAND}" Enter

# 로그 확인
sleep 2
tmux capture-pane -t ${SESSION_NAME}:${WINDOW} -p
```

사용법:
```bash
./cross-session-trigger.sh photoism 0 "npm run build"
```

---

## mosh + tmux 조합 (모바일 접속)

SSH 연결이 끊어져도 세션이 유지되는 조합.

### 원격 서버 세팅

```bash
# 서버에 mosh 설치
sudo apt-get install mosh

# mosh 포트 열기 (기본: 60000-61000)
sudo ufw allow 60000:61000/udp
```

### 로컬에서 접속

```bash
# SSH 대신 mosh 사용
mosh user@remote-server

# 연결 후 tmux 시작
tmux attach -t photoism

# 또는 한 줄로
mosh user@remote-server -- tmux attach -t photoism
```

### 네트워크 끊김 처리

mosh는 자동으로 재연결 시도. 연결이 오래 끊기면:

```bash
# 로컬 환경 변수 확인
echo $MOSH_KEY

# 서버의 좀비 mosh 세션 정리
ps aux | grep mosh
kill -9 <PID>

# 다시 접속
mosh user@remote-server
```

---

## 세션 관리 팁

### 좀비 세션 정리

```bash
# 응답 없는 세션 확인
tmux list-sessions

# 응답 없는 세션 강제 종료
tmux kill-session -t dead-session

# 모든 데드 세션 자동 정리 (주기적 실행)
for session in $(tmux list-sessions -F "#{session_name}"); do
  tmux send-keys -t "$session" "" 2>/dev/null || tmux kill-session -t "$session"
done
```

### 세션 자동 시작

.cmux/scripts/startup.sh:

```bash
#!/bin/bash

# 세션 존재 여부 확인
check_session() {
  tmux list-sessions -F "#{session_name}" | grep -q "^$1$"
}

# photoism 프로젝트
if ! check_session "photoism"; then
  tmux new-session -d -s photoism -x 120 -y 40
  tmux send-keys -t photoism "cd ~/projects/photoism" Enter
  tmux new-window -t photoism -n dev
  tmux new-window -t photoism -n test
fi

# settle 프로젝트
if ! check_session "settle"; then
  tmux new-session -d -s settle
  tmux send-keys -t settle "cd ~/projects/settle" Enter
  tmux new-window -t settle -n api
  tmux new-window -t settle -n db
fi

echo "Sessions started"
```

실행:
```bash
chmod +x .cmux/scripts/startup.sh
./.cmux/scripts/startup.sh
```

### 세션 설정 저장/복원

tmux.conf:

```conf
# 세션 저장 경로
set-option -g default-shell /bin/zsh

# 윈도우 번호 1부터 시작
set -g base-index 1

# 마우스 활성화
set -g mouse on

# 색상
set -g default-terminal "screen-256color"

# 상태바 커스터마이징
set -g status-bg black
set -g status-fg white
set -g status-right "#(date '+%H:%M') | #(whoami)@#(hostname)"
```

---

## mosh 좀비 세션 정리

### 문제: mosh가 응답 불가 상태

```
Mosh did not make progress sending packets
```

### 원인

- 오래된 mosh 연결이 남아있음
- 네트워크 인터페이스 변화 (Wi-Fi → 4G)
- mosh 서버 데몬이 죽음

### 해결

```bash
# 1. 로컬 mosh 프로세스 확인
ps aux | grep mosh

# 2. 서버의 mosh 데몬 정리
ssh user@remote-server "pkill -9 mosh-server"

# 3. 환경 변수 초기화 (로컬)
unset MOSH_KEY MOSH_PREDICTION

# 4. 다시 접속
mosh user@remote-server
```

### 예방

환경 변수 설정:

```bash
# ~/.bashrc 또는 ~/.zshrc
export MOSH_SERVER_NETWORK_TMOUT=86400  # 24시간
export MOSH_CLIENT_NETWORK_TMOUT=60     # 60초
```

---

## 실전 예제

### 예제 1: 프로젝트별 일일 세팅

```bash
# morning-routine.sh
#!/bin/bash

# 기존 세션 정리
tmux kill-server 2>/dev/null

# 새 세션 시작
tmux new-session -d -s photoism -c ~/projects/photoism
tmux new-session -d -s settle -c ~/projects/settle

# 개발 환경 시작
tmux send-keys -t photoism "npm run dev" Enter
tmux send-keys -t settle "npm run dev" Enter

# 테스트 윈도우
tmux new-window -t photoism -n test -c ~/projects/photoism
tmux new-window -t settle -n test -c ~/projects/settle

echo "Ready to work!"
```

실행:
```bash
chmod +x morning-routine.sh
./morning-routine.sh

# 세션 확인
tmux list-sessions

# photoism 접속
tmux attach -t photoism
```

### 예제 2: CI/CD 모니터링

```bash
# monitor-ci.sh
SESSION="ci-monitor"

tmux new-session -d -s $SESSION

# GitHub Actions 로그 스트리밍
tmux send-keys -t $SESSION "watch -n 5 'gh run list --repo myorg/myrepo --limit 10'" Enter

# 새 윈도우: 배포 상태
tmux new-window -t $SESSION -n deploy
tmux send-keys -t $SESSION:deploy "kubectl get deployment -A --watch" Enter

echo "CI monitoring started at $(date)"
```

### 예제 3: 원격 디버깅 세션

```bash
# remote-debug.sh
REMOTE="user@prod-server"

# 로컬 tmux 세션
tmux new-session -d -s debug

# pane 1: 서버 로그
tmux send-keys -t debug "mosh $REMOTE -- tail -f /var/log/app.log" Enter

# pane 2: 서버 상태
tmux new-window -t debug -n status
tmux send-keys -t debug:status "mosh $REMOTE -- htop" Enter

# pane 3: 수동 명령
tmux new-window -t debug -n shell
tmux send-keys -t debug:shell "mosh $REMOTE" Enter

echo "Debug session ready"
tmux attach -t debug
```

---

## 팁

1. **정기적으로 정리**: 주 1회 `tmux kill-server`로 좀비 세션 제거
2. **명확한 윈도우 이름**: "dev", "test", "deploy" 같이 구체적으로
3. **send-keys 동기화**: `synchronize-panes` 활성화하면 한 번에 여러 윈도우에 명령 가능
4. **mosh는 네트워크 변화에 강함**: Wi-Fi 켜기/끄기, 모바일 토글해도 연결 유지
