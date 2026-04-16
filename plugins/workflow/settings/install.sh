#!/bin/bash
# seobuk-kim framework — 원클릭 설정 스크립트
# 사용법: bash install.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CLAUDE_DIR="$HOME/.claude"
SETTINGS_FILE="$CLAUDE_DIR/settings.json"

echo "⚡ seobuk-kim framework 설정을 시작합니다..."
echo ""

# 1. statusline.sh 복사
echo "📊 Statusline 설치 중..."
cp "$SCRIPT_DIR/statusline.sh" "$CLAUDE_DIR/statusline.sh"
chmod +x "$CLAUDE_DIR/statusline.sh"
echo "   ✅ ~/.claude/statusline.sh 설치 완료"

# 2. settings.json 병합 (기존 설정 보존)
echo "⚙️  Settings 설정 중..."

if [ -f "$SETTINGS_FILE" ]; then
  echo "   기존 settings.json 발견 — 백업 후 병합합니다"
  cp "$SETTINGS_FILE" "$SETTINGS_FILE.backup.$(date +%Y%m%d_%H%M%S)"

  # jq로 병합 (기존 설정 유지하면서 새 설정 추가)
  if command -v jq &> /dev/null; then
    EXAMPLE="$SCRIPT_DIR/settings.json.example"
    jq -s '.[0] * .[1]' "$SETTINGS_FILE" "$EXAMPLE" > "$SETTINGS_FILE.tmp"
    mv "$SETTINGS_FILE.tmp" "$SETTINGS_FILE"
    echo "   ✅ 기존 설정에 병합 완료"
  else
    echo "   ⚠️  jq가 없어서 자동 병합 불가. 수동으로 병합해주세요:"
    echo "   참고 파일: $SCRIPT_DIR/settings.json.example"
  fi
else
  echo "   새 settings.json 생성"
  cp "$SCRIPT_DIR/settings.json.example" "$SETTINGS_FILE"
  echo "   ✅ settings.json 생성 완료"
fi

# 3. 설정 확인
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 설치 완료! 적용된 설정:"
echo ""
echo "  📊 Statusline    — 컨텍스트 사용량, 비용, 모델 실시간 표시"
echo "  🔓 Permission    — bypassPermissions (매번 허락 안 물어봄)"
echo "  🧹 Auto Compact  — 80% 차면 자동 메모리 정리"
echo "  📌 PreCompact    — 정리할 때 중요 정보 보존"
echo "  🔍 ToolSearch    — MCP 도구 자동 탐색 (지연 로드)"
echo "  🌳 Worktree      — node_modules 등 심볼릭 링크"
echo "  🗑️  Cleanup       — 14일 지난 대화 기록 자동 삭제"
echo ""
echo "💡 새 세션에서 적용됩니다. claude를 다시 시작하세요."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
