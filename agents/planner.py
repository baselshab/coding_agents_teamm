class PlannerAgent:
    name = "planner"

    def __init__(self, planning_skill):
        self.planning_skill = planning_skill

    def run(self, state):
        product_requirements = state["product_requirements"]

        planning_result = self.planning_skill.run(product_requirements)

        messages = state.get("messages", [])
        messages.append("Planner completed architecture plan and task backlog.")

        return {
            **state,
            "architecture_plan": {
                "system_overview": planning_result.get("system_overview"),
                "recommended_stack": planning_result.get("recommended_stack"),
                "modules": planning_result.get("modules"),
                "risks": planning_result.get("risks"),
                "assumptions": planning_result.get("assumptions"),
            },
            "task_backlog": planning_result.get("tasks", []),
            "messages": messages,
            "status": "planning_done",
            "next_agent": "orchestrator"
        }