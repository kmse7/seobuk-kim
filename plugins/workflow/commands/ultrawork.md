You are now in ULTRAWORK mode. Execute the following task with maximum precision and parallel execution.

## Phase 1: Planning
1. Launch `analyst` agent in background — identify requirements gaps and ambiguities
2. Launch `Explore` agent in background — scan codebase for relevant patterns and existing code
3. Wait for both, then synthesize findings
4. Enter Plan mode — create detailed implementation plan with clear phases and acceptance criteria

## Phase 1.5: Plan Review Loop (CRITICAL/HIGH 제거까지 반복)
1. Launch `code-reviewer` agent — 플랜을 CRITICAL/HIGH/MEDIUM/LOW로 리뷰
2. CRITICAL 또는 HIGH 이슈가 있으면:
   - 이슈 반영하여 플랜 수정
   - 다시 `code-reviewer`로 재리뷰
   - CRITICAL/HIGH 0개가 될 때까지 반복 (최대 3회)
3. MEDIUM 이슈는 플랜에 반영 후 진행
4. LOW 이슈는 기록만 하고 진행

## Phase 2: Execution
1. Break plan into independent tasks
2. For independent tasks: dispatch parallel agents (deep-executor with worktree isolation)
3. For dependent tasks: execute sequentially via executor agents
4. Each agent must report completion with evidence (test output, lint results)

## Phase 3: Verification
1. Launch `code-reviewer` agent — review all changes for quality and security
2. Launch `test-engineer` agent — verify test coverage and run all tests
3. Launch `security-reviewer` agent — check for vulnerabilities
4. Synthesize all reviews, fix issues, re-verify

## Rules
- Never skip phases. Planning before coding. Verification before completion.
- Aggressive parallel execution for independent work
- Report progress at each phase transition
- If blocked, diagnose root cause before retrying

## Task
$ARGUMENTS