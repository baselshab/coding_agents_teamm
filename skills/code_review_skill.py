from typing import Dict, Any, List
from pydantic import BaseModel, Field


class CodeReviewResult(BaseModel):
    task_id: str
    decision: str = Field(description="PASS or REWORK")
    summary: str
    architecture_feedback: List[str] = Field(default_factory=list)
    code_quality_feedback: List[str] = Field(default_factory=list)
    security_feedback: List[str] = Field(default_factory=list)
    performance_feedback: List[str] = Field(default_factory=list)
    maintainability_feedback: List[str] = Field(default_factory=list)
    required_changes: List[str] = Field(default_factory=list)
    release_readiness_notes: List[str] = Field(default_factory=list)


class CodeReviewSkill:
    name = "code_review_skill"
    description = "Review outputs from backend, frontend, and QA and decide PASS or REWORK."

    def __init__(self, model):
        self.model = model.with_structured_output(CodeReviewResult)

    def run(
        self,
        product_requirements: Dict[str, Any],
        architecture_plan: Dict[str, Any],
        current_task: Dict[str, Any],
        backend_output: List[Dict[str, Any]],
        frontend_output: List[Dict[str, Any]],
        qa_output: List[Dict[str, Any]],
    ) -> Dict[str, Any]:

        prompt = f"""
You are a Senior Code Reviewer Agent.

Your job is to review the overall implementation plan and QA coverage.

Product Requirements:
{product_requirements}

Architecture Plan:
{architecture_plan}

Backend Output:
{backend_output}

Frontend Output:
{frontend_output}

QA Output:
{qa_output}

Current Review Task:
{current_task}

Return:
1. Task ID
2. Decision: PASS or REWORK
3. Summary
4. Architecture feedback
5. Code quality feedback
6. Security feedback
7. Performance feedback
8. Maintainability feedback
9. Required changes
10. Release readiness notes

Important:
- Be strict but practical.
- If there are critical missing pieces, choose REWORK.
- If the MVP is coherent and testable, choose PASS.
- Do not write code.
- Focus on review, consistency, security, maintainability, and readiness.
"""

        result = self.model.invoke(prompt)

        data = result.model_dump()

        decision = str(data.get("decision", "")).upper().strip()
        if decision not in ["PASS", "REWORK"]:
            data["decision"] = "REWORK"
        else:
            data["decision"] = decision

        return data
