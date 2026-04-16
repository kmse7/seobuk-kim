#!/bin/bash
# Claude Code Statusline — 컨텍스트 현황, 비용, 모델, rate limit 표시
input=$(cat)

MODEL=$(echo "$input" | jq -r '.model.display_name')
PCT=$(echo "$input" | jq -r '.context_window.used_percentage // 0' | cut -d. -f1)
COST=$(echo "$input" | jq -r '.cost.total_cost_usd // 0')
FIVE_H=$(echo "$input" | jq -r '.rate_limits.five_hour.used_percentage // empty')

GREEN='\033[32m'; YELLOW='\033[33m'; RED='\033[31m'; RESET='\033[0m'

if [ "$PCT" -ge 90 ]; then BAR_COLOR="$RED"
elif [ "$PCT" -ge 70 ]; then BAR_COLOR="$YELLOW"
else BAR_COLOR="$GREEN"; fi

BAR_WIDTH=10
FILLED=$((PCT * BAR_WIDTH / 100)); EMPTY=$((BAR_WIDTH - FILLED))
BAR=""; [ "$FILLED" -gt 0 ] && printf -v FILL "%${FILLED}s" && BAR="${FILL// /▓}"
[ "$EMPTY" -gt 0 ] && printf -v PAD "%${EMPTY}s" && BAR="${BAR}${PAD// /░}"

COST_FMT=$(printf '$%.2f' "$COST")
LIMITS=""
[ -n "$FIVE_H" ] && LIMITS=" | 5h: $(printf '%.0f' "$FIVE_H")%"

echo -e "${BAR_COLOR}${BAR}${RESET} ${PCT}% | [$MODEL] ${YELLOW}${COST_FMT}${RESET}${LIMITS}"
