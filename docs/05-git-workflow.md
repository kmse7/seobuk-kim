# 코드 변경사항 관리하기 — Git 기초

## Git이 뭔가요?

Git은 **문서의 버전 관리. 구글독스의 "버전 기록"과 비슷**합니다.

### 비교

| 구분 | 구글 독스 | Git |
|------|----------|------|
| **뭘 관리?** | 문서 | 코드 파일들 |
| **언제 저장?** | 자동 매 10초 | 직접 명령어 사용 |
| **언제 쓰?** | 한 사람, 또는 여럿이 함께 | 개발팀 전체 |
| **되돌리기** | "버전 기록" 클릭 | `git reset` 명령어 |

### 예시

```
구글 독스에서:
[파일 열음]
→ 2024년 4월 1일 10:00 AM 버전
→ 2024년 4월 1일 10:05 AM 버전
→ 2024년 4월 1일 10:10 AM 버전
아무 버전이나 클릭해서 되돌림

Git에서도:
[코드 수정]
→ 커밋 1: "로그인 화면 추가"
→ 커밋 2: "에러 처리 추가"
→ 커밋 3: "타입 검사 추가"
아무 커밋이나 선택해서 그 시점으로 되돌림
```

---

## 왜 필요한가요?

### 1️⃣ 누가 언제 뭘 바꿨는지 추적

```
2024-04-01 김철수: 로그인 버그 수정
2024-04-02 이영희: 버튼 색상 변경
2024-04-03 박민준: 성능 개선

→ 나중에 "누가 이걸 바꿨어?" 궁금할 때
   Git 기록에서 찾을 수 있음
```

### 2️⃣ 실수해도 되돌리기 가능

```
코드를 수정했는데 문제가 생김
→ "어, 실수했네"
→ 예전 버전으로 되돌리기
→ 문제 해결
```

### 3️⃣ 여러 사람이 동시에 작업 가능

```
철수: 로그인 화면 작업
영희: 회원가입 화면 작업
민준: 프로필 화면 작업

각자 다른 파일을 수정
→ Git이 모든 변경사항을 통합
```

---

## AI한테 Git 시키기

### 상황 1: "지금까지 바꾼 거 저장해줘"

```
AI한테: 커밋해줄래?
```

AI가 자동으로:
1. 뭘 바꿨는지 확인
2. 커밋 메시지 작성
3. 저장

### 상황 2: "바꾼 내용 보여줄래"

```
AI한테: 지금까지 뭐 바뀌었는지 보여줄래?
```

AI가 보여주는 것:
```
수정된 파일: src/auth.js, src/components/Button.tsx
추가된 파일: src/utils/helpers.js
삭제된 파일: src/old.js

변경 상세:
- src/auth.js: 15줄 추가, 3줄 삭제
- src/components/Button.tsx: 8줄 추가
```

### 상황 3: "아까 상태로 돌려줄래"

```
AI한테: 30분 전 상태로 돌려줄래?
```

AI가 해주는 것:
- 모든 변경사항 되돌림
- 코드가 예전 버전으로 복구

### 상황 4: "이 변경사항 팀에 공유해줄래"

```
AI한테: main으로 PR(풀 리퀘스트) 만들어줄래?
```

AI가 해주는 것:
- 코드 변경사항 팀에 공유
- 팀이 검토하고 승인
- 승인되면 자동 병합

---

## 커밋 메시지 규칙

### 왜 규칙이 필요할까?

구글 독스의 버전 이름처럼, Git의 커밋도 제목이 있어야 나중에 찾기 쉽습니다.

### 규칙: "일기장 제목처럼"

```
✅ 좋은 예:
"feat(login): 구글 로그인 추가"
"fix(checkout): 총액 계산 오류 수정"
"refactor(api): 에러 처리 단순화"

❌ 안 좋은 예:
"수정"
"업데이트"
"작업"
```

### 형식

```
<타입>(<범위>): <제목>

<본문>

<이슈번호>
```

### 타입 설명

| 타입 | 의미 | 예시 |
|------|------|------|
| **feat** | 새 기능 추가 | feat(user): 프로필 사진 업로드 |
| **fix** | 버그 수정 | fix(payment): 결제 오류 해결 |
| **refactor** | 코드 정리 (기능 변화 없음) | refactor(api): 에러 처리 개선 |
| **docs** | 문서 추가/수정 | docs: README 업데이트 |
| **test** | 테스트 추가 | test: 로그인 flow 테스트 |

### ✅ 좋은 예

```
feat(auth): 이메일 인증 추가

- 가입할 때 인증 이메일 발송
- 이메일의 링크 클릭하면 확인
- 인증 안 된 사용자는 글쓰기 불가

Closes #123
```

### ❌ 안 좋은 예

```
수정해놨습니다
```

---

## 실전: AI한테 Git 맡기기

### 상황: "로그인 기능 완성했어. 저장해줄래?"

#### 1단계: AI에게 요청

```
커밋해줄래?
변경사항:
- 로그인 폼 추가
- 인증 로직 구현
- 에러 메시지 표시
```

#### 2단계: AI가 자동으로

```
변경된 파일 확인:
- src/pages/Login.tsx (120줄 추가)
- src/auth/login.ts (50줄 추가)
- src/types/auth.ts (10줄 추가)

커밋 메시지 작성:
feat(auth): 로그인 페이지 및 인증 로직 구현
- 로그인 폼 UI 구현
- OAuth 토큰 검증 로직
- 에러 처리 추가

이렇게 저장할까요?
```

#### 3단계: 승인

```
맞아, 저장해줘
```

---

## 팀과 코드 공유하기 (PR)

### 이런 상황일 때

```
내가 코드를 수정했는데,
팀이 봤다가 문제 있으면 지적해줬으면 좋을 때
```

### PR이 뭔가요?

PR = "Pull Request" = **"이 코드 병합해도 되나요? 먼저 검토해줄래요?"**

### AI한테 이렇게 말하세요

```
main으로 PR 만들어줄래?
제목: 로그인 기능 추가
설명: OAuth 인증 추가했습니다
```

### AI가 해주는 것

1. 변경사항 정리
2. PR 제목과 설명 작성
3. 팀이 볼 수 있는 상태로 업로드
4. 팀이 검토하고 댓글 달 수 있게

### ✅ 좋은 PR 제목

```
"feat: 구글 로그인 추가"
"fix: 결제 이중 청구 버그 해결"
"refactor: API 에러 처리 단순화"
```

### ❌ 안 좋은 PR 제목

```
"작업"
"수정"
"병합해주세요"
```

---

## 코드 리뷰 (서로 확인하기)

### 이런 상황일 때

```
팀 동료의 PR을 보고
"이 부분 이렇게 하면 더 좋지 않을까?" 피드백할 때
```

### AI에게 리뷰 요청

```
/review-ai src/payment.ts
```

AI가 해주는 것:
```
버그 찾기:
- line 45: null check 빠짐

보안 문제:
- line 82: 비밀번호 평문 저장

성능 개선:
- line 120: N+1 쿼리 문제

해결안:
[코드 제시]
```

---

## ⚠️ 절대 하면 안 되는 것

### 1️⃣ Force Push (강제 푸시)

```
위험: git push --force
```

**문제**:
- 팀이 한 작업을 다 지워버림
- 나중에 복구 어려움

**안전한 방법**:
- 실수했으면 새 커밋으로 수정
- AI에게: "이 부분 수정해줄래? (새 커밋으로)"

### 2️⃣ 남의 작업 덮어쓰기

```
절대 금지: 다른 사람이 수정 중인 파일을 내가 수정하고 저장
```

**이렇게 하세요**:
- 팀과 먼저 상의
- 한 사람만 수정하게 역할 분담

### 3️⃣ 중요한 파일을 무분별하게 수정

```
위험한 파일:
- database.js (데이터베이스 연결)
- auth.ts (인증)
- config.json (설정)
```

**이렇게 하세요**:
- 수정 전에 Git branch 생성 (임시 공간)
- 팀이 검토 후 승인
- 그 다음에 merge

---

## 실전 예시

### 상황: "새 기능 구현 → 저장 → 팀에 공유"

#### 1단계: 기능 구현

```
AI: 사용자 검색 기능 만들어줄래?
```

AI가 코드 작성

#### 2단계: 커밋 (저장)

```
AI: 이제 커밋해줄래?
```

AI가 자동으로:
```
feat(search): 사용자 검색 기능 추가

- 검색 입력란 UI
- 검색 API 호출
- 결과 목록 표시
```

#### 3단계: PR 생성 (팀에 공유)

```
AI: main으로 PR 만들어줄래?
```

#### 4단계: 팀 검토

```
동료A: "검색 결과가 너무 느려 보여. 페이지네이션 추가할래?"
동료B: "+1, 좋은 제안"
```

#### 5단계: 수정

```
AI: 검색 결과에 페이지네이션 추가해줄래?
```

AI가 수정 후 PR 업데이트

#### 6단계: 승인 및 병합

```
팀장: "좋아, 병합하자"
AI: 병합 완료! 🎉
```

---

## 자주 묻는 질문

### Q: 커밋을 잘못 했어. 어떻게 하지?

**A: 새 커밋으로 수정하면 됩니다.**

```
AI: 아까 커밋이 잘못됐어. 수정해줄래?
```

AI가 새로운 수정 커밋 생성 (예전 커밋은 건드리지 않음)

### Q: PR이 너무 많은 파일을 건드려. 괜찮아?

**A: PR은 작을수록 좋습니다.**
- 1개 PR = 1개 기능
- 너무 크면 팀이 검토하기 힘듦

```
AI: 이 기능을 2개 PR로 나눠서 해줄래?
```

### Q: 팀이 PR에 거절했어. 뭐 하지?

**A: 피드백을 읽고 수정하세요.**

```
팀 피드백: "이 함수가 너무 길어. 더 작게 나눠줄래?"

AI: 함수를 작게 나눠서 리팩토링해줄래?
```

---

## 💡 실천 팁

- ✅ 커밋 메시지는 "일기장 제목"처럼 명확하게
- ✅ PR은 자주, 작게
- ✅ 팀 리뷰를 받고 수정하기
- ✅ 중요한 파일은 신중하게
- ❌ Force push는 절대 금지
- ❌ 남의 작업 무시하고 덮어쓰지 말 것

---

## 다음 단계

[06-playwright.md](06-playwright.md)를 읽으면:
- AI가 웹사이트를 직접 조작하는 법
- 자동으로 스크린샷 찍는 법
- 로그인이 필요한 사이트 자동화하는 법

을 배울 수 있습니다.

모든 커밋은 일관된 형식을 따릅니다.

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 타입 (type)

| 타입 | 설명 | 예시 |
|------|------|------|
| **feat** | 새 기능 | feat(auth): add OAuth login |
| **fix** | 버그 수정 | fix(checkout): correct total calculation |
| **refactor** | 기능 변경 없이 코드 개선 | refactor(api): simplify error handling |
| **docs** | 문서 추가/수정 | docs: update setup instructions |
| **chore** | 빌드, 의존성, 설정 | chore(deps): upgrade webpack to v5 |
| **test** | 테스트 추가/수정 | test: add payment flow tests |
| **style** | 코드 포맷 (기능 변경 없음) | style: fix linting errors |

### 좋은 커밋 메시지 예시

```
feat(user): add email verification

- Send verification link on signup
- Verify token on email click
- Block unverified users from posting

Closes #123
```

```
fix(api): handle null response from payment provider

The API could return null in edge cases during network failure.
Now properly catches and retries instead of crashing.

Fixes #456
```

## Claude에게 커밋 요청

### 자동 커밋 요청

작업이 완료된 후:

```
커밋해줄래?
변경 내용:
- 사용자 인증 로직 추가
- 이메일 검증 폼 생성
- 타입 정의 업데이트
```

Claude가 `git diff`를 확인 후 Conventional Commits 형식으로 커밋합니다.

### 커밋 메시지 템플릿 지정

```
다음 형식으로 커밋해:

feat(payments): support multiple payment methods

- Add Stripe and PayPal adapters
- Update checkout UI for provider selection
- Add tests for payment retry logic

Closes #789
```

## PR 생성 자동화

### 기본 PR 생성

```bash
# 브랜치 생성 후
gh pr create --title "Add OAuth login" --body "Adds Google and GitHub OAuth support"
```

Claude에게 요청:

```
main으로 PR 만들어줄래?
제목: OAuth 로그인 추가
본문: Google/GitHub 지원, 타입 안전성 강화
```

### PR 템플릿 사용

`.github/pull_request_template.md`:

```markdown
## 설명
무엇을 변경했나요?

## 이유
왜 변경했나요?

## 테스트
어떻게 테스트했나요?

## 체크리스트
- [ ] 코드 리뷰 완료
- [ ] 테스트 통과
- [ ] 문서 업데이트
```

## 코드 리뷰 워크플로우

### 1단계: 리뷰 요청

```
/review-ai src/payment.ts
```

또는:

```
이 코드 리뷰해줄래?
focus: performance, security, error handling
```

### 2단계: 피드백 반영

Claude의 리뷰 결과를 읽고 수정합니다.

```
// Before
async function processPayment(amount, card) {
  const result = await stripe.charges.create({ amount, card });
  return result;
}

// After (피드백 반영)
async function processPayment(amount: number, card: PaymentMethod): Promise<PaymentResult> {
  try {
    const result = await stripe.charges.create({
      amount: Math.round(amount * 100), // cents
      source: card.id,
    });
    return { success: true, transactionId: result.id };
  } catch (error) {
    logger.error('Payment failed', { amount, error });
    throw new PaymentError('Transaction failed', error);
  }
}
```

### 3단계: 커밋

```
fix(payments): add error handling and type safety

- Add PaymentMethod and PaymentResult types
- Convert amount to cents before API call
- Add try-catch with logging
- Validate card data

Reviewed-by: Claude Code <review-ai>
```

## 브랜치 전략

### Feature Branch 워크플로우

```bash
# 1. main에서 새 브랜치 생성
git checkout -b feature/oauth-login

# 2. 작업 진행 (커밋 여러 개)
git add .
git commit -m "feat(auth): scaffold OAuth login"
git commit -m "feat(auth): integrate Google provider"
git commit -m "test(auth): add OAuth flow tests"

# 3. PR 생성
gh pr create -B main -H feature/oauth-login

# 4. 리뷰 후 병합
gh pr merge --squash  # or --rebase
```

### 브랜치 명명 규칙

```
feature/user-auth
feature/payment-gateway
bugfix/checkout-crash
refactor/api-client
docs/setup-guide
```

## 주의사항: 파괴적 작업

### Force Push 금지

```bash
# 위험 - 팀 코드 손실 가능
git push --force

# 안전 - 로컬만 영향
git reset --soft HEAD~1
```

### Amend 신중하게

이미 푸시된 커밋은 amend하지 말기:

```bash
# 위험 - 원격 히스토리 변경
git commit --amend
git push --force

# 안전 - 새 커밋으로 수정
git revert HEAD
git commit -m "fix: undo previous change"
```

### Reset 전 백업

```bash
# 위험한 작업 전
git branch backup-point
git reset --hard HEAD~2

# 문제 발생 시 복구
git reset --hard backup-point
```

## 실제 워크플로우 예시

### 기능 구현 시작

```bash
git checkout -b feature/user-dashboard
```

Claude:
```
대시보드 페이지 만들어줄래?
요구사항:
- 사용자 통계 표시
- 월별 차트
- 내보내기 버튼
```

### 작업 진행

Claude가 코드 작성 후:
```
git status를 보니 5개 파일이 변경됐어.
커밋해줄 수 있어?
```

Claude가 커밋:
```
feat(dashboard): create user analytics page

- Add Dashboard component with stats layout
- Implement monthly chart with Chart.js
- Add export to CSV functionality
- Add tests for Dashboard and ExportButton

Closes #234
```

### PR 생성

```
main으로 PR 만들어줄래?
제목과 본문도 자동 생성해줘.
```

Claude:
```
gh pr create \
  --title "feat: add user analytics dashboard" \
  --body "Implements dashboard with stats and export functionality"
```

### 리뷰 및 병합

```
이 PR의 코드를 리뷰해줄래?
성능과 테스트 커버리지 중심으로.
```

피드백 반영 후:

```
gh pr merge --squash
```

## 정리

- **Conventional Commits**: feat, fix, refactor, docs, chore 타입 사용
- **Claude 커밋**: `git diff` 확인 후 Conventional Commits 형식으로 자동 생성
- **PR 자동화**: gh pr create로 제목/본문 자동 생성
- **/review-ai**: 독립적 코드 리뷰
- **Feature Branch**: 기능별 브랜치 분리 → PR → squash merge
- **위험한 작업**: force push, amend, reset은 신중하게, 필요시 백업 먼저
