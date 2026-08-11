from typing import Dict, Any, List
from pydantic import BaseModel, Field


class TaskItem(BaseModel):
    id: str
    title: str
    description: str
    agent: str
    skill: str
    dependencies: List[str] = Field(default_factory=list)
    acceptance_criteria: List[str] = Field(default_factory=list)
    status: str = "pending"


class ArchitecturePlan(BaseModel):
    system_overview: str
    recommended_stack: List[str]
    modules: List[str]
    risks: List[str]
    assumptions: List[str]
    tasks: List[TaskItem]


class PlanningSkill:
    name = "planning_skill"
    description = "Convert product requirements into architecture plan and task backlog."

    def __init__(self, model):
        self.model = model.with_structured_output(ArchitecturePlan)

    def run(self, product_requirements: Dict[str, Any]) -> Dict[str, Any]:
        prompt = f"""
You are a Planning and Architecture skill.

Convert the following product requirements into:
1. High-level system architecture
2. Recommended tech stack
3. Main modules
4. Engineering risks
5. Assumptions
6. Task backlog

Important:
- Assign each task to one of these agents only:
  - frontend
  - backend
  - qa
  - reviewer

- Assign a skill for each task, for example:
  - react_generation_skill
  - api_generation_skill
  - test_plan_skill
  - code_review_skill

Product Requirements:
{product_requirements}
"""

        result = self.model.invoke(prompt)

        return result.model_dump()