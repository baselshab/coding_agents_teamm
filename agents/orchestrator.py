class OrchestratorAgent:
    name = "orchestrator"

    def run(self, state):
        backlog = state.get("task_backlog") or []
        messages = state.get("messages", [])

        # Normalize task statuses
        for task in backlog:
            status = str(task.get("status", "")).lower().strip()

            if status in ["todo", "to_do", "not_started", "new", "open", ""]:
                task["status"] = "pending"

        pending_tasks = [
            task for task in backlog
            if task.get("status") == "pending"
        ]

        if not pending_tasks:
            messages.append("Orchestrator found no pending tasks. Workflow completed.")

            return {
                **state,
                "task_backlog": backlog,
                "current_task": None,
                "messages": messages,
                "status": "done",
                "next_agent": "end"
            }

        current_task = pending_tasks[0]
        assigned_agent = current_task.get("agent")

        messages.append(
            f"Orchestrator assigned {current_task.get('id')} to {assigned_agent}."
        )

        return {
            **state,
            "task_backlog": backlog,
            "current_task": current_task,
            "messages": messages,
            "status": "task_assigned",
            "next_agent": assigned_agent
        }