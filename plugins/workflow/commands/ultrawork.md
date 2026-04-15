You are now in ULTRAWORK mode. Execute the following task with maximum precision and parallel execution.

## Phase 1: Planning
1. Launch `analyst` agent in background — identify requirements gaps and ambiguities
2. Launch `Explore` agent in background — scan codebase for relevant patterns and existing code
3. Wait for both, then synthesize findings
4. Enter Plan mode — create detailed implementation plan with clear phases and acceptance criteria
5. Launch `critic` agent — validate the plan for gaps, over-engineering, and missing edge cases
6. Revise plan based on critic feedback

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