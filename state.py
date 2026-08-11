from typing import TypedDict, Optional, List, Dict, Any


class CodingTeamState(TypedDict):
    # Original user request / product idea
    user_request: str

    # Product Owner output
    product_requirements: Optional[Dict[str, Any]]

    # Planner / Architect output
    architecture_plan: Optional[Dict[str, Any]]

    # Planner generated backlog
    task_backlog: Optional[List[Dict[str, Any]]]

    # Current task assigned by Orchestrator
    current_task: Optional[Dict[str, Any]]

    # Backend Agent outputs
    backend_output: Optional[List[Dict[str, Any]]]

    # Frontend Agent outputs
    frontend_output: Optional[List[Dict[str, Any]]]

    # QA Agent outputs
    qa_output: Optional[List[Dict[str, Any]]]

    # Reviewer Agent outputs
    review_output: Optional[List[Dict[str, Any]]]

    # Files actually written by FileWriterTool
    generated_files: Optional[List[Dict[str, Any]]]

    # Execution log messages
    messages: List[str]

    # Routing field used by LangGraph
    next_agent: Optional[str]

    # Current workflow status
    status: str