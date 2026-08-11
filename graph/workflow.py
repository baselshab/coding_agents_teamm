from langgraph.graph import StateGraph, START, END
from state import CodingTeamState


def route_next(state: CodingTeamState):
    next_agent = state.get("next_agent")

    if next_agent == "planner":
        return "planner"

    if next_agent == "orchestrator":
        return "orchestrator"

    if next_agent == "backend":
        return "backend"

    if next_agent == "frontend":
        return "frontend"

    if next_agent == "qa":
        return "qa"

    if next_agent == "reviewer":
        return "reviewer"

    if next_agent == "end":
        return END

    return END


def build_graph(
    product_owner_agent,
    planner_agent,
    orchestrator_agent,
    backend_agent,
    frontend_agent,
    qa_agent,
    reviewer_agent,
):
    builder = StateGraph(CodingTeamState)

    builder.add_node("product_owner", product_owner_agent.run)
    builder.add_node("planner", planner_agent.run)
    builder.add_node("orchestrator", orchestrator_agent.run)
    builder.add_node("backend", backend_agent.run)
    builder.add_node("frontend", frontend_agent.run)
    builder.add_node("qa", qa_agent.run)
    builder.add_node("reviewer", reviewer_agent.run)

    builder.add_edge(START, "product_owner")

    builder.add_conditional_edges("product_owner", route_next)
    builder.add_conditional_edges("planner", route_next)
    builder.add_conditional_edges("orchestrator", route_next)
    builder.add_conditional_edges("backend", route_next)
    builder.add_conditional_edges("frontend", route_next)
    builder.add_conditional_edges("qa", route_next)
    builder.add_conditional_edges("reviewer", route_next)

    return builder.compile()