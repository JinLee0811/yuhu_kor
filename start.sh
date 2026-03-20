#!/bin/bash

SESSION="yuhu"
ROOT="$(cd "$(dirname "$0")" && pwd)"

# 기존 세션 있으면 종료
tmux kill-session -t $SESSION 2>/dev/null

# 새 세션 생성 (첫 창: dev)
tmux new-session -d -s $SESSION -n dev -x 220 -y 50

# ── 레이아웃 구성 ──────────────────────────────────────────
# 1. 수직 분할: 왼쪽(70%) | 오른쪽 leader(30%)
tmux split-window -h -t $SESSION:dev -p 30

# 오른쪽 창 → leader
tmux rename-window -t $SESSION:dev "layout"
tmux send-keys -t $SESSION:layout.right "" Enter   # 오른쪽 패널 포커스용

# 2. 왼쪽을 가로 분할: 위(dev+data) | 아래(marketer+researcher)
tmux split-window -v -t $SESSION:layout.left -p 50

# 3. 위쪽 왼쪽 패널 → 세로 분할: dev(좌) | data(우)
tmux split-window -h -t $SESSION:layout.0 -p 50

# 4. 아래쪽 왼쪽 패널 → 세로 분할: marketer(좌) | researcher(우)
tmux split-window -h -t $SESSION:layout.2 -p 50

# ── 패널 이름 설정 (select-pane -T) ───────────────────────
tmux select-pane -t $SESSION:layout.0 -T "dev"
tmux select-pane -t $SESSION:layout.1 -T "data"
tmux select-pane -t $SESSION:layout.2 -T "marketer"
tmux select-pane -t $SESSION:layout.3 -T "researcher"
tmux select-pane -t $SESSION:layout.4 -T "leader"

# ── 각 패널에서 프로젝트 디렉토리 이동 후 Claude 실행 ─────
tmux send-keys -t $SESSION:layout.0 "cd \"$ROOT\" && claude --dangerously-skip-permissions --system-prompt agents/DEVELOPER.md" Enter
tmux send-keys -t $SESSION:layout.1 "cd \"$ROOT\" && claude --dangerously-skip-permissions --system-prompt agents/DATA.md" Enter
tmux send-keys -t $SESSION:layout.2 "cd \"$ROOT\" && claude --dangerously-skip-permissions --system-prompt agents/MARKETER.md" Enter
tmux send-keys -t $SESSION:layout.3 "cd \"$ROOT\" && claude --dangerously-skip-permissions --system-prompt agents/RESEARCHER.md" Enter
tmux send-keys -t $SESSION:layout.4 "cd \"$ROOT\" && claude --dangerously-skip-permissions --system-prompt agents/LEADER.md" Enter

# leader 패널로 포커스
tmux select-pane -t $SESSION:layout.4

# 세션 attach
tmux attach-session -t $SESSION
