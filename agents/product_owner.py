class ProductOwnerAgent:
    name = "product_owner"

    def __init__(self, requirements_skill):
        self.requirements_skill = requirements_skill

    def run(self, state):
        user_request = state["user_request"]

        requirements = self.requirements_skill.run(user_request)

        messages = state.get("messages", [])
        messages.append("Product Owner completed product requirements.")

        return {
            **state,
            "product_requirements": requirements,
            "messages": messages,
            "status": "product_done",
            "next_agent": "planner"
        }