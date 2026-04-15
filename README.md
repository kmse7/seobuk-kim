# seobuk-kim

Full-stack development framework for Claude Code — from planning to deployment.

## What's included

| Plugin | Skills/Commands | Description |
|--------|----------------|-------------|
| **design-toolkit** | `/design-plan`, `/design-review` | AI-powered design planning and review (Gemini+Codex or Claude-only) |
| **multi-ai-review** | `/review-ai` | External AI code review (Codex or Claude fallback) |
| **devops** | `/cicd-setup` | CI/CD with GitHub Actions self-hosted runner + pm2 |
| **workflow** | `/ultrawork`, `/setup-workspace` | Multi-agent orchestration + infrastructure agents |

## AI Engine Support

All design and review skills support **two modes**:

- **Multi-AI mode**: Uses Gemini CLI (aesthetics) + OpenAI Codex (UX/code) in parallel
- **Claude-only mode**: Automatically falls back to Claude subagents when Gemini/Codex are not installed

No configuration needed — the skills auto-detect available tools.

## Quick Start

```bash
# Add the marketplace
/plugin marketplace add kmse7/seobuk-kim

# Install individual plugins
/plugin install design-toolkit@seobuk-kim
/plugin install multi-ai-review@seobuk-kim
/plugin install devops@seobuk-kim
/plugin install workflow@seobuk-kim
```

## Design Workflow

```
/design-plan → Interview → AI generates 2-3 directions → Critic review → DESIGN.md

/design-review → Screenshot capture → Dual AI review → Reference DESIGN.md enrichment → Action items
```

The design skills integrate with [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) — AI recommends reference design systems from 58+ real websites based on your project context.

## Multi-Agent Orchestration

`/ultrawork` runs a 3-phase pipeline:
1. **Planning**: analyst + explore + critic agents
2. **Execution**: parallel deep-executor agents
3. **Verification**: code-reviewer + test-engineer + security-reviewer

See `docs/CLAUDE.md.example` for recommended global configuration.

## Requirements

- Claude Code CLI
- **Optional**: Gemini CLI (`npm i -g @google/gemini-cli`) for multi-AI design review
- **Optional**: OpenAI Codex CLI for external code review

## License

MIT
