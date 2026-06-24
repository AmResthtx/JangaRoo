"""
JangaRoo — Head Orchestrator Agent

JangaRoo is the central orchestrator that manages all agents in the stack.
It coordinates task execution, aggregates results, and makes high-level decisions.

Uses the secure agent orchestration framework from hunters-decoy.
"""

import json
import logging
from typing import Any, Dict, List, Optional

from dataclasses import dataclass, field
from datetime import datetime, timezone


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("JangaRoo")


@dataclass
class Task:
    """A task to be executed by agents."""
    id: str
    name: str
    description: str
    agent_type: str  # "helical-pier-agent", "data-analyst", etc.
    parameters: Dict[str, Any]
    priority: int = 3  # 1=critical, 5=low
    status: str = "pending"  # pending, assigned, in_progress, completed, failed
    assigned_agent_id: Optional[str] = None
    result: Optional[Dict[str, Any]] = None
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: Optional[datetime] = None


class JangaRooOrchestrator:
    """
    Head orchestrator agent that manages the entire agent stack.

    Responsibilities:
    - Task planning and decomposition
    - Agent selection and task assignment
    - Result aggregation and analysis
    - Escalation and human notification
    - Status reporting and monitoring
    """

    def __init__(self, config_path: str = "agent_stack_config.json"):
        self.config = self._load_config(config_path)
        self.tasks: Dict[str, Task] = {}
        self.agent_status: Dict[str, Dict[str, Any]] = {}
        self.execution_history: List[Dict[str, Any]] = []
        logger.info("JangaRoo Orchestrator initialized")

    def _load_config(self, config_path: str) -> dict:
        """Load agent stack configuration."""
        try:
            with open(config_path) as f:
                return json.load(f)
        except FileNotFoundError:
            logger.warning(f"Config file not found: {config_path}, using defaults")
            return {
                "agents": [],
                "security_policies": {"scan_all_messages": True},
            }

    def create_task(
        self,
        name: str,
        description: str,
        agent_type: str,
        parameters: Dict[str, Any],
        priority: int = 3,
    ) -> Task:
        """Create a new task for execution."""
        task = Task(
            id=f"task-{datetime.now(timezone.utc).timestamp()}",
            name=name,
            description=description,
            agent_type=agent_type,
            parameters=parameters,
            priority=priority,
        )
        self.tasks[task.id] = task
        logger.info(f"Created task: {task.id} ({task.name})")
        return task

    def assign_task(self, task_id: str, agent_id: str) -> bool:
        """Assign a task to an agent."""
        if task_id not in self.tasks:
            logger.error(f"Task not found: {task_id}")
            return False

        task = self.tasks[task_id]
        task.assigned_agent_id = agent_id
        task.status = "assigned"
        logger.info(f"Assigned task {task_id} to agent {agent_id}")
        return True

    def execute_task(self, task_id: str) -> bool:
        """Execute a task (coordinate with agent)."""
        if task_id not in self.tasks:
            logger.error(f"Task not found: {task_id}")
            return False

        task = self.tasks[task_id]
        if not task.assigned_agent_id:
            logger.error(f"Task {task_id} not assigned to any agent")
            return False

        task.status = "in_progress"
        logger.info(f"Starting execution of task {task_id}")

        # In real implementation, would:
        # 1. Create secure message to agent
        # 2. Send through orchestrator
        # 3. Wait for response
        # 4. Handle result and store in task.result

        return True

    def complete_task(self, task_id: str, result: Dict[str, Any]) -> bool:
        """Mark a task as completed with results."""
        if task_id not in self.tasks:
            logger.error(f"Task not found: {task_id}")
            return False

        task = self.tasks[task_id]
        task.status = "completed"
        task.result = result
        task.completed_at = datetime.now(timezone.utc)

        self.execution_history.append({
            "task_id": task_id,
            "status": "completed",
            "timestamp": task.completed_at,
            "result": result,
        })

        logger.info(f"Task {task_id} completed successfully")
        return True

    def get_task_status(self, task_id: str) -> Optional[Task]:
        """Get the current status of a task."""
        return self.tasks.get(task_id)

    def get_agent_availability(self) -> Dict[str, Dict[str, Any]]:
        """Get availability and health of all agents."""
        return self.agent_status.copy()

    def select_best_agent(self, agent_type: str) -> Optional[str]:
        """Select the best available agent for a task type."""
        candidates = [
            agent_id
            for agent_id, status in self.agent_status.items()
            if agent_type in status.get("capabilities", [])
            and status.get("status") == "healthy"
        ]

        if not candidates:
            return None

        # Sort by availability/load
        candidates.sort(
            key=lambda a: self.agent_status[a].get("current_load", 0)
        )
        return candidates[0]

    def aggregate_results(self, task_ids: List[str]) -> Dict[str, Any]:
        """Aggregate results from multiple completed tasks."""
        results = {}
        for task_id in task_ids:
            task = self.tasks.get(task_id)
            if task and task.status == "completed":
                results[task_id] = task.result

        return {
            "aggregated_at": datetime.now(timezone.utc).isoformat(),
            "task_count": len(results),
            "results": results,
        }

    def get_execution_summary(self) -> Dict[str, Any]:
        """Get summary of orchestrator activity."""
        total_tasks = len(self.tasks)
        completed = sum(1 for t in self.tasks.values() if t.status == "completed")
        failed = sum(1 for t in self.tasks.values() if t.status == "failed")
        in_progress = sum(1 for t in self.tasks.values() if t.status == "in_progress")

        return {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "total_tasks": total_tasks,
            "completed": completed,
            "in_progress": in_progress,
            "failed": failed,
            "success_rate": (completed / total_tasks * 100) if total_tasks > 0 else 0,
            "execution_history_size": len(self.execution_history),
        }


def main():
    """Example usage of JangaRoo orchestrator."""
    orchestrator = JangaRooOrchestrator()

    # Create a task
    task = orchestrator.create_task(
        name="Analyze Foundation System",
        description="Perform structural analysis on helical pier foundation",
        agent_type="helical-pier-agent",
        parameters={
            "soil_type": "clay",
            "depth_meters": 5,
            "load_kn": 500,
        },
        priority=1,
    )

    # Simulate agent assignment and execution
    orchestrator.assign_task(task.id, "helical-pier-agent-001")
    orchestrator.execute_task(task.id)

    # Simulate task completion
    result = {
        "analysis": "Foundation suitable for helical pier installation",
        "recommended_depth": 4.5,
        "safety_factor": 2.1,
    }
    orchestrator.complete_task(task.id, result)

    # Print summary
    print("\n=== JangaRoo Orchestrator Summary ===")
    print(json.dumps(orchestrator.get_execution_summary(), indent=2, default=str))


if __name__ == "__main__":
    main()
