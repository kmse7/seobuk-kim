# 여러 프로젝트를 동시에 관리하기 — 멀티세션

## 이게 뭔가요?

브라우저에서 탭을 여러 개 띄우는 것처럼, AI 대화창을 여러 개 띄우는 것입니다.

### 왜 필요한가요?

일반적인 상황:
- 프로젝트 A를 열심히 작업 중
- 갑자기 프로젝트 B에서 긴급 버그 발생
- B를 빨리 처리하고 다시 A로 돌아가고 싶음

**안 되는 방법:**
```
프로젝트 A에서 /clear 하고 B 작업
→ A에서 하던 작업 진행상황 다 잃음
→ 귀찮음
```

**좋은 방법 (멀티세션):**
```
프로젝트 A 세션 열어두고
프로젝트 B 새 세션으로 따로 열기
→ 필요할 때 왔다갔다 하기
→ 진행상황 다 유지됨
```

**비유**:
- 노트북 여러 권을 동시에 펼쳐놓는 것
- 탭을 여러 개 띄우고 필요할 때 클릭해서 전환하는 것

---

## 언제 쓰나요?

| 상황 | 멀티세션 | 필요 이유 |
|------|---------|---------|
| 한 프로젝트만 작업 | 불필요 | 한 세션으로 충분 |
| A 프로젝트 + B 프로젝트 | **필수** | 오갈 때마다 /clear 하기 싫음 |
| A + B + C 3개 이상 | **매우 추천** | 계속 전환하면서 일해야 할 때 |
| 프로젝트별 메모리 유지 | **매우 추천** | "A 프로젝트에서는 뭘 했더라" 할 필요 없음 |

---

## 사용법 5가지

### 1단계: 새 세션 만들기

#### 방법 A: 명령어 (추천)

```bash
claude --session my-project-b
```

그러면:
- 새로운 Claude Code 대화창 열림
- 프로젝트 B 폴더에서 실행
- 기존 A 세션은 그대로 열어둠

#### 방법 B: 대화 중에 만들기

```
멀티세션으로 새 프로젝트 열어줄 수 있을까?
```

AI가 안내해줍니다.

---

### 2단계: 세션 목록 보기

#### 터미널에서

```bash
cmux list
```

또는:

```bash
claude --list-sessions
```

**결과 예시:**
```
세션 목록:
1. project-a (활성)  ← 지금 이것
2. project-b (휴지)
3. project-c (휴지)
```

#### 현재 세션 확인

```bash
/status
```

이러면 "프로젝트-a 세션에서 작업 중" 이라고 알려줍니다.

---

### 3단계: 세션 전환하기

#### 방법 A: 명령어로 전환

```bash
claude --switch project-b
```

그러면:
- 프로젝트 A 세션은 백그라운드에 머무름
- 프로젝트 B 세션으로 전환
- 대화 이력 유지됨

#### 방법 B: tmux 사용 (고급)

만약 터미널에서 tmux를 쓰고 있다면:

```bash
tmux select-window -t project-b
```

---

### 4단계: 세션 간 메시지 보내기

A 세션에서 작업하다가 B 세션에 메시지를 보내고 싶을 때:

```
프로젝트 B 세션에 이렇게 전달해줄래: "지금까지 작업한 기능 요약해줄 수 있어?"
```

AI가:
1. A 세션 유지
2. B 세션으로 메시지 전달
3. B에서 응답 받음
4. 다시 A로 돌아옴

---

### 5단계: 세션 정리하기

작업 완료한 세션은 삭제:

```bash
claude --close-session project-a
```

또는 대화 중에:

```
이 세션 정리해줄래? 더 이상 필요 없어
```

---

## 💡 실전 패턴: 프로젝트별 세션 나누기

### 추천 구조

```
메인 세션 (현재 중심)
├── 프로젝트 A: 성능 최적화
├── 프로젝트 B: 버그 수정 (긴급)
├── 프로젝트 C: 문서 작성
└── 공유 리소스: 라이브러리/CLI
```

### 실제 사용 예시

**아침 9시:**
```bash
cd ~/project-a
claude --session project-a
```
→ 프로젝트 A 작업 시작

**오전 10시 — 긴급 버그!**
```bash
claude --session project-b
cd ~/project-b
```
→ 프로젝트 B 새 세션으로 전환
→ 버그 수정
→ `claude --switch project-a` → A로 돌아감

**오후 2시 — 문서 작성**
```bash
claude --session docs
cd ~/docs
```
→ 세 번째 세션 열기

**필요할 때 전환:**
```bash
claude --switch project-a
claude --switch project-b
claude --switch docs
```

---

## 모바일에서 접속하기

만약 맥 미니에서 Claude Code를 실행 중이고, 핸드폰에서도 접속하고 싶다면?

### mosh (권장)

mosh는 "원격 터미널" 도구입니다. 안정성이 좋습니다.

```bash
# 맥 미니 (또는 서버)에서
mosh your-username@your-ip

# 그 다음 claude 명령어 사용
claude --session project-a
```

**장점:**
- WiFi 끊겨도 자동으로 재연결
- 인터넷 느려도 작동
- 핸드폰에서도 가능

### SSH (간단한 방법)

```bash
ssh your-username@your-server-ip
```

터미널에 들어간 후:

```bash
claude --session project-a
```

**장점:**
- mosh 설치 안 해도 됨
- SSH는 대부분의 기기에 기본 포함

**단점:**
- 연결 끊기면 다시 접속 필요

---

## ⚠️ 주의사항

### 1. 같은 프로젝트 동시에 열지 마세요

```
❌ 안 됨:
세션 A에서 project-x 작업
세션 B에서도 project-x 작업
→ 파일 충돌 발생

✅ 좋음:
세션 A: project-x
세션 B: project-y
```

### 2. 메모리는 세션마다 독립적

```
세션 A: "Python 사용하고 있어"
→ 세션 B로 전환
→ "Python 사용 중이야?" 물으면...
→ AI가 "뭔 얘기냐?"

→ 정보를 공유하려면 /status로 확인 후 말하기
```

### 3. 중요한 파일은 백업

멀티세션이 여러 작업을 쉽게 하지만, Git에 자주 커밋하세요:

```bash
git add .
git commit -m "진행상황: 기능 X 추가"
```

---

## 실수했을 때

### 실수 1: 세션을 너무 많이 열었어요

```bash
cmux list
# → 10개 세션이 떠있음...
```

불필요한 세션 닫기:

```bash
claude --close-session old-project
```

### 실수 2: 어느 세션에 있는지 모르겠어요

```bash
/status
```

입력하면 지금 세션이름, 프로젝트 경로, 현재 상태 보여줍니다.

### 실수 3: 연결이 끊겼어요

mosh 사용 중이면:

```bash
# 자동으로 재연결 시도
mosh your-username@your-ip
```

SSH 사용 중이면:

```bash
# 다시 접속
ssh your-username@your-server-ip
claude --switch project-a
```

---

## 💡 팁: 세션 명명 규칙

일관된 이름을 쓰면 관리가 쉬워집니다.

```bash
# ✅ 좋은 예시
claude --session settle-feature-auth
claude --session settle-fix-payment
claude --session docs-api

# ❌ 나쁜 예시
claude --session aaa
claude --session test123
claude --session 나중에하기
```

**규칙 예시:**
```
[프로젝트]-[작업타입]-[기능명]

예:
settle-feature-oauth     (새 기능)
settle-fix-bug          (버그 수정)
settle-doc-api          (문서 작성)
```

---

## 다음 단계

- [10-context-engineering.md](10-context-engineering.md) — AI 기억력 관리법 (멀티세션에서 중요!)
- [08-multi-agent.md](08-multi-agent.md) — 멀티에이전트와 멀티세션 함께 쓰기
