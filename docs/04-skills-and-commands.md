# 스킬과 커맨드 사용법

## 스킬 vs 커맨드

| 구분 | 스킬 | 커맨드 |
|------|------|--------|
| 호출 | `/skill_name` | `/command_name` |
| 범위 | 전문화된 작업 (설계, 리뷰, 셋업) | 제너럴 작업 (워크스페이스, 헬퍼) |
| 로드 | 명시적 호출 시 로드 | 항상 사용 가능 |
| 예시 | `/design-review`, `/review-ai` | `/ultrawork`, `/clear` |

## 스킬 호출

### /design-plan
제품 설계 전 과정을 구조화합니다.

**용도**: 새 기능 또는 대규모 변경 설계
**동작**:
1. 요구사항 인터뷰
2. Gemini로 디자인 생성
3. Codex로 미학 검토
4. 프로토타입 생성
5. DESIGN.md 작성

**사용 예시**:
```
/design-plan
새 대시보드 UI 설계해줘
```

### /design-review
기존 UI/UX를 미학과 휴리스틱 관점에서 검토합니다.

**용도**: 화면 스크린샷 또는 코드 검토
**동작**:
1. Gemini로 미학 평가
2. Codex로 UX 원칙 검토
3. 개선 제안 생성

**사용 예시**:
```
/design-review
[스크린샷 첨부]
이 폼 UX 개선점 찾아줘
```

### /review-ai
외부 AI(OpenAI Codex)로 코드를 리뷰합니다.

**용도**: 독립적인 코드 품질 검토
**동작**: 다른 AI 관점에서 버그, 성능, 스타일 문제 지적

**사용 예시**:
```
/review-ai src/auth.ts
```

### /cicd-setup
새 프로젝트 CI/CD 파이프라인을 자동 구성합니다.

**용도**: GitHub Actions + PM2 배포 설정
**동작**:
1. GitHub Actions 워크플로우 생성
2. Self-hosted runner 설정
3. PM2 프로덕션 배포 파이프라인 구성

**사용 예시**:
```
/cicd-setup
새 Node.js 프로젝트 CI/CD 해줘
```

## 커맨드 호출

### /ultrawork
최대 병렬화와 효율로 복잡한 단일 작업을 자율 실행합니다.

**용도**: 구현, 마이그레이션, 리팩토링 같은 큰 작업
**특징**:
- 자동 에러 복구
- 병렬 도구 실행
- 진행률 실시간 표시
- 실패 지점 자동 재시도

**사용 예시**:
```
/ultrawork
TypeScript 타입 검사 0 에러로 만들어줘
```

### /setup-workspace
cmux 멀티에이전트 워크스페이스를 생성합니다.

**용도**: 여러 에이전트가 동시 작업해야 할 때
**동작**:
1. tmux 세션 생성
2. 에이전트별 윈도우 분할
3. 각 에이전트에 역할 할당

**사용 예시**:
```
/setup-workspace
프론트엔드, 백엔드, 테스트 동시 작업
```

## 커스텀 스킬 만들기

프로젝트 루트에 `.claude/skills/` 디렉토리 생성:

```bash
mkdir -p .claude/skills/my-skill
```

**SKILL.md** 파일 작성 (Frontmatter 필수):

```markdown
---
name: "my-skill"
description: "내 스킬 설명"
parameters:
  - name: "targetLanguage"
    description: "번역 대상 언어"
    required: true
    type: "string"
---

# 내 스킬 구현

사용자가 원하는 작업을 여기에 구현합니다.

인자는 frontmatter의 `parameters`로 받습니다.
```

**호출**:
```
/my-skill
targetLanguage: korean
번역해줄 문서 전달
```

## 커스텀 커맨드 만들기

`.claude/commands/` 디렉토리 생성:

```bash
mkdir -p .claude/commands/my-command
```

**COMMAND.md** 작성:

```markdown
---
name: "my-command"
description: "내 커맨드"
autoExec: false
---

# 커맨드 로직

여기에 자동 실행할 로직을 구현합니다.
```

## 플러그인 마켓플레이스

커뮤니티 스킬과 커맨드를 설치합니다.

```
/plugin marketplace add
[마켓플레이스 스킬명]
```

또는 CLI로:

```bash
claude plugin marketplace add prettier-formatter
```

## 각 스킬별 간단 사용 예시

### 새 기능 설계
```
/design-plan
사용자 가입 플로우 다시 설계해줘.
현재 이슈: 2단계 폼이 복잡함.
목표: 1단계로 줄이기 + 소셜 로그인 추가
```

결과: `.claude/designs/signup-flow.md` 생성

### 기존 화면 검토
```
/design-review
[스크린샷]
이 결제 폼이 신뢰감 있어 보여?
```

결과: Gemini + Codex 병렬 리뷰 + 개선 제안

### 코드 리뷰
```
/review-ai src/payment/
```

결과: 독립적 AI 관점의 피드백

### 배포 자동화
```
/cicd-setup
Next.js + Node.js 백엔드 CI/CD 구성
```

결과: `.github/workflows/` + PM2 설정 완료

## 스킬과 커맨드 상태 확인

```bash
claude skill list
claude command list
```

## 정리

- 스킬: 전문화된 작업 (`/design-plan`, `/review-ai`)
- 커맨드: 범용 헬퍼 (`/ultrawork`, `/setup-workspace`)
- 커스텀은 `.claude/skills/` 또는 `.claude/commands/`에 SKILL.md/COMMAND.md 작성
- 플러그인 마켓플레이스로 커뮤니티 도구 설치
