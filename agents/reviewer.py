class ReviewerAgent:
    name = "reviewer"

    def __init__(self, code_review_skill):
        self.code_review_skill = code_review_skill

    def run(self, state):
        current_task = state.get("current_task")

        if not current_task:
            messages = state.get("messages", [])
            messages.append("Reviewer Agent received no current task.")

            return {
                **state,
                "messages": messages,
                "status": "reviewer_no_task",
                "next_agent": "orchestrator"
            }

        result = self.code_review_skill.run(
            product_requirements=state.get("product_requirements"),
            architecture_plan=state.get("architecture_plan"),
            current_task=current_task,
            backend_output=state.get("backend_output") or [],
            frontend_output=state.get("frontend_output") or [],
            qa_output=state.get("qa_output") or [],
        )

        review_output = state.get("review_output") or []
        review_output.append(result)

        task_backlog = state.get("task_backlog") or []

        for task in task_backlog:
            if task.get("id") == current_task.get("id"):
                task["status"] = "done"
                break

        decision = result.get("decision", "REWORK")

        messages = state.get("messages", [])
        messages.append(
            f"Reviewer Agent completed {current_task.get('id')} with decision: {decision}."
        )

        if decision == "PASS":
            status = "review_passed"
        else:
            status = "review_rework_needed"

        return {
            **state,
            "task_backlog": task_backlog,
            "review_output": review_output,
            "current_task": None,
            "messages": messages,
            "status": status,
            "next_agent": "orchestrator"
        }
