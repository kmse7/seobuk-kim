# 컨텍스트 엔지니어링: 효율적인 메모리 관리

## 컨텍스트 윈도우란?

Claude Code가 한 번에 처리할 수 있는 텍스트의 양. Haiku 4.5는 100K 토큰 (약 75만 글자).

### 왜 중요한가?

- **토큰 누적**: 메시지, 코드, 파일 내용, 이전 대화가 쌓인다
- **응답 속도 저하**: 컨텍스트가 90% 이상 차면 Claude Code 느려짐
- **토큰 낭비**: 불필요한 정보가 들어가면 진짜 필요한 코드 분석에 할당량 줄어듦

### 토큰 구성

```
세션의 총 토큰 = 
  시스템 프롬프트 (5K)
  + CLAUDE.md 설정 (3K)
  + 이전 대화 (40K)
  + 현재 파일 (20K)
  + 새로운 요청 (5K)
  ────────────────
  = 73K (79% 사용)
```

---

## 컨텍스트 사용량 모니터링

### 1. Statusline 확인

Claude Code 우측 상단에 표시:

```
[===============================>     ] 73% | 73K/100K tokens
```

### 2. 프로그래밍 방식

```javascript
// 현재 컨텍스트 사용량 확인 (Claude API)
const response = await client.messages.create({
  model: "claude-haiku-4-5",
  max_tokens: 1024,
  messages: [{ role: "user", content: "current context usage?" }]
});

console.log(response.usage.input_tokens);
console.log(response.usage.cache_read_input_tokens);
```

---

## 자동 컴팩트 설정

컨텍스트가 특정 수치 이상이면 자동으로 요약 및 정리.

### 환경 변수 설정

```bash
# ~/.zshrc 또는 ~/.bashrc 에 추가
export CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=80

# Claude Code 재시작
```

효과:
- 80% 도달 시 자동으로 컨텍스트 컴팩트
- 이전 대화 자동 요약
- 현재 작업에 집중

### 컴팩트 임계값 권장값

| 상황 | 임계값 |
|------|--------|
| 파일 탐색 많음 | 70% |
| 코드 작성 중심 | 80% |
| 장시간 세션 | 60% |
| 리서치 위주 | 75% |

---

## PreCompact Hook: 중요 정보 보존

컴팩트 전에 사용자가 정의한 정보를 먼저 저장한다.

### CLAUDE.md에 작성

```yaml
# PreCompact Hook: 컴팩트 전에 보존할 정보

preCompactHook:
  - type: "section"
    title: "Current Implementation Status"
    query: "What have we implemented so far?"
    maxTokens: 500
    
  - type: "decision"
    title: "Architecture Decisions"
    query: "What major decisions were made?"
    maxTokens: 300
    
  - type: "plan"
    title: "Remaining Tasks"
    query: "What's left to do?"
    maxTokens: 400
```

결과: 컴팩트 후에도 구현 상태, 결정 이력, 남은 작업이 요약 형태로 유지된다.

---

## 컨텍스트 절약 전략

### 1. 대량 파일 탐색은 Subagent에 위임

```
메인 세션 (사용 중인 작업):
- 현재 구현 중인 파일
- 테스트 코드
- 컨텍스트: 30K

백그라운드 Subagent:
- 전체 코드 구조 탐색
- 기존 패턴 파악
- 컨텍스트: 별도 할당
```

명령:
```
/explore "src/ 폴더의 모든 hook 파일을 읽고 hooks-inventory.md 작성"
```

메인 세션은 계속 작업 가능. Subagent의 큰 파일 로드가 메인 컨텍스트 영향 없음.

### 2. 한 세션 = 한 기능

```
좋음: "회원가입 페이지 UI 작성"
나쁨: "회원가입 페이지 UI, API, DB 스키마, 배포까지"
```

한 세션에 너무 많은 기능을 섞으면 컨텍스트 폭증.

### 3. /clear: 컨텍스트 완전 리셋

```
/clear
```

현재 세션의 모든 이전 메시지 삭제. 새로운 상태에서 시작.

**주의**: 이전 맥락 손실. 진짜 필요한 정보는 파일로 저장 후 사용.

### 4. /compact: 수동 컴팩트

```
/compact
```

현재 세션의 대화를 AI가 자동 요약:
- 완료된 작업 → 체크리스트로
- 결정사항 → 번릿 포인트로
- 에러 해결 → 스니펫으로

컨텍스트 사용량 60-70% 단계에서 실행하면 최적.

### 5. 파일 모듈화

```
폐기:
src/user.ts (500줄, 모든 기능)

개선:
src/user/
├── types.ts (50줄)
├── auth.ts (100줄)
├── profile.ts (100줄)
└── index.ts (20줄)
```

한 번에 읽는 코드 크기를 줄이면 컨텍스트 절약.

---

## CLAUDE.md 작성 베스트 프랙티스

### 글로벌 vs 프로젝트 vs 로컬

#### 글로벌 (~/.claude/CLAUDE.md)

모든 프로젝트에 적용:
```yaml
# 응답 스타일
- 한국어 기본
- 코드는 영어
- 간결하게 답변

# 파괴적 작업 사전 승인
되돌릴 수 없는 작업은 실행 전 보고

# 멀티에이전트 판단 기준
[위의 테이블]
```

#### 프로젝트 (project-root/CLAUDE.md)

해당 프로젝트만:
```yaml
# 프로젝트 설정
framework: Next.js
language: TypeScript
db: PostgreSQL

# 코드 패턴
- 파일 구조는 /docs/PROJECT.md 참조
- API layer는 /src/api/
- 스타일링은 Tailwind + CSS modules

# 금지사항
- 기존 파일 대량 리팩토링 금지
- 마이그레이션은 회의 후 실행
```

#### 로컬 (.claude/CLAUDE.md in git)

임시, 팀 협업:
```yaml
# 이 주 스프린트
현재: 성능 최적화
집중: Image 컴포넌트, 빌드 시간

# 임시 제약
- DB 마이그레이션은 금지
- 의존성 업그레이드는 금지
```

### 뭘 넣어야 하고 뭘 넣지 말아야 하는지

#### 넣기

| 항목 | 예시 | 이유 |
|------|------|------|
| 응답 스타일 | "간결하게, 작업 완료 후 요약 금지" | 효율성 |
| 패턴 링크 | "코드 패턴은 /docs/ARCHITECTURE.md 참조" | 재사용성 |
| 판단 기준 | "파괴적 작업은 사전 승인 필요" | 안전성 |
| 금지 사항 | "기존 코드 대량 수정 금지" | 리스크 관리 |

#### 빼기

| 항목 | 이유 |
|------|------|
| API 키 | 보안 위험 |
| 암호 | 노출 위험 |
| 전체 코드 | 컨텍스트 낭비 (필요할 때 /explore로 읽기) |
| 과거 버그 목록 | 현재 작업 산만 (버그 레포는 이슈 트래커에) |
| 모든 팀원 정보 | 개인정보 (필요한 담당자만) |

### 크기 제한

```yaml
# 이상적인 CLAUDE.md 크기

글로벌: 1-2 KB
프로젝트: 2-5 KB
로컬: 0.5-1 KB

합계: 최대 8 KB
```

큰 설정은 `/docs/` 폴더의 별도 파일로 분리.

---

## 메모리 시스템 (Auto Memory)

MEMORY.md는 여러 세션에 걸쳐 유지되는 자동 메모리.

### 파일 위치

```
~/.claude/projects/[PROJECT_NAME]/MEMORY.md
```

### 메모리 타입

```markdown
# Memory Index

## Setup & Infra (시스템 설정)
- setup_claude_code_2026.md — Claude Code 세팅
- infra_db_inventory.md — DB/인프라 정보

## Feedback (행동 가이드)
- feedback_cld_definition.md — CLD 판별 기준
- feedback_just_do_it.md — 명확한 작업은 확인 없이 실행

## Reference (외부 정보)
- reference_snapism_telegram.md — Telegram 봇
- reference_vercel_account.md — Vercel 로그인

## Projects (프로젝트별 정보)
- project_settlement_cycle.md — 정산 사이클
- project_uae_migration.md — UAE 마이그레이션
```

### 메모리 작성 규칙

#### 1. 인덱스 구조

```markdown
# Memory Index

## 카테고리 (한두 단어)
- [file_name](file_name.md) — 한 줄 설명
```

#### 2. 파일 이름 규칙

```
type_topic.md

type: setup, feedback, reference, project
topic: 주제를 언더스코어로 연결

예:
- setup_github_ssh.md
- feedback_code_review.md
- project_photoism.md
```

#### 3. 파일 내용 크기

```
각 파일: 1-3 KB (3000 글자 이상 금지)

이유: 메모리도 컨텍스트 에 포함됨.
너무 크면 진짜 작업할 코드 공간 줄어듦.
```

#### 4. 업데이트 주기

- **Setup/Reference**: 분기별 (변경 시)
- **Feedback**: 월 1회 (배운 점 추가)
- **Projects**: 주 1-2회 (진행 상황 업데이트)

### 메모리에 넣으면 안 되는 것

| 항목 | 대신 할 일 |
|------|-----------|
| 비밀번호, API 키 | 환경 변수 / 암호 관리자 |
| 개인 신원 정보 | 직책과 역할만 (이름 제외) |
| 전체 코드 스냅샷 | GitHub 링크로 참조 |
| 중복 정보 | "src/를 읽어보세요" (코드는 읽을 수 있음) |
| 느슨한 노트 | 구조화된 마크다운만 |

### 실전 예: project_settlement_cycle.md

```markdown
# Settlement Cycle (정산 사이클)

## 타임라인
- **D-2**: 거래 확정
- **D-1**: 정산 계산
- **D**: 송금 실행
- **D+1**: 확인 및 보고

## 규칙
- 송금은 09:00 KST 일괄 처리
- 불일치 건은 자동 보류
- 48시간 이내 수동 검증

## 담당자
- 개발: dev@company.com
- 검증: qa@company.com
- 송금: ops@company.com (담당자 이름은 기재 금지)

## 참조
- DB: settlement_logs 테이블
- Slack: #settlement-alerts
- Dashboard: https://...
```

---

## 실전: 컨텍스트 최적화 세션

### Before (낭비하는 방식)

```
토큰 사용: 89K / 100K (89%)

메인 세션 내용:
├── CLAUDE.md (3K)
├── MEMORY.md (5K)
├── 지난 대화 (50K)
│   ├── API 설계 (완료, 이제 불필요)
│   ├── DB 마이그레이션 (완료, 이제 불필요)
│   └── UI 작업 (진행 중, 필요)
├── UI 컴포넌트 파일들 (15K)
└── 새 작업 요청 (1K)

문제:
- 완료된 작업 대화가 여전히 로드됨
- 컨텍스트 90% 근처에서 느려짐
- 새 파일을 추가할 공간 거의 없음
```

### After (최적화한 방식)

```
토큰 사용: 55K / 100K (55%)

1. /compact 실행
   - API 설계, DB 마이그레이션 자동 요약
   - 요약본: 2K로 축약

2. 파일 분리
   - 지난 작업: completed/ 폴더로 이동
   - 현재 작업: ui/ 폴더만 로드

3. 결과
├── CLAUDE.md (3K)
├── MEMORY.md (5K)
├── 컴팩트된 요약 (2K)
├── 활성 파일 (10K)
└── 여유 공간 (45K 사용 가능)

효과:
- 신속 응답 복원
- 새 파일 추가 공간 충분
- 포커스 유지 (완료된 작업 안 보임)
```

---

## 팁

1. **자동 컴팩트는 70-80% 선**: 너무 이르면 자주 끊김, 너무 늦으면 답답함
2. **Subagent는 필수**: 큰 탐색은 별도 에이전트가 해주는 게 메인 컨텍스트 보호
3. **주 1회 /clear**: 오래된 세션은 완전 리셋이 깔끔
4. **CLAUDE.md는 작게**: 필요한 것만, 나머지는 문서에 분산
5. **메모리는 공유 자산**: 정리된 형태로 다른 에이전트도 쓸 수 있게
