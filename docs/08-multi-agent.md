# 멀티에이전트 워크플로우 가이드

## 개요

Claude Code에서 복잡한 작업을 병렬로 처리하거나 독립적으로 실행하려면 멀티에이전트 패턴을 사용한다. 각 에이전트는 전담 역할을 수행하며, 필요시 사용자와 상호 소통한다.

## 에이전트 유형 및 판단 기준

| 작업 유형 | 에이전트 방식 | 특징 |
|-----------|-------------|------|
| 단발 리서치, 파일 탐색 | **Subagent (Explore)** | 백그라운드 실행, 메인 컨텍스트 보호 |
| 독립 파일 2-5개 병렬 수정 | **Subagent + worktree 격리** | 파일별 격리 공간, 충돌 방지 |
| 프론트+백+테스트 동시 진행 | **Agent Teams** | 상호 소통 가능, 병렬 협업 |
| 경쟁 가설 디버깅, 다각도 리뷰 | **Agent Teams (3-5명)** | 다수 관점 검토, 최적안 도출 |
| 복잡한 단일 태스크 자율 실행 | **/ultrawork** | 3-phase pipeline (Planning → Execution → Verification) |

### 선택 기준

1. **규모가 작거나 리서치 중심** → Subagent
2. **독립적인 파일들을 동시에 수정** → Subagent + worktree
3. **상호 피드백이 필요** → Agent Teams
4. **복잡한 구현 + 검증이 필요** → /ultrawork

## /ultrawork 3-Phase Pipeline

복잡한 태스크를 구조적으로 처리하는 고도화된 모드.

```
/ultrawork "Next.js 성능 최적화 - Image 컴포넌트 리팩토링, 빌드 시간 50% 단축"
```

### Phase 1: Planning
- 태스크 분석
- 구현 전략 수립
- 리스크 식별
- 테스트 계획 작성

### Phase 2: Execution
- 코드 작성 (기존 패턴 따르기)
- 단위 테스트
- 빌드 검증

### Phase 3: Verification
- 통합 테스트 실행
- 성능 메트릭 측정
- 문서 업데이트
- 마이그레이션 가이드 작성

---

## Agent Teams 사용법

여러 에이전트가 협업하여 복잡한 작업을 처리한다.

### 1. 팀 생성

```
/team-create
```

대화형 프롬프트:
- 팀 이름
- 에이전트 역할 (analyst, architect, dev, qa, designer 등)
- 에이전트 수 (3-5명 권장)

### 2. 작업 할당

```
/task-create "Database 마이그레이션"
- Phase 1: 스키마 분석 및 설계
- Phase 2: 코드 작성 및 테스트
- Phase 3: 검증 및 롤백 계획
```

### 3. 팀원 간 메시지

```
/team-send "architect에게: 병렬 처리를 위해 worker queue 도입 검토"
```

### 4. 팀 상태 모니터링

```
/team-status
```

결과:
- 진행 중인 작업
- 완료된 작업
- 병목 지점

---

## Subagent 사용법

메인 컨텍스트를 보호하면서 독립적인 작업을 위임한다.

### 백그라운드 실행 (권장)

```
/explore "프로젝트의 모든 API 엔드포인트 문서화"
```

완료 조건:
- endpoints.md 파일 생성
- README에서 참조 가능
- 예시 요청/응답 포함

Subagent가 백그라운드에서 실행되며, 메인 세션은 계속 작업 가능.

### 포그라운드 실행

```
대용량 파일 읽기가 필요한 경우, 명시적으로:

다음 대로 탐색 완료 후 돌아와:
- 기존 컴포넌트 패턴 파악 (5개 파일)
- 스타일링 시스템 이해
- 아이콘 사용법
```

---

## Subagent + Worktree 격리

독립적인 파일 2-5개를 병렬로 수정할 때 충돌을 방지한다.

### 세팅

```bash
/setup-workspace
```

각 에이전트가 별도 worktree 받음:
- `worker-1`: API layer 구현
- `worker-2`: UI layer 구현
- `worker-3`: 테스트 작성

### 파일 소유권 규칙

```
금지: 동일 파일을 여러 에이전트가 동시에 수정

허용:
- worker-1 → src/api/auth.ts (전담)
- worker-2 → src/ui/Login.tsx (전담)
- worker-3 → tests/auth.test.ts (전담)
```

### 병합

각 에이전트의 작업이 완료되면:

```bash
git checkout main
git pull origin main

# 각 worktree 병합
git merge worker-1
git merge worker-2
git merge worker-3

git push origin main
```

---

## 에이전트 커스터마이징

프로젝트별로 에이전트 역할을 정의한다.

### 디렉토리 구조

```
project-root/
├── agents/
│   ├── analyst.md (프론트엔드 분석가)
│   ├── architect.md (백엔드 설계자)
│   ├── dev.md (구현 전담)
│   └── qa.md (테스트 전담)
└── CLAUDE.md (글로벌 설정)
```

### agents/dev.md 예시

```markdown
# Developer Agent

## 역할
- 요구사항을 코드로 구현
- 기존 패턴 따르기
- 테스트 작성

## 제약사항
- 기존 코드 2-3개 읽고 패턴 파악 후 시작
- 한 세션 = 한 기능
- 대용량 파일 탐색은 금지 → analyst 위임

## 도구
- @claude-ai/Google_Calendar (일정 확인)
- Playwright (브라우저 자동화)
- GitHub MCP (코드 리뷰)
```

### Frontmatter 활용

Claude Code가 agents/ 디렉토리를 인식하고 에이전트별 컨텍스트를 격리한다:

```yaml
---
agent: dev
context: src/
exclude: docs/, tests/
memory: user-dev-memory
---
```

---

## 메모리 시스템

에이전트들이 사용자의 메모리(MEMORY.md)를 공유한다.

### 메모리 활성화

CLAUDE.md 또는 프로젝트 설정에서:

```yaml
memory: user
```

### 메모리 타입

| 타입 | 용도 | 예시 |
|------|------|------|
| user | 개인 설정, 선호도 | "한국어 기본, 코드는 영어" |
| feedback | 행동 가이드 | "명확한 작업은 확인 없이 실행" |
| project | 프로젝트별 컨텍스트 | "settle: 정산 사이클 정보" |
| reference | 외부 시스템 정보 | "Vercel: Google 로그인" |

### 메모리에 담으면 안 되는 것

- 비밀번호, API 키
- 개인 신원 정보
- 중복되는 정보 (코드는 읽을 수 있으니 또 쓰지 말 것)

---

## 실전 예제

### 사례 1: 문서 작성 (Subagent + 포그라운드)

```
다음을 동시에 진행:
1. API 문서 작성 (Subagent: /explore)
2. 메인 세션: 코드 리뷰 및 병합
```

명령:
```
/explore "src/ 모든 API 함수를 찾아 API.md 작성
- 함수명, 파라미터, 반환값, 예시
- POST /auth/login 먼저, 그 다음 GET /user/:id"
```

메인 세션에서:
```
git add -A && git commit -m "docs: add API documentation"
```

### 사례 2: 기능 개발 (Agent Teams)

```
/team-create
- Architect: DB 스키마 설계
- Dev: API 구현
- QA: 테스트 시나리오
```

프로젝트: "사용자 인증 리팩토링"
- Architect가 스키마 설계 → Dev에 전달
- Dev가 구현 → QA에 전달
- QA가 테스트 → 리포트 작성

### 사례 3: 버그 디버깅 (Agent Teams - 경쟁 가설)

```
/team-create (3명)
- Agent 1: "프론트엔드 상태 관리 문제"
- Agent 2: "API 응답 문제"
- Agent 3: "네트워크 타이밍 문제"
```

각자 가설을 검증한 후 최적안 도출.

---

## 팁

1. **워크트리는 진짜 격리다**: 에이전트가 merge conflict를 만들 수 없게 파일 소유권을 분명히.
2. **Subagent는 백그라운드 추천**: 메인 세션이 계속 작업하면서 병렬 진행.
3. **메모리는 공유 자산**: 모든 에이전트가 접근하니 명확하고 간결하게.
4. **한 세션 = 한 기능**: 복잡해 보이면 /ultrawork 사용.
