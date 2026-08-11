from typing import Dict, Any, List
from pydantic import BaseModel, Field


class BackendApiResult(BaseModel):
    task_id: str
    summary: str
    files_to_create: List[str] = Field(default_factory=list)
    api_endpoints: List[str] = Field(default_factory=list)
    data_models: List[str] = Field(default_factory=list)
    implementation_notes: List[str] = Field(default_factory=list)
    security_notes: List[str] = Field(default_factory=list)
    test_suggestions: List[str] = Field(default_factory=list)


class BackendApiSkill:
    name = "api_generation_skill"
    description = "Generate backend API implementation plan for a backend task."

    def __init__(self, model):
        self.model = model.with_structured_output(BackendApiResult)

    def run(
        self,
        architecture_plan: Dict[str, Any],
        current_task: Dict[str, Any],
        product_requirements: Dict[str, Any],
    ) -> Dict[str, Any]:

        prompt = f"""
You are a Backend API Generation Skill.

Your job is to generate a backend implementation plan for the current task.

Product Requirements:
{product_requirements}

Architecture Plan:
{architecture_plan}

Current Task:
{current_task}

Return:
1. Task ID
2. Summary
3. Files to create
4. API endpoints
5. Data models
6. Implementation notes
7. Security notes
8. Test suggestions

Important:
- Focus only on backend.
- Do not create frontend code.
- Do not change the overall architecture.
- If the task requires database changes, mention them as data models or migration notes.
"""

        result = self.model.invoke(prompt)

        return result.model_dump()