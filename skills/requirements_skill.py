from typing import Dict, Any
from pydantic import BaseModel, Field


class ProductRequirements(BaseModel):
    app_name: str = Field(description="Suggested product name")
    problem_statement: str
    target_users: list[str]
    mvp_features: list[str]
    user_stories: list[str]
    acceptance_criteria: list[str]
    out_of_scope: list[str]


class RequirementsSkill:
    name = "requirements_skill"
    description = "Convert raw user idea into structured product requirements."

    def __init__(self, model):
        self.model = model.with_structured_output(ProductRequirements)

    def run(self, user_request: str) -> Dict[str, Any]:
        prompt = f"""
You are a Product Requirements skill.

Convert the following idea into structured product requirements.

User idea:
{user_request}

Focus on:
- MVP
- Clear features
- User stories
- Acceptance criteria
- What is out of scope
"""

        result = self.model.invoke(prompt)

        return result.model_dump()