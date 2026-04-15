---
name: design-plan
description: 디자인 설계 — 인터뷰 → Gemini(디자인 생성) → Codex(미학 크리틱) → 디자인 시스템 확정 → 프로토타입 → DESIGN.md 작성
---

# Design Plan (Interview → Gemini → Codex → DESIGN.md)

디자인 방향을 설계한다. 인터뷰로 요구사항을 수집하고, Gemini로 디자인 방향을 생성하고, Codex로 미학 크리틱을 받아 디자인 시스템을 확정한다.

## Usage

- `/design-plan` → 인터뷰부터 시작
- `/design-plan 요구사항` → 요구사항 기반으로 인터뷰 시작

## Steps

1. **인자 파싱.** `/design-plan` 뒤에 적은 텍스트를 요구사항으로 사용한다.

2. **동의 게이트 (첫 실행 시만).** "디자인 생성 과정에서 레퍼런스와 인터뷰 결과를 외부 AI(Codex, Gemini)에 전송합니다. 주의: 스크린샷에 개인정보(PII), 로그인 세션, 관리자 데이터가 포함될 수 있습니다. 민감한 화면이라면 테스트 데이터로 전환 후 진행하세요. 진행할까요?"

3. **.gitignore 갱신 (인터뷰 전).** 프로젝트 `.gitignore`에 `.design-context.json`과 `docs/design/mockups/`를 추가한다 (없으면). 세션 중단 시에도 민감 파일이 커밋되지 않도록 보장.

4. **인터뷰 (한 번에 하나씩, 멀티초이스 우선).**
   인터뷰 결과는 `.design-context.json`에 중간 저장하여 세션 중단 시 복구 가능.
   `.design-context.json`이 이미 있으면 "이전 인터뷰 결과가 있습니다. 이어서 할까요?" 확인.

   **필수 질문:**
   - 타겟 유저는 누구인가?
   - 브랜드 톤은? (A: 미니멀 / B: 볼드 / C: 플레이풀 / D: 프로페셔널 / E: 엘레강트 / F: 기타)
   - 레퍼런스 사이트나 이미지가 있나요? (없으면 안내: godly.website, Mobbin, Dribbble, Saaspo)
   - 꼭 피하고 싶은 스타일이 있나요?
   - 핵심 기능/페이지 우선순위는?
   - 기존 디자인 시스템이나 브랜드 가이드가 있나요?

   **배포 제약 질문:**
   - 데이터 밀도는? (A: 대시보드/고밀도 / B: 마케팅/저밀도 / C: 혼합)
   - i18n/RTL 필요? (A: 예 / B: 아니오)
   - 지원 브라우저 범위는? (A: 최신 브라우저만 / B: IE11 포함 / C: 모바일 브라우저 포함)
   - 성능 예산 제약이 있나요? (웹폰트 수, 번들 사이즈 등)
   - 폰트/에셋 라이선스 제약이 있나요? (A: 무료만 / B: 상용 가능 / C: 제약 없음)

   **선택 질문 (필요시):**
   - 다크/라이트 모드? (A: 라이트만 / B: 다크만 / C: 둘 다 / D: 시스템 따름)
   - 모바일 우선 vs 데스크톱 우선?
   - 애니메이션 수준? (A: 없음 / B: 미니멀 / C: 풍부 / D: 레퍼런스 있음)
   - 컴포넌트 라이브러리 선호? (A: shadcn / B: Aceternity / C: 21st.dev / D: 직접 구현 / E: 기타)

4. **가이드라인 탐색.** `/design-review`와 동일한 우선순위로 기존 가이드라인을 수집한다.
   프레임워크 감지: `package.json`에서 react/next/vue/svelte 등 확인.

5. **DESIGN.md 레퍼런스 추천 (기존 DESIGN.md가 없을 때만).**
   인터뷰 결과(프로젝트 성격, 브랜드 톤, 데이터 밀도, 타겟 유저)를 기반으로
   `VoltAgent/awesome-design-md` 컬렉션에서 2~3개 후보를 추천한다.

   추천 매핑 기준:
   | 프로젝트 성격 | 추천 후보 |
   |-------------|----------|
   | 대시보드/어드민/데이터 밀도 높음 | Linear, Sentry, PostHog, ClickHouse |
   | SaaS/B2B/프로덕트 | Supabase, Notion, Vercel, Raycast |
   | 마케팅/랜딩/저밀도 | Stripe, Framer, Webflow, Apple |
   | 금융/핀테크 | Wise, Revolut, Coinbase, Kraken |
   | AI/ML 플랫폼 | Claude, Replicate, Together AI, VoltAgent |
   | 개발자 도구 | Cursor, Warp, Resend, Mintlify |
   | 디자인/크리에이티브 | Figma, Framer, Clay, Miro |
   | 이커머스/마켓플레이스 | Airbnb, Pinterest, Shopify |

   브랜드 톤 보정:
   - 미니멀 → Vercel, Cal.com, Resend
   - 볼드 → Uber, SpaceX, NVIDIA
   - 플레이풀 → Figma, PostHog, Zapier
   - 프로페셔널 → Stripe, IBM, HashiCorp
   - 엘레강트 → Apple, Ferrari, Superhuman

   제안 형식:
   ```
   프로젝트 성격과 인터뷰 결과를 바탕으로 3개 레퍼런스를 추천합니다:

   A. **Linear** — 울트라 미니멀, 퍼플 액센트, 엔지니어 대상 프로젝트 관리
      → 데이터 밀도 높은 대시보드 + 미니멀 톤에 적합
   B. **Sentry** — 다크 대시보드, 데이터 밀집, 핑크-퍼플 액센트
      → 모니터링/분석 대시보드에 적합
   C. **Supabase** — 다크 에메랄드, 코드 퍼스트, 개발자 친화
      → 개발자 대상 SaaS에 적합

   선택하면 해당 DESIGN.md를 기반으로 디자인 방향을 생성합니다.
   D. 직접 레퍼런스 지정 (URL 또는 사이트명)
   ```

   사용자가 선택하면:
   ```bash
   curl -sL "https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/<선택한사이트>/DESIGN.md" -o DESIGN.md
   ```
   다운로드 후 다음 단계에서 이 DESIGN.md를 기준 가이드라인으로 사용한다.
   사용자가 "D"를 선택하면 기존 플로우대로 진행.

6. **Gemini로 디자인 방향 생성.** 민감 파일 제외 (패턴: `.env*`, `*credentials*`, `*secret*`, `*serviceAccount*`, `*.pem`, `*.key`, `.npmrc`, `.pypirc`). 인터뷰 결과 + 레퍼런스 + 가이드라인을 종합하여:

   `/tmp/design-prompt-gemini.md` 작성:
   ```
   You are a creative director at a top design agency. You're pitching 2-3 design
   directions to a client. Each direction must feel DISTINCT — not variations of
   the same safe choice.

   For each direction:
   1. CONCEPT NAME + ONE SENTENCE that captures the feeling (not a feature list)
      Example: "Midnight Editorial — the confidence of a well-typeset magazine,
      where every element earns its place through restraint"

   2. VISUAL IDENTITY:
      - Color palette: hex values. Explain the EMOTION each color creates.
        "Not just 'primary blue' — why THIS blue? What does it feel like?"
      - Typography: specific Google Fonts with pairing rationale.
        "Heading: Instrument Serif (editorial authority) + Body: Satoshi (modern clarity)"
      - Spacing: base unit + scale. "8px base, 1.5x scale — generous, editorial breathing room"

   3. THE ONE MEMORABLE THING: What makes someone screenshot this and share it?
      Not a feature — a FEELING. "The way the data cards subtly pulse when values change"

   4. REFERENCE PRODUCTS: "This direction feels like [X] meets [Y]"
      Be specific: "Stripe's documentation clarity meets Linear's dark mode density"

   5. WHAT THIS IS NOT: Explicitly state what you're rejecting.
      "This is NOT a generic SaaS dashboard with blue buttons and card grids"

   Each direction must be opinionated. If two directions could be combined without
   conflict, they're not different enough. Redo.

   --- INTERVIEW RESULTS ---
   [.design-context.json 내용]

   --- DELIVERY CONSTRAINTS ---
   [제약 사항]

   --- EXISTING GUIDELINES ---
   [DESIGN.md 또는 수집된 가이드라인]

   @path ./reference-screenshot.png (레퍼런스가 있으면)
   ```

   **AI 엔진 감지:** `which gemini` 로 Gemini CLI 존재 여부 확인.

   **Gemini 있으면:**
   ```bash
   gemini -p "$(cat /tmp/design-prompt-gemini.md) Propose 2-3 design directions." --approval-mode plan -o text 2>&1
   ```

   **Gemini 없으면 (Claude 대체):**
   - `designer` subagent 실행
   - `/tmp/design-prompt-gemini.md` 내용을 프롬프트로 전달
   - "2-3개 디자인 방향 제안" 요청

   timeout 300초.

7. **사용자에게 2-3개 방향 제시.** 각 방향의 핵심(컨셉, 색상, 폰트, 특징)을 정리해서 보여주고 선택을 요청한다.

8. **Codex로 미학 크리틱.** 선택된 방향에 대해:

   `/tmp/design-prompt-codex.md` 작성:
   ```
   You are a design director reviewing a junior designer's proposal. Be brutally honest.

   1. FIRST REACTION: Is this genuinely distinctive, or could any AI have generated it?
      Name the specific elements that make it unique — or expose it as generic.

   2. COLOR CRITIQUE: Don't just say "harmonious." Analyze the color temperature balance,
      the semantic weight of each color, whether the accent color actually accents or
      just decorates. "The warm gray (#F5F0EB) grounds the palette, but the accent teal
      competes with the primary blue — pick one warm, one cool accent, not two cool."

   3. TYPOGRAPHY PAIRING: Do the fonts have a genuine relationship or are they just
      "safe + safe"? "Instrument Serif × Satoshi works because serif authority meets
      geometric clarity — they share x-height proportions." vs "Inter × Roboto is just
      two neutrals pretending to be a system."

   4. THE HARD QUESTION: "Would a real designer put this in their portfolio?"
      If no — what's missing? Be specific.

   5. DELIVERY CHECK: Font licensing, bundle impact, browser support issues.

   Write in narrative paragraphs. No bullet lists.
   End with: Score (1-10) + "Ship it" / "Needs work" / "Start over"

   --- DESIGN DIRECTION ---
   [선택된 방향]

   --- CONSTRAINTS ---
   [제약 사항]
   ```

   **AI 엔진 감지:** `which codex` 로 Codex CLI 존재 여부 확인.

   **Codex 있으면:**
   ```bash
   cat /tmp/design-prompt-codex.md | codex exec - --skip-git-repo-check -s read-only 2>&1
   ```

   **Codex 없으면 (Claude 대체):**
   - `code-reviewer` subagent 실행
   - `/tmp/design-prompt-codex.md` 내용을 프롬프트로 전달
   - "디자인 크리틱 + Score(1-10)" 요청

   timeout 300초.

9. **Codex 피드백 반영.** 크리틱 결과를 사용자에게 보여주고, 피드백을 반영하여 디자인 시스템을 확정한다.

10. **프로토타입 생성.**
   - 프레임워크가 있으면 → 네이티브 컴포넌트 (React/Next 등). Storybook이 있으면 `.stories.tsx`도 생성.
   - 프레임워크가 없으면 → HTML+CSS 목업
   - Playwright로 데스크톱(1440px) + 모바일(375px) 스크린샷 캡처
   - 사용자에게 시각적 확인

11. **DESIGN.md 작성.** 프로젝트 루트에 생성/갱신:
    - 디자인 컨셉 및 근거
    - 색상 팔레트 (hex, CSS variables)
    - 타이포그래피 위계 (폰트, 사이즈, 웨이트)
    - 스페이싱 스케일
    - 모션/애니메이션 가이드
    - 컴포넌트 스타일 가이드
    - 안티패턴 목록
    - 레퍼런스 출처
    - `## Implementation Instructions for AI Agents` 섹션

12. **설정 파일 생성 (프레임워크 감지 시).**
    - `tailwind.config.*` 확장 또는 `theme.ts` 생성
    - CSS custom properties 파일
    - 폰트 import 설정

13. **임시 파일 정리.** `/tmp/design-prompt-*.md` 삭제.

14. **구현 위임 안내.** "DESIGN.md가 준비되었습니다. `designer` 에이전트에게 구현을 위임하시겠습니까? 구현 완료 후 `/design-review`로 검증할 수 있습니다."
