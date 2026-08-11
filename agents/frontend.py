class FrontendAgent:
    name = "frontend"

    def __init__(self, react_generation_skill, frontend_code_skill=None, file_writer=None):
        self.react_generation_skill = react_generation_skill
        self.frontend_code_skill = frontend_code_skill
        self.file_writer = file_writer

    def run(self, state):
        current_task = state.get("current_task")

        if not current_task:
            messages = state.get("messages", [])
            messages.append("Frontend Agent received no current task.")

            return {
                **state,
                "messages": messages,
                "status": "frontend_no_task",
                "next_agent": "orchestrator"
            }

        # 1. Generate frontend implementation plan
        frontend_plan = self.react_generation_skill.run(
            architecture_plan=state.get("architecture_plan"),
            current_task=current_task,
            product_requirements=state.get("product_requirements"),
            backend_output=state.get("backend_output") or [],
        )

        frontend_output = state.get("frontend_output") or []
        frontend_output.append(frontend_plan)

        generated_files = state.get("generated_files") or []
        messages = state.get("messages", [])

        # 2. Generate real frontend code files if frontend_code_skill and file_writer exist
        if self.frontend_code_skill and self.file_writer:
            code_result = self.frontend_code_skill.run(
                product_requirements=state.get("product_requirements"),
                architecture_plan=state.get("architecture_plan"),
                current_task=current_task,
                frontend_plan=frontend_plan,
                backend_output=state.get("backend_output") or [],
            )

            files = code_result.get("files", [])

            for file_item in files:
                relative_path = file_item.get("path")
                content = file_item.get("content")

                if not relative_path or content is None:
                    continue

                write_result = self.file_writer.write_file(
                    relative_path=relative_path,
                    content=content
                )

                generated_files.append({
                    "task_id": current_task.get("id"),
                    "agent": "frontend",
                    "path": write_result.get("relative_path"),
                    "status": write_result.get("status")
                })

            messages.append(
                f"Frontend Agent generated {len(files)} code file(s) for {current_task.get('id')}."
            )

        # 3. Mark current task as done
        task_backlog = state.get("task_backlog") or []

        for task in task_backlog:
            if task.get("id") == current_task.get("id"):
                task["status"] = "done"
                break

        messages.append(
            f"Frontend Agent completed {current_task.get('id')}."
        )

        # 4. Return to orchestrator
        return {
            **state,
            "task_backlog": task_backlog,
            "frontend_output": frontend_output,
            "generated_files": generated_files,
            "current_task": None,
            "messages": messages,
            "status": "frontend_done",
            "next_agent": "orchestrator"
        }