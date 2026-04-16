# 더 빠르게 쓰는 법 — 단축키와 편의 설정

Claude Code를 더 빨리 쓰려면 손가락이 움직이지 않아야 합니다. 이 장에서 그 방법을 배웁니다.

---

## 꼭 알아야 할 단축키 5개

이 단축키들은 거의 모든 컴퓨터의 **터미널**(글자로 명령하는 검은 화면)에서 같습니다.

| 단축키 | 뜻 | 언제 쓰나 |
|--------|------|----------|
| **Escape** | 지금 입력한 것 취소 | 길게 작성한 질문이 마음에 안 들 때 |
| **Ctrl + C** | AI의 답변 중단 | 답변이 너무 길어질 때, 뭔가 잘못됐을 때 |
| **Ctrl + D** | Claude Code 종료 | 일을 다 끝낼 때 (`/exit`와 같음) |
| **Tab** | 자동 완성 | 파일 경로를 자동으로 채우고 싶을 때 |
| **↑ 화살표** | 이전에 쓴 질문 다시 불러오기 | 같은 질문을 또 하고 싶을 때 |

### 단축키 사용 예시

**답변이 길어질 때 멈추기:**

```
Ctrl + C
```

→ AI가 말하던 것을 멈춤

**파일 경로 자동완성:**

터미널에:

```
read src/com
```

입력한 후 → `Tab` 누르기 → 자동으로 `src/components/`로 완성

**이전 질문 다시 하기:**

`↑` 화살표 눌러서 이전 질문 찾기 → 엔터

---

## 자주 쓰는 명령어 줄이기

### 문제: 매번 긴 명령어 치기 귀찮음

매번 이렇게 입력하는 게 싫다면?

```bash
claude --mode plan
```

### 해결법: 단축 명령 만들기 (alias)

**alias**(별칭)란? 자주 쓰는 명령어를 짧게 줄인 것입니다.

예를 들어, `claude`를 `cc`로 줄일 수 있습니다.

### Mac에서 설정하기

1. 터미널 열기
2. 이 명령어 입력:

```bash
nano ~/.zshrc
```

3. 맨 아래에 이 코드 추가:

```bash
# ========== Claude Code 단축키 ==========
alias cc="claude"
alias ccp="claude --mode plan"
alias cca="claude --mode acceptEdits"
```

4. `Ctrl + X` → `Y` → `Enter` 눌러서 저장

5. 터미널 재시작 또는:

```bash
source ~/.zshrc
```

### 이제 이렇게 쓸 수 있음

짧은 명령어로 실행:

```bash
cc                  # claude와 같음
ccp                 # claude --mode plan과 같음
cca                 # claude --mode acceptEdits와 같음
```

### Windows에서 설정하기

Windows는 다른 방식입니다.

1. **Windows 검색** → "환경 변수" 입력
2. "환경 변수 편집" 클릭
3. "새로 만들기" → 변수 이름: `CC_ALIAS` → 변수 값: `claude`
4. 명령 프롬프트 재시작

하지만 Windows에서는 조금 더 복잡해서, **이 방법보다는 파워셸 프로필 수정**을 권장합니다. (고급 사용자용)

---

## 여러 작업을 동시에 하기

### 문제: Claude Code를 쓰면서 다른 터미널 명령도 실행하고 싶음

예를 들어:

- 왼쪽 창: Claude Code가 코드 수정 중
- 오른쪽 창: 나는 `npm test` 실행 중

### 해결법: **tmux** 사용하기

**tmux**를 쉽게 설명하면 "**브라우저 탭처럼 터미널 창을 여러 개 띄우는 것**"입니다.

#### tmux 설치

Mac:

```bash
brew install tmux
```

Windows (WSL 필요):

```bash
sudo apt install tmux
```

#### tmux 사용법

**새 tmux 세션 시작:**

```bash
tmux new-session -s claude
```

→ 특별한 터미널 창 실행됨

**Claude Code 실행:**

```bash
claude
```

**다른 창 열기 (Claude가 실행 중인 상태에서):**

새 터미널에서:

```bash
tmux new-window -t claude
```

→ 같은 세션 내에서 새로운 창 열림

**창 전환하기:**

- `Ctrl + B` → `N` → 다음 창
- `Ctrl + B` → `P` → 이전 창
- `Ctrl + B` → `숫자` → 특정 창 (0, 1, 2...)

### 실제 예시

```
[창 1] Claude Code
> 로그인 기능 수정 중...

[창 2] 터미널
$ npm test          # 테스트 돌려보기
$ git status        # 변경사항 확인
```

Claude가 수정하는 동안 창 2에서 테스트를 실시간으로 돌릴 수 있습니다!

---

## 와이파이가 바뀌어도 끊기지 않는 원격 접속

### 문제: 회의실 이동했는데 연결 끊김

카페에서 회사로 이동할 때, 와이파이가 바뀌면서 원격 접속(예: AWS EC2 서버)이 끊어질 수 있습니다.

### 해결법: **mosh** 사용하기

**mosh**(Mobile Shell)는 "**와이파이가 바뀌어도 끊기지 않는 원격 접속**"입니다.

#### mosh 설치

Mac:

```bash
brew install mosh
```

Linux:

```bash
sudo apt install mosh
```

#### mosh 사용법

일반 SSH 대신:

```bash
ssh user@example.com
```

이렇게 하기:

```bash
mosh user@example.com
```

→ 와이파이가 바뀌어도 **자동으로 재연결됨**

❌ 주의: 서버에도 mosh가 설치되어 있어야 합니다.

---

## Windows 사용자 안내

위의 설정들(alias, tmux, mosh)은 **주로 Mac/Linux 기준**입니다.

Windows는 조금 다릅니다. 선택지는:

| 선택지 | 난이도 | 추천 |
|--------|--------|------|
| **그냥 Claude Code만 쓰기** | ⭐ 쉬움 | 처음 사용자 |
| **PowerShell 별칭 설정** | ⭐⭐ 중간 | 단축키가 필요할 때 |
| **WSL(Windows Subsystem for Linux) 설치** | ⭐⭐⭐ 어려움 | tmux/mosh 쓰고 싶을 때 |

### Windows에서 PowerShell 별칭 설정하기

1. **PowerShell 관리자 권한으로 열기**
2. 프로필 만들기:

```powershell
if (!(Test-Path $PROFILE)) { New-Item -ItemType File -Path $PROFILE -Force }
```

3. 프로필 편집:

```powershell
notepad $PROFILE
```

4. 아래 추가:

```powershell
Set-Alias -Name cc -Value claude
```

5. 저장 후 PowerShell 재시작

---

## 💡 추가 팁

### 빠른 테스트-수정 루프

```
[창 1] Claude Code에서:
> src/math.test.js의 실패한 테스트 고쳐줄 수 있어?

[창 2] 동시에 터미널에서:
$ npm test -- --watch
```

Claude가 수정 중일 때, 창 2의 watch 모드가 자동으로 **실시간 테스트 결과**를 보여줍니다!

### 이전 세션 다시 열기

Claude Code를 끝냈다가 다시 같은 대화를 계속하고 싶을 때:

```bash
claude --resume latest
```

또는 alias를 추가했다면:

```bash
alias ccr="claude --resume latest"
```

입력 후:

```bash
ccr
```

---

## 문제 해결

### 문제: 답변이 너무 길어서 끝나지 않음

```
Ctrl + C
```

→ 답변 중단

그 다음:

```
/clear
```

→ 대화 초기화하고 다시 시작

### 문제: 터미널이 깨진 것 같음 (글자가 이상함)

```bash
reset
```

또는 Claude Code 내에서:

```
Ctrl + L
```

→ 화면 정리

### 문제: Tab으로 자동완성이 안 됨

파일 경로를 수동으로 입력하기:

```
read ./src/components/Button.tsx
```

또는 전체 경로 사용:

```
read /Users/username/projects/myapp/src/app.js
```

### 문제: tmux 창이 복잡해짐

현재 세션 끝내기:

```bash
tmux kill-session -t claude
```

새로 시작하기:

```bash
tmux new-session -s claude
```

---

## 정리: 꼭 기억할 것

✅ **필수:**
- `Escape` — 입력 취소
- `Ctrl + C` — 답변 중단
- `Tab` — 파일 경로 자동완성

✅ **편하게:**
- alias로 명령어 줄이기
- tmux로 여러 창 띄우기

✅ **고급:**
- mosh로 안정적인 원격 접속
- `/resume latest`로 이전 대화 이어가기

---

## 다음 단계

- [00-quickstart.md](00-quickstart.md) — 기본부터 다시 확인
- [01-basic-usage.md](01-basic-usage.md) — 상황별 활용법
