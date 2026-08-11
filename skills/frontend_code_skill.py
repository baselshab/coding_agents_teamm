from typing import Dict, Any, List
from pydantic import BaseModel, Field


class GeneratedFrontendFile(BaseModel):
    path: str = Field(description="Relative file path inside generated_project")
    content: str = Field(description="Full file content")


class FrontendCodeResult(BaseModel):
    task_id: str
    summary: str
    files: List[GeneratedFrontendFile] = Field(default_factory=list)


class FrontendCodeSkill:
    name = "frontend_code_skill"
    description = "Generate real React frontend source code files from a frontend implementation plan."

    def __init__(self, model):
        self.model = model.with_structured_output(FrontendCodeResult)

    def run(
        self,
        product_requirements: Dict[str, Any],
        architecture_plan: Dict[str, Any],
        current_task: Dict[str, Any],
        frontend_plan: Dict[str, Any],
        backend_output: List[Dict[str, Any]],
    ) -> Dict[str, Any]:

        prompt = f"""
You are a Frontend Code Generation Skill.

Your job is to generate real React frontend project files for the current frontend task.

Product Requirements:
{product_requirements}

Architecture Plan:
{architecture_plan}

Current Task:
{current_task}

Frontend Implementation Plan:
{frontend_plan}

Backend Output:
{backend_output}

Generate actual frontend code files.

Rules:
- Generate React code.
- Use JavaScript, not TypeScript.
- Use functional components.
- Use React hooks where needed.
- Use TailwindCSS classes for styling.
- Do not create backend files.
- All paths must start with: frontend/
- Use this folder structure only:
  - frontend/package.json
  - frontend/index.html
  - frontend/src/main.jsx
  - frontend/src/App.jsx
  - frontend/src/api/apiClient.js
  - frontend/src/context/AuthContext.jsx
  - frontend/src/pages/
  - frontend/src/components/
- Keep each file complete and usable.
- Do not include markdown fences in file content.
- Do not explain outside the structured output.
- If a file already logically exists, still return the latest complete version for this task.

Important:
- API calls should use fetch.
- Use backend endpoints from Backend Output when available.
- If endpoints are missing, infer reasonable endpoint paths from the backend plans.
- Use localStorage for JWT token in this MVP.
- Protected pages may assume token exists.
- Keep code simple and readable.

Return:
1. task_id
2. summary
3. files: list of path/content objects
"""

        result = self.model.invoke(prompt)

        return result.model_dump()