class QAAgent:
    name = "qa"

    def __init__(self, test_plan_skill):
        self.test_plan_skill = test_plan_skill

    def run(self, state):
        current_task = state.get("current_task")

        if not current_task:
            messages = state.get("messages", [])
            messages.append("QA Agent received no current task.")

            return {
                **state,
                "messages": messages,
                "status": "qa_no_task",
                "next_agent": "orchestrator"
            }

        result = self.test_plan_skill.run(
            product_requirements=state.get("product_requirements"),
            architecture_plan=state.get("architecture_plan"),
            current_task=current_task,
            backend_output=state.get("backend_output") or [],
            frontend_output=state.get("frontend_output") or [],
        )

        qa_output = state.get("qa_output") or []
        qa_output.append(result)

        task_backlog = state.get("task_backlog") or []

        for task in task_backlog:
            if task.get("id") == current_task.get("id"):
                task["status"] = "done"
                break

        messages = state.get("messages", [])
        messages.append(
            f"QA Agent completed {current_task.get('id')}."
        )

        return {
            **state,
            "task_backlog": task_backlog,
            "qa_output": qa_output,
            "current_task": None,
            "messages": messages,
            "status": "qa_done",
            "next_agent": "orchestrator"
        }