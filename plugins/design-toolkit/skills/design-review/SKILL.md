---
name: design-review
description: UI/UX 디자인 리뷰 - Gemini(미학 판단) + Codex(UX heuristic) 병렬 실행. 스크린샷+코드 분석
---

# Design Review (Gemini + Codex)

Gemini(미학 판단)와 Codex(UX heuristic 피드백)를 **병렬**로 돌려서 디자인 리뷰를 받는다.

## Usage

- `/design-review` → 현재 변경사항 + dev server 스크린샷 리뷰
- `/design-review URL` → 특정 페이지 리뷰
- `/design-review 파일경로` → 특정 컴포넌트 리뷰
- `/design-review --fast` → 코드 기반 heuristic만 (Gemini only)
- `/design-review --save-baseline` → 현재 스크린샷을 베이스라인으로 저장
- `/design-review --baseline` → 저장된 베이스라인과 비교 리뷰

## Steps

1. **인자 파싱.** `/design-review` 뒤에 적은 텍스트를 확인한다. `--fast`, `--save-baseline`, `--baseline`, `--states`, `--selector` 플래그를 분리한다.

2. **동의 게이트 (첫 실행 시만).** "스크린샷과 코드를 외부 AI(Codex, Gemini)에 전송합니다. 주의: 스크린샷에 개인정보(PII), 로그인 세션, 관리자 데이터가 포함될 수 있습니다. 민감한 화면이라면 테스트 데이터로 전환 후 진행하세요. 진행할까요?" 사용자에게 묻는다. 동의하면 세션 내 재확인 없음.

3. **가이드라인 탐색.** 아래 우선순위로 디자인 가이드라인을 수집한다.
   1. `DESIGN.md` (프로젝트 루트) — 있으면 최우선
   2. `docs/design/` 디렉토리 내 파일들
   3. `tailwind.config.*`, `theme.*`, CSS custom properties 파일
   4. 위 모두 없으면 → 범용 기준 (WCAG 2.2 AA, 타이포 위계, 색상 대비 4.5:1, 스페이싱 4px/8px)

4. **스크린샷 캡처.** `--fast`면 스킵. 아니면:
   - **URL 인자 있으면** → Playwright MCP로 해당 URL 캡처
   - **파일 경로 인자면** → 같은 디렉토리에 `.stories.*` 파일 탐색. 있으면 Storybook URL로 캡처. 없으면 코드만 분석
   - **인자 없으면** → dev server 포트 자동 감지:
     1. `package.json`의 `scripts.dev`에서 포트 추출
     2. `vite.config.*`, `next.config.*`, `.env`에서 PORT 탐색
     3. `nc -z localhost <port>`로 확인
     4. 감지 실패 → 사용자에게 URL 질문
   - 캡처 시 Playwright로 `networkidle` 대기 후 주요 셀렉터(`body > main`, `[data-testid]`, `#app`) 가시성 확인
   - 데스크톱(1440px) full-page + 모바일(375px) full-page 두 장 캡처
   - 스크린샷을 `/tmp/design-review-desktop.png`, `/tmp/design-review-mobile.png`에 저장
   - `--states` 플래그 시 empty/loading/error 상태도 추가 캡처
   - `--save-baseline` 시 `docs/design/mockups/baseline/`에 복사 후 종료

5. **프롬프트 파일 작성.** 민감 파일 제외 (패턴: `.env*`, `*credentials*`, `*secret*`, `*serviceAccount*`, `*.pem`, `*.key`, `.npmrc`, `.pypirc`). `--fast` 모드면 Codex 프롬프트 파일 작성을 스킵하고, Gemini 프롬프트에서 `@path` 라인도 제외한다.

   `/tmp/design-prompt-gemini.md` 작성:
   ```
   You are a design director with 20 years of experience. Your standards are Stripe,
   Linear, and Vercel. You give critique like you're in a design review session —
   direct, specific, opinionated.

   Look at these screenshots and the code. Do NOT make a checklist. Instead:

   1. FIRST IMPRESSION (3 seconds): Where does your eye go first? Is that the most
      important element? If not, what's pulling attention wrong — visual weight,
      color temperature, or negative space?

   2. RHYTHM: Is the spacing breathing or suffocating? Name specific values.
      "The 4px gap between h1 and h2 kills the hierarchy" not "spacing could be improved."

   3. TENSION: Is everything perfectly symmetrical? (AI-slop signal.) Is there intentional
      asymmetry? A focal point hierarchy? Or does everything compete for attention?

   4. FEELING: What emotion does this design create? What SHOULD it create?
      "This feels like [specific product]'s [specific page]" — or "This doesn't remind me
      of anything — it has no personality."

   5. AI-SLOP CHECK: 3-column equal-height cards? Purple-blue gradient? Inter font?
      Perfect symmetry? Buzzword copy? 3+ matches = "This looks AI-generated."

   RULES:
   - Write in narrative paragraphs, NOT bullet lists
   - Start with "Looking at this screen..."
   - Every judgment must name the specific element + WHY mechanism
   - If a sentence could be copy-pasted to any project, rewrite it
   - "~ should be changed to [specific value] because [specific reason]"
   - Reference at least one real product for comparison
   - End with a Score (1-10) and one-line verdict

   --- DESIGN GUIDELINES ---
   [DESIGN.md 또는 수집된 가이드라인 내용]

   --- CHANGED FILES ---
   [git diff 또는 지정 파일 내용]
   ```

   `/tmp/design-prompt-codex.md` 작성:
   ```
   You are the end user of this product. Write in FIRST PERSON.
   (If DESIGN.md specifies a target user, adopt that persona.
   Otherwise: "a busy professional using this tool daily.")

   Do NOT list Nielsen's 10 heuristics. Instead, narrate your experience:

   1. 5-SECOND TEST: "When I first see this screen, I think I need to..."
      Can you figure out what to do in 5 seconds? If not, what confuses you?

   2. FAILURE SCENARIOS: Simulate 3 specific mistakes a user could make on this screen.
      For each: does the design prevent it? recover from it? or make it worse?

   3. ENVIRONMENT TEST: Imagine using this on a phone, standing up, in bright sunlight.
      Are touch targets big enough? Is text readable? Does the layout survive 375px?

   4. COMPARISON: Name 2 apps/services that do the same job.
      "Compared to [X], this does [Y] better but [Z] worse."
      "The [specific part] should work like [X app]'s [specific screen] — that would
      immediately fix [specific problem]."

   5. ACCESSIBILITY (brief): Color contrast issues, text size problems, missing labels.
      Only flag what would actually block a real user.

   RULES:
   - Write as "I" — first person narrative, not analyst report
   - Start with "As a user, when I open this screen..."
   - NO scores, NO checklists, NO bullet point lists
   - Every observation must be specific to THIS design (not generic advice)
   - End with: "Would I switch to this from [competitor]? [Yes/No] because..."

   --- DESIGN GUIDELINES ---
   [DESIGN.md 또는 수집된 가이드라인 내용]

   --- CHANGED FILES ---
   [git diff 또는 지정 파일 내용]
   ```

   `--baseline` 모드면 두 프롬프트에 "Compare against the baseline screenshot" 추가하고 베이스라인 이미지도 전달.

6. **AI 엔진 감지 및 실행.** 먼저 사용 가능한 AI를 확인한다:
   - `which gemini && which codex` — 둘 다 있으면 **멀티AI 모드**
   - Gemini만 있으면 Gemini 단독, Codex만 있으면 Codex 단독
   - 둘 다 없으면 → **Claude 대체 모드** (subagent 2개 병렬)

   반드시 하나의 메시지에서 두 호출을 동시에 보낸다.

   ### 멀티AI 모드 (Gemini + Codex)

   **`--fast` 모드면 Gemini만 실행** (스크린샷 없이 코드 기반):

   Bash 1 (Gemini only):
   ```bash
   gemini -p "$(cat /tmp/design-prompt-gemini.md)" --approval-mode plan -o text 2>&1
   ```

   **일반 모드면 둘 다:**

   Bash 1 (Gemini — 미학):
   ```bash
   gemini -p "$(cat /tmp/design-prompt-gemini.md) @/tmp/design-review-desktop.png @/tmp/design-review-mobile.png" --approval-mode plan -o text 2>&1
   ```

   Bash 2 (Codex — UX):
   ```bash
   cat /tmp/design-prompt-codex.md | codex exec - --skip-git-repo-check -i /tmp/design-review-desktop.png -i /tmp/design-review-mobile.png -s read-only 2>&1
   ```

   ### Claude 대체 모드 (Gemini/Codex 미설치 시)

   Agent 1 (미학 크리틱 — designer subagent):
   - subagent_type: `designer`
   - 프롬프트: `/tmp/design-prompt-gemini.md` 내용 전달 + 스크린샷 Read
   - "Score (1-10) + 내러티브 크리틱" 요청

   Agent 2 (UX 크리틱 — quality-reviewer subagent):
   - subagent_type: `quality-reviewer`
   - 프롬프트: `/tmp/design-prompt-codex.md` 내용 전달 + 스크린샷 Read
   - "1인칭 사용자 관점 내러티브" 요청

   각각 timeout 300초.

7. **상충 피드백 중재.** 두 결과를 비교하여:
   - 접근성/WCAG → Gemini 우선
   - 브랜드 일관성 → DESIGN.md 기준 우선
   - 미학 vs UX 충돌 → 사용자에게 충돌 명시하고 선택 요청
   - 동의하는 이슈만 수정 대상으로 제안

8. **레퍼런스 DESIGN.md 보강.** Gemini/Codex 결과에서 비교 대상으로 언급된 사이트를 추출한다.
   해당 사이트가 `VoltAgent/awesome-design-md` 컬렉션에 있으면 DESIGN.md를 가져와서
   개선 제안에 구체적 디자인 토큰(색상 hex, 스페이싱 값, 폰트 등)을 포함시킨다.

   컬렉션 확인:
   ```bash
   curl -sf "https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/<사이트명>/DESIGN.md" -o /tmp/ref-design-<사이트명>.md
   ```
   404면 스킵. 가져온 DESIGN.md에서 관련 토큰만 추출하여 핵심 액션에 반영한다.

   예: Codex가 "Stripe처럼 카드 간격을 넓혀야 한다"고 언급
   → Stripe DESIGN.md에서 스페이싱 스케일 추출
   → "Stripe 기준 카드 간격 24px (spacing-6), 현재 12px → 24px로 변경 권장"

9. **결과를 구분해서 보여준다.**

   ```
   ## 디자인 디렉터 크리틱 (Gemini) — Score: X/10
   [gemini 내러티브 결과]

   ## 사용자 관점 리뷰 (Codex)
   [codex 1인칭 내러티브 결과]

   ## 종합 판단
   [두 관점 종합. 공통으로 지적한 문제 우선. 충돌 시 사용자에게 선택 요청]

   ## 핵심 액션 (최대 3개)
   1. [가장 임팩트 큰 변경 — 레퍼런스 DESIGN.md 토큰 포함 시 구체적 값 명시]
   2. [두번째]
   3. [세번째]
   ```

10. **임시 파일 정리.** `/tmp/design-prompt-*.md`, `/tmp/design-review-*.png`, `/tmp/ref-design-*.md` 삭제.

11. **수정할 건지 물어본다.**
