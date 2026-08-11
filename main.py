from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

from skills.requirements_skill import RequirementsSkill
from skills.planning_skill import PlanningSkill
from skills.backend_api_skill import BackendApiSkill
from skills.backend_code_skill import BackendCodeSkill
from skills.frontend_react_skill import FrontendReactSkill
from skills.frontend_code_skill import FrontendCodeSkill
from skills.qa_test_plan_skill import QATestPlanSkill
from skills.code_review_skill import CodeReviewSkill

from agents.product_owner import ProductOwnerAgent
from agents.planner import PlannerAgent
from agents.orchestrator import OrchestratorAgent
from agents.backend import BackendAgent
from agents.frontend import FrontendAgent
from agents.qa import QAAgent
from agents.reviewer import ReviewerAgent

from tools.file_writer import FileWriterTool

from graph.workflow import build_graph


load_dotenv()


def main():
    # 1. LLM model
    model = ChatGoogleGenerativeAI(
        model="gemini-3.5-flash-lite"
    )

    # 2. Tools
    file_writer = FileWriterTool(
        base_dir="generated_project"
    )

    # 3. Skills
    requirements_skill = RequirementsSkill(model)
    planning_skill = PlanningSkill(model)

    backend_api_skill = BackendApiSkill(model)
    backend_code_skill = BackendCodeSkill(model)

    frontend_react_skill = FrontendReactSkill(model)
    frontend_code_skill = FrontendCodeSkill(model)

    qa_test_plan_skill = QATestPlanSkill(model)
    code_review_skill = CodeReviewSkill(model)

    # 4. Agents
    product_owner_agent = ProductOwnerAgent(
        requirements_skill=requirements_skill
    )

    planner_agent = PlannerAgent(
        planning_skill=planning_skill
    )

    orchestrator_agent = OrchestratorAgent()

    backend_agent = BackendAgent(
        api_generation_skill=backend_api_skill,
        backend_code_skill=backend_code_skill,
        file_writer=file_writer
    )

    frontend_agent = FrontendAgent(
        react_generation_skill=frontend_react_skill,
        frontend_code_skill=frontend_code_skill,
        file_writer=file_writer
    )

    qa_agent = QAAgent(
        test_plan_skill=qa_test_plan_skill
    )

    reviewer_agent = ReviewerAgent(
        code_review_skill=code_review_skill
    )

    # 5. Build graph
    graph = build_graph(
        product_owner_agent=product_owner_agent,
        planner_agent=planner_agent,
        orchestrator_agent=orchestrator_agent,
        backend_agent=backend_agent,
        frontend_agent=frontend_agent,
        qa_agent=qa_agent,
        reviewer_agent=reviewer_agent,
    )

    # 6. Initial state
    initial_state = {
        "user_request": "I want to build a SaaS app for managing tasks, projects, users, and team collaboration.",
        "product_requirements": None,
        "architecture_plan": None,
        "task_backlog": None,
        "current_task": None,
        "backend_output": [],
        "frontend_output": [],
        "qa_output": [],
        "review_output": [],
        "generated_files": [],
        "messages": [],
        "next_agent": None,
        "status": "start"
    }

    # 7. Run graph
    result = graph.invoke(initial_state)

    # 8. Print result
    print("\n==============================")
    print("STATUS")
    print("==============================")
    print(result.get("status"))

    print("\n==============================")
    print("NEXT AGENT")
    print("==============================")
    print(result.get("next_agent"))

    print("\n==============================")
    print("MESSAGES")
    print("==============================")
    for message in result.get("messages", []):
        print("-", message)

    print("\n==============================")
    print("CURRENT TASK")
    print("==============================")
    print(result.get("current_task"))

    print("\n==============================")
    print("TASK BACKLOG")
    print("==============================")
    for task in result.get("task_backlog", []):
        print(
            f"- {task.get('id')} | {task.get('status')} | {task.get('agent')} | {task.get('title')}"
        )

    print("\n==============================")
    print("GENERATED FILES")
    print("==============================")
    for item in result.get("generated_files", []):
        print(
            f"- {item.get('task_id')} | {item.get('agent')} | {item.get('status')} | {item.get('path')}"
        )

    print("\n==============================")
    print("BACKEND OUTPUT")
    print("==============================")
    for item in result.get("backend_output", []):
        print(item)

    print("\n==============================")
    print("FRONTEND OUTPUT")
    print("==============================")
    for item in result.get("frontend_output", []):
        print(item)

    print("\n==============================")
    print("QA OUTPUT")
    print("==============================")
    for item in result.get("qa_output", []):
        print(item)

    print("\n==============================")
    print("REVIEW OUTPUT")
    print("==============================")
    for item in result.get("review_output", []):
        print(item)


if __name__ == "__main__":
    main()