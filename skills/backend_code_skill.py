from typing import Dict, Any, List
from pydantic import BaseModel, Field


class GeneratedCodeFile(BaseModel):
    path: str = Field(description="Relative file path inside generated_project")
    content: str = Field(description="Full file content")


class BackendCodeResult(BaseModel):
    task_id: str
    summary: str
    files: List[GeneratedCodeFile] = Field(default_factory=list)


class BackendCodeSkill:
    name = "backend_code_skill"
    description = "Generate real backend source code files from a backend implementation plan."

    def __init__(self, model):
        self.model = model.with_structured_output(BackendCodeResult)

    def run(
        self,
        product_requirements: Dict[str, Any],
        architecture_plan: Dict[str, Any],
        current_task: Dict[str, Any],
        backend_plan: Dict[str, Any],
    ) -> Dict[str, Any]:

        prompt = f"""
You are a Backend Code Generation Skill.

Your job is to generate real backend project files for the current backend task.

Product Requirements:
{product_requirements}

Architecture Plan:
{architecture_plan}

Current Task:
{current_task}

Backend Implementation Plan:
{backend_plan}

Generate actual backend code files.

Rules:
- Generate Node.js + Express backend code.
- Use CommonJS syntax: require/module.exports.
- Use JavaScript only.
- Do not use TypeScript.
- Use simple, readable code.
- Do not create frontend files.
- All paths must start with: backend/

Backend folder structure rules:
- Use this backend folder structure only:
  - backend/package.json
  - backend/.env.example
  - backend/src/server.js
  - backend/src/config/
  - backend/src/models/
  - backend/src/controllers/
  - backend/src/routes/
  - backend/src/middleware/
  - backend/src/utils/
  - backend/migrations/

Strict path rules:
- Never use backend/server/
- Never use server/
- Never use backend/app/
- Never use app/
- Never place source files directly inside backend/ except package.json and .env.example.
- Controllers must go inside backend/src/controllers/
- Routes must go inside backend/src/routes/
- Models must go inside backend/src/models/
- Middleware must go inside backend/src/middleware/
- Config files must go inside backend/src/config/
- Utility files must go inside backend/src/utils/
- SQL migrations must go inside backend/migrations/

Implementation rules:
- Generate only files relevant to the current task.
- Keep each file complete and usable.
- If a database model is needed, create a simple model file.
- If a migration is needed, create a SQL migration file inside backend/migrations/.
- If a route is needed, create an Express router file.
- If a controller is needed, create a controller file.
- If middleware is needed, create a middleware file.
- If server.js is needed, make sure it imports routes from backend/src/routes/.
- Do not include markdown fences in file content.
- Do not explain outside the structured output.

Security rules:
- Never hardcode secrets.
- Use process.env for secrets and configuration.
- Hash passwords with bcrypt where authentication is involved.
- Use JWT verification middleware where protected routes are involved.
- Validate and sanitize user input where relevant.

Return:
1. task_id
2. summary
3. files: list of path/content objects

Example valid file paths:
- backend/package.json
- backend/.env.example
- backend/src/server.js
- backend/src/config/db.js
- backend/src/models/userModel.js
- backend/src/controllers/authController.js
- backend/src/routes/authRoutes.js
- backend/src/middleware/authMiddleware.js
- backend/src/utils/tokenUtils.js
- backend/migrations/001_create_users_table.sql

Example invalid file paths:
- backend/server/models/commentModel.js
- backend/server/controllers/commentController.js
- backend/server/routes/commentRoutes.js
- server/models/commentModel.js
- server/routes/authRoutes.js
"""

        result = self.model.invoke(prompt)

        data = result.model_dump()

        # Safety cleanup: normalize bad paths if the model still returns them.
        cleaned_files = []

        for file_item in data.get("files", []):
            path = file_item.get("path", "")
            content = file_item.get("content", "")

            if not path:
                continue

            # Normalize common incorrect paths
            path = path.replace("\\", "/")

            if path.startswith("backend/server/"):
                path = path.replace("backend/server/", "backend/src/", 1)

            if path.startswith("server/"):
                path = path.replace("server/", "backend/src/", 1)

            if path.startswith("backend/app/"):
                path = path.replace("backend/app/", "backend/src/", 1)

            if path.startswith("app/"):
                path = path.replace("app/", "backend/src/", 1)

            # Ensure every path starts with backend/
            if not path.startswith("backend/"):
                path = f"backend/{path}"

            # Final guard: do not allow backend/server after cleanup
            if "backend/server/" in path:
                path = path.replace("backend/server/", "backend/src/")

            cleaned_files.append({
                "path": path,
                "content": content
            })

        data["files"] = cleaned_files

        return data