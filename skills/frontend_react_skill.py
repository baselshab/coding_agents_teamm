from typing import Dict, Any, List
from pydantic import BaseModel, Field


class FrontendReactResult(BaseModel):
    task_id: str
    summary: str
    components_to_create: List[str] = Field(default_factory=list)
    pages_to_create: List[str] = Field(default_factory=list)
    state_management_notes: List[str] = Field(default_factory=list)
    api_integration_notes: List[str] = Field(default_factory=list)
    styling_notes: List[str] = Field(default_factory=list)
    accessibility_notes: List[str] = Field(default_factory=list)
    test_suggestions: List[str] = Field(default_factory=list)


class FrontendReactSkill:
    name = "react_generation_skill"
    description = "Generate frontend React implementation plan for a frontend task."

    def __init__(self, model):
        self.model = model.with_structured_output(FrontendReactResult)

    def run(
        self,
        architecture_plan: Dict[str, Any],
        current_task: Dict[str, Any],
        product_requirements: Dict[str, Any],
        backend_output: List[Dict[str, Any]],
    ) -> Dict[str, Any]:

        prompt = f"""
You are a Frontend React Generation Skill.

Your job is to generate a frontend implementation plan for the current task.

Product Requirements:
{product_requirements}

Architecture Plan:
{architecture_plan}

Backend Output:
{backend_output}

Current Task:
{current_task}

Return:
1. Task ID
2. Summary
3. Components to create
4. Pages to create
5. State management notes
6. API integration notes
7. Styling notes
8. Accessibility notes
9. Test suggestions

Important:
- Focus only on frontend.
- Do not create backend code.
- Use React or Next.js style architecture.
- If backend endpoints are needed, infer them from backend output when available.
- Keep the implementation consistent with the architecture plan.
"""

        result = self.model.invoke(prompt)

        return result.model_dump()