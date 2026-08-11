class BackendAgent:
    name = "backend"

    def __init__(self, api_generation_skill, backend_code_skill=None, file_writer=None):
        self.api_generation_skill = api_generation_skill
        self.backend_code_skill = backend_code_skill
        self.file_writer = file_writer

    def run(self, state):
        current_task = state.get("current_task")

        if not current_task:
            messages = state.get("messages", [])
            messages.append("Backend Agent received no current task.")

            return {
                **state,
                "messages": messages,
                "status": "backend_no_task",
                "next_agent": "orchestrator"
            }

        # 1. Generate backend implementation plan
        backend_plan = self.api_generation_skill.run(
            architecture_plan=state.get("architecture_plan"),
            current_task=current_task,
            product_requirements=state.get("product_requirements"),
        )

        backend_output = state.get("backend_output") or []
        backend_output.append(backend_plan)

        generated_files = state.get("generated_files") or []
        messages = state.get("messages", [])

        # 2. Generate real backend code files if backend_code_skill and file_writer exist
        if self.backend_code_skill and self.file_writer:
            code_result = self.backend_code_skill.run(
                product_requirements=state.get("product_requirements"),
                architecture_plan=state.get("architecture_plan"),
                current_task=current_task,
                backend_plan=backend_plan,
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
                    "agent": "backend",
                    "path": write_result.get("relative_path"),
                    "status": write_result.get("status")
                })

            messages.append(
                f"Backend Agent generated {len(files)} code file(s) for {current_task.get('id')}."
            )

        # 3. Mark current task as done
        task_backlog = state.get("task_backlog") or []

        for task in task_backlog:
            if task.get("id") == current_task.get("id"):
                task["status"] = "done"
                break

        messages.append(
            f"Backend Agent completed {current_task.get('id')}."
        )

        # 4. Return to orchestrator
        return {
            **state,
            "task_backlog": task_backlog,
            "backend_output": backend_output,
            "generated_files": generated_files,
            "current_task": None,
            "messages": messages,
            "status": "backend_done",
            "next_agent": "orchestrator"
        }