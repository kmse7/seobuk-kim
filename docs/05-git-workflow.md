# Git 워크플로우

## Conventional Commits

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
