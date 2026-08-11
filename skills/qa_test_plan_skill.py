from typing import Dict, Any, List
from pydantic import BaseModel, Field


class QATestPlanResult(BaseModel):
    task_id: str
    summary: str
    test_strategy: List[str] = Field(default_factory=list)
    unit_tests: List[str] = Field(default_factory=list)
    integration_tests: List[str] = Field(default_factory=list)
    e2e_tests: List[str] = Field(default_factory=list)
    regression_tests: List[str] = Field(default_factory=list)
    risk_areas: List[str] = Field(default_factory=list)
    acceptance_checks: List[str] = Field(default_factory=list)


class QATestPlanSkill:
    name = "test_plan_skill"
    description = "Generate QA test plan for backend and frontend outputs."

    def __init__(self, model):
        self.model = model.with_structured_output(QATestPlanResult)

    def run(
        self,
        product_requirements: Dict[str, Any],
        architecture_plan: Dict[str, Any],
        current_task: Dict[str, Any],
        backend_output: List[Dict[str, Any]],
        frontend_output: List[Dict[str, Any]],
    ) -> Dict[str, Any]:

        prompt = f"""
You are a QA / Testing Skill.

Your job is to create a comprehensive QA test plan for the current QA task.

Product Requirements:
{product_requirements}

Architecture Plan:
{architecture_plan}

Backend Output:
{backend_output}

Frontend Output:
{frontend_output}

Current QA Task:
{current_task}

Return:
1. Task ID
2. Summary
3. Test strategy
4. Unit tests
5. Integration tests
6. End-to-end tests
7. Regression tests
8. Risk areas
9. Acceptance checks

Important:
- Do not write production code.
- Focus only on QA and test planning.
- Cover authentication, projects, tasks, comments, permissions, and UI flows.
- Make sure tests map back to acceptance criteria.
"""

        result = self.model.invoke(prompt)

        return result.model_dump()