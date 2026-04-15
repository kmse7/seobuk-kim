Set up a cmux multi-agent workspace for the current project. Follow these steps:

## 1. Create Workspaces
Use cmux CLI to create named workspaces for parallel agent work:

```bash
# Main orchestrator workspace (you are here)
cmux rename-workspace "orchestrator"

# Create worker workspaces
cmux new-workspace --cwd "$PWD"
cmux rename-workspace "planner"

cmux new-workspace --cwd "$PWD"
cmux rename-workspace "builder-1"

cmux new-workspace --cwd "$PWD"
cmux rename-workspace "builder-2"

cmux new-workspace --cwd "$PWD"
cmux rename-workspace "reviewer"
```

## 2. Start Claude Code in Each Workspace
Send commands to start claude in each worker workspace:

```bash
cmux send --workspace "planner" "claude"
cmux send-key --workspace "planner" "enter"

cmux send --workspace "builder-1" "claude"
cmux send-key --workspace "builder-1" "enter"

cmux send --workspace "builder-2" "claude"
cmux send-key --workspace "builder-2" "enter"

cmux send --workspace "reviewer" "claude"
cmux send-key --workspace "reviewer" "enter"
```

## 3. Dispatch Tasks
Send prompts to specific workspaces:

```bash
# Example: send a planning task
cmux send --workspace "planner" "Create a plan for $ARGUMENTS"
cmux send-key --workspace "planner" "enter"
```

## 4. Monitor Progress
```bash
# Read what any agent is doing
cmux read-screen --workspace "planner"
cmux read-screen --workspace "builder-1"

# Check all notifications
cmux list-notifications
```

## Task
$ARGUMENTS