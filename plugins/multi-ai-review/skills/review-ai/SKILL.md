---
name: review-ai
description: External AI code review — OpenAI Codex or Claude subagent fallback
---

# AI Code Review (Codex / Claude)

OpenAI Codex 또는 Claude subagent로 코드 리뷰를 받는다.

## Usage

- `/review-ai` → 현재 변경사항 리뷰
- `/review-ai 파일경로` → 특정 파일 리뷰

## Steps

1. **인자 파싱.** `/review-ai` 뒤에 적은 텍스트를 확인한다.

2. **AI 엔진 감지.** `which codex` 로 Codex CLI 존재 여부 확인.

   ### Codex 모드 (설치된 경우)

   **인자가 파일 경로면:**

   ```bash
   codex exec "Review this file for bugs, anti-patterns, security issues, and improvements. Be specific with line numbers: <파일경로>" 2>&1
   ```

   **인자가 없으면:**

   - `git status --porcelain`으로 변경사항 확인
   - 변경사항 있으면: `codex review --uncommitted 2>&1`
   - 없으면: `codex review --base main 2>&1`

   ### Claude 대체 모드 (Codex 미설치 시)

   `code-reviewer` subagent를 실행한다.

   **인자가 파일 경로면:**
   - subagent에 "Review this file for bugs, anti-patterns, security issues, and improvements. Be specific with line numbers: <파일경로>" 프롬프트 전달

   **인자가 없으면:**
   - `git diff` (또는 `git diff main`) 결과를 subagent에 전달
   - "Review this diff for bugs, anti-patterns, security issues, and improvements." 요청

   timeout 300초.

3. **결과를 보여준다.**

   ```
   ## Code Review (Codex 또는 Claude)
   [리뷰 결과]
   ```

4. **수정할 건지 물어본다.**
