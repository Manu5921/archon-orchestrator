"""
Triple-Agent Orchestra MCP Tools for Archon Integration
Provides MCP tools for orchestrating Archon + Gemini CLI + Claude Code
"""

from typing import Any, Dict, List, Optional, Union
import json
import logging
import asyncio
from datetime import datetime
from dataclasses import dataclass, asdict
from enum import Enum

logger = logging.getLogger(__name__)

class AgentType(Enum):
    ARCHON = "archon"
    GEMINI = "gemini"
    CLAUDE = "claude"

class TaskComplexity(Enum):
    LOW = "low"
    MEDIUM = "medium"  
    HIGH = "high"

class TaskStatus(Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    HANDED_OFF = "handed_off"

@dataclass
class Task:
    id: str
    type: str
    description: str
    complexity: TaskComplexity
    requirements: List[str]
    context: Dict[str, Any]
    assigned_agent: Optional[AgentType] = None
    status: TaskStatus = TaskStatus.PENDING
    created_at: datetime = None
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.utcnow()

@dataclass 
class AgentPerformance:
    agent_type: AgentType
    success_rate: float
    avg_response_time: int  # milliseconds
    current_load: float     # 0.0 to 1.0
    specialties: List[str]
    recent_failures: List[Dict[str, Any]]
    total_tasks: int = 0
    successful_tasks: int = 0

@dataclass
class RoutingDecision:
    task_id: str
    selected_agent: AgentType
    confidence: float
    reasoning: str
    alternatives: List[Dict[str, Any]]
    estimated_duration: int
    routing_time: datetime = None
    
    def __post_init__(self):
        if self.routing_time is None:
            self.routing_time = datetime.utcnow()

class TripleAgentOrchestra:
    """Main orchestration engine for Archon MCP integration"""
    
    def __init__(self):
        self.agents = {}
        self.tasks = {}
        self.performance_history = {}
        self.routing_patterns = {}
        self.active_sessions = {}
        
        # Initialize agent performance baselines
        self._initialize_agent_baselines()
    
    def _initialize_agent_baselines(self):
        """Initialize baseline performance metrics for each agent"""
        self.agents = {
            AgentType.ARCHON: AgentPerformance(
                agent_type=AgentType.ARCHON,
                success_rate=0.95,
                avg_response_time=2000,
                current_load=0.3,
                specialties=[
                    "knowledge_synthesis",
                    "pattern_recognition", 
                    "context_management",
                    "rag_search",
                    "architectural_analysis"
                ],
                recent_failures=[]
            ),
            AgentType.GEMINI: AgentPerformance(
                agent_type=AgentType.GEMINI,
                success_rate=0.85,
                avg_response_time=800,
                current_load=0.6,
                specialties=[
                    "rapid_iteration",
                    "exploratory_coding",
                    "creative_solutions",
                    "parallel_processing",
                    "proof_of_concept"
                ],
                recent_failures=[]
            ),
            AgentType.CLAUDE: AgentPerformance(
                agent_type=AgentType.CLAUDE, 
                success_rate=0.95,
                avg_response_time=1500,
                current_load=0.4,
                specialties=[
                    "precision_fixes",
                    "code_quality",
                    "detailed_planning",
                    "error_analysis", 
                    "best_practices",
                    "architectural_review"
                ],
                recent_failures=[]
            )
        }

# MCP Tool Functions (exported to Archon)

async def orchestra_route_task(
    task_description: str,
    task_type: str,
    complexity: str = "medium",
    requirements: List[str] = None,
    context: Dict[str, Any] = None,
    exclude_agents: List[str] = None
) -> Dict[str, Any]:
    """
    MCP Tool: Route a task to the optimal agent
    
    Args:
        task_description: Description of the task
        task_type: Type/category of task
        complexity: low/medium/high
        requirements: List of required capabilities
        context: Additional context (errors, project info, etc.)
        exclude_agents: Agents to exclude from routing
    
    Returns:
        Routing decision with selected agent and reasoning
    """
    try:
        orchestra = TripleAgentOrchestra()
        
        # Create task object
        task = Task(
            id=f"task_{int(datetime.utcnow().timestamp())}",
            type=task_type,
            description=task_description,
            complexity=TaskComplexity(complexity.lower()),
            requirements=requirements or [],
            context=context or {}
        )
        
        # Calculate agent scores
        excluded = [AgentType(agent) for agent in (exclude_agents or [])]
        decision = await orchestra._route_task(task, excluded)
        
        # Store task and decision
        orchestra.tasks[task.id] = task
        
        return {
            "success": True,
            "task_id": task.id,
            "routing": asdict(decision),
            "task": asdict(task)
        }
        
    except Exception as e:
        logger.error(f"Error in orchestra_route_task: {e}")
        return {
            "success": False,
            "error": str(e),
            "task_id": None
        }

async def orchestra_agent_handoff(
    task_id: str,
    from_agent: str,
    to_agent: str,
    reason: str,
    context_update: Dict[str, Any] = None,
    error_info: Dict[str, Any] = None
) -> Dict[str, Any]:
    """
    MCP Tool: Handle agent-to-agent task handoff
    
    Args:
        task_id: ID of the task being handed off
        from_agent: Source agent
        to_agent: Target agent  
        reason: Reason for handoff
        context_update: Updated context
        error_info: Error information if handoff due to failure
    
    Returns:
        Handoff confirmation and updated routing
    """
    try:
        orchestra = TripleAgentOrchestra()
        
        # Update task status
        if task_id in orchestra.tasks:
            task = orchestra.tasks[task_id]
            task.status = TaskStatus.HANDED_OFF
            task.assigned_agent = AgentType(to_agent)
            
            # Update context
            if context_update:
                task.context.update(context_update)
        
        # Log handoff for learning
        handoff_record = {
            "task_id": task_id,
            "from_agent": from_agent,
            "to_agent": to_agent,
            "reason": reason,
            "timestamp": datetime.utcnow().isoformat(),
            "error_info": error_info
        }
        
        # Update agent performance if failure
        if error_info:
            await orchestra._record_agent_failure(
                AgentType(from_agent), 
                error_info
            )
        
        return {
            "success": True,
            "handoff_id": f"handoff_{int(datetime.utcnow().timestamp())}",
            "handoff": handoff_record,
            "new_assignment": to_agent
        }
        
    except Exception as e:
        logger.error(f"Error in orchestra_agent_handoff: {e}")
        return {
            "success": False,
            "error": str(e)
        }

async def orchestra_sync_context(
    project_path: str,
    session_id: str,
    context_data: Dict[str, Any],
    agents_to_sync: List[str] = None
) -> Dict[str, Any]:
    """
    MCP Tool: Synchronize context across all agents
    
    Args:
        project_path: Path to the project
        session_id: Current session ID
        context_data: Context to synchronize
        agents_to_sync: Specific agents to sync (default: all)
    
    Returns:
        Sync status for each agent
    """
    try:
        orchestra = TripleAgentOrchestra()
        
        sync_results = {}
        target_agents = agents_to_sync or ["archon", "gemini", "claude"]
        
        for agent_name in target_agents:
            try:
                # Here would be the actual sync logic per agent
                # For now, simulate successful sync
                sync_results[agent_name] = {
                    "status": "synced",
                    "timestamp": datetime.utcnow().isoformat(),
                    "context_size": len(json.dumps(context_data))
                }
            except Exception as e:
                sync_results[agent_name] = {
                    "status": "failed", 
                    "error": str(e),
                    "timestamp": datetime.utcnow().isoformat()
                }
        
        # Store session context
        orchestra.active_sessions[session_id] = {
            "project_path": project_path,
            "context": context_data,
            "last_sync": datetime.utcnow(),
            "participants": target_agents
        }
        
        return {
            "success": True,
            "session_id": session_id,
            "sync_results": sync_results,
            "total_synced": sum(1 for r in sync_results.values() if r["status"] == "synced")
        }
        
    except Exception as e:
        logger.error(f"Error in orchestra_sync_context: {e}")
        return {
            "success": False,
            "error": str(e)
        }

async def orchestra_performance_stats(
    agent_type: str = None,
    time_range_hours: int = 24,
    include_history: bool = False
) -> Dict[str, Any]:
    """
    MCP Tool: Get performance statistics for agents
    
    Args:
        agent_type: Specific agent or None for all
        time_range_hours: Time range for statistics
        include_history: Include detailed history
    
    Returns:
        Performance statistics and metrics
    """
    try:
        orchestra = TripleAgentOrchestra()
        
        if agent_type:
            # Single agent stats
            agent = AgentType(agent_type)
            if agent in orchestra.agents:
                perf = orchestra.agents[agent]
                return {
                    "success": True,
                    "agent": agent_type,
                    "performance": asdict(perf),
                    "recommendations": orchestra._get_agent_recommendations(agent)
                }
            else:
                return {"success": False, "error": f"Agent {agent_type} not found"}
        
        else:
            # All agents stats
            all_stats = {}
            for agent_type, perf in orchestra.agents.items():
                all_stats[agent_type.value] = {
                    "performance": asdict(perf),
                    "recommendations": orchestra._get_agent_recommendations(agent_type)
                }
            
            # Add comparative analysis
            all_stats["analysis"] = {
                "best_success_rate": max(p.success_rate for p in orchestra.agents.values()),
                "fastest_response": min(p.avg_response_time for p in orchestra.agents.values()),
                "optimal_load_distribution": orchestra._calculate_load_distribution()
            }
            
            return {
                "success": True,
                "stats": all_stats,
                "timestamp": datetime.utcnow().isoformat()
            }
        
    except Exception as e:
        logger.error(f"Error in orchestra_performance_stats: {e}")
        return {
            "success": False,
            "error": str(e)
        }

async def orchestra_pattern_learning(
    task_result: Dict[str, Any],
    agent_used: str,
    success: bool,
    performance_data: Dict[str, Any] = None
) -> Dict[str, Any]:
    """
    MCP Tool: Learn from task execution patterns
    
    Args:
        task_result: Result of the task execution
        agent_used: Agent that executed the task
        success: Whether the task was successful
        performance_data: Performance metrics
    
    Returns:
        Learning update confirmation
    """
    try:
        orchestra = TripleAgentOrchestra()
        agent_type = AgentType(agent_used)
        
        # Update agent performance
        if agent_type in orchestra.agents:
            perf = orchestra.agents[agent_type]
            
            # Update success rate (rolling average)
            perf.total_tasks += 1
            if success:
                perf.successful_tasks += 1
            perf.success_rate = perf.successful_tasks / perf.total_tasks
            
            # Update response time if provided
            if performance_data and "duration" in performance_data:
                duration = performance_data["duration"]
                perf.avg_response_time = int(
                    (perf.avg_response_time * 0.8) + (duration * 0.2)
                )
        
        # Learn routing patterns
        if "task_type" in task_result:
            task_type = task_result["task_type"]
            if task_type not in orchestra.routing_patterns:
                orchestra.routing_patterns[task_type] = {}
            
            patterns = orchestra.routing_patterns[task_type]
            if agent_used not in patterns:
                patterns[agent_used] = {"attempts": 0, "successes": 0}
            
            patterns[agent_used]["attempts"] += 1
            if success:
                patterns[agent_used]["successes"] += 1
        
        return {
            "success": True,
            "learning_update": {
                "agent": agent_used,
                "pattern_updated": task_result.get("task_type", "unknown"),
                "new_success_rate": orchestra.agents[agent_type].success_rate,
                "total_tasks": orchestra.agents[agent_type].total_tasks
            }
        }
        
    except Exception as e:
        logger.error(f"Error in orchestra_pattern_learning: {e}")
        return {
            "success": False,
            "error": str(e)
        }

# Additional helper methods for TripleAgentOrchestra class

    async def _route_task(self, task: Task, exclude_agents: List[AgentType]) -> RoutingDecision:
        """Internal routing logic"""
        available_agents = [a for a in self.agents.keys() if a not in exclude_agents]
        
        if not available_agents:
            raise ValueError("No available agents for routing")
        
        # Calculate scores for each available agent
        agent_scores = {}
        for agent_type in available_agents:
            score = self._calculate_agent_score(agent_type, task)
            agent_scores[agent_type] = score
        
        # Select best agent
        best_agent = max(agent_scores, key=agent_scores.get)
        best_score = agent_scores[best_agent]
        
        # Generate alternatives
        alternatives = []
        for agent_type, score in sorted(agent_scores.items(), key=lambda x: x[1], reverse=True)[1:3]:
            alternatives.append({
                "agent": agent_type.value,
                "score": score,
                "reasoning": f"Alternative with score {score:.2f}"
            })
        
        return RoutingDecision(
            task_id=task.id,
            selected_agent=best_agent,
            confidence=best_score,
            reasoning=self._generate_routing_reasoning(best_agent, task, best_score),
            alternatives=alternatives,
            estimated_duration=self._estimate_duration(best_agent, task)
        )
    
    def _calculate_agent_score(self, agent_type: AgentType, task: Task) -> float:
        """Calculate routing score for agent-task combination"""
        agent = self.agents[agent_type]
        score = 0.0
        
        # Base capability matching
        capability_matches = sum(
            1 for req in task.requirements 
            if req in agent.specialties
        )
        if task.requirements:
            score += (capability_matches / len(task.requirements)) * 0.4
        else:
            score += 0.2  # Default if no specific requirements
        
        # Performance factors
        score += agent.success_rate * 0.3
        score += (1 - agent.current_load) * 0.2
        score += (2000 - min(agent.avg_response_time, 2000)) / 2000 * 0.1
        
        return min(1.0, score)
    
    def _generate_routing_reasoning(self, agent: AgentType, task: Task, score: float) -> str:
        """Generate human-readable routing reasoning"""
        agent_perf = self.agents[agent]
        reasons = [f"Selected {agent.value}"]
        
        if score > 0.8:
            reasons.append("high confidence match")
        elif score > 0.6:
            reasons.append("good match")
        else:
            reasons.append("best available option")
        
        reasons.append(f"success rate: {agent_perf.success_rate:.1%}")
        reasons.append(f"current load: {agent_perf.current_load:.1%}")
        
        return ", ".join(reasons)
    
    def _estimate_duration(self, agent_type: AgentType, task: Task) -> int:
        """Estimate task duration in milliseconds"""
        base_time = self.agents[agent_type].avg_response_time
        
        complexity_multipliers = {
            TaskComplexity.LOW: 1.0,
            TaskComplexity.MEDIUM: 2.5,
            TaskComplexity.HIGH: 5.0
        }
        
        return int(base_time * complexity_multipliers[task.complexity])
    
    async def _record_agent_failure(self, agent_type: AgentType, error_info: Dict[str, Any]):
        """Record agent failure for learning"""
        agent = self.agents[agent_type]
        agent.recent_failures.append({
            "timestamp": datetime.utcnow(),
            "error": error_info
        })
        
        # Keep only recent failures (last 24 hours)
        cutoff = datetime.utcnow().timestamp() - 24 * 3600
        agent.recent_failures = [
            f for f in agent.recent_failures 
            if f["timestamp"].timestamp() > cutoff
        ]
    
    def _get_agent_recommendations(self, agent_type: AgentType) -> List[str]:
        """Generate recommendations for agent optimization"""
        agent = self.agents[agent_type]
        recommendations = []
        
        if agent.success_rate < 0.8:
            recommendations.append("Consider additional training or capability updates")
        
        if agent.current_load > 0.8:
            recommendations.append("Agent is overloaded, consider load balancing")
        
        if agent.avg_response_time > 3000:
            recommendations.append("Response time is high, investigate performance")
        
        if len(agent.recent_failures) > 5:
            recommendations.append("High failure rate, review recent errors")
        
        return recommendations or ["Agent performing well"]
    
    def _calculate_load_distribution(self) -> Dict[str, float]:
        """Calculate optimal load distribution across agents"""
        total_capacity = sum(1 - agent.current_load for agent in self.agents.values())
        
        if total_capacity == 0:
            return {agent.agent_type.value: 0.33 for agent in self.agents.values()}
        
        optimal_distribution = {}
        for agent in self.agents.values():
            available_capacity = 1 - agent.current_load
            optimal_distribution[agent.agent_type.value] = available_capacity / total_capacity
        
        return optimal_distribution

# Export MCP tools for Archon integration
MCP_TOOLS = {
    "orchestra:route_task": orchestra_route_task,
    "orchestra:agent_handoff": orchestra_agent_handoff, 
    "orchestra:sync_context": orchestra_sync_context,
    "orchestra:performance_stats": orchestra_performance_stats,
    "orchestra:pattern_learning": orchestra_pattern_learning
}

__all__ = ["MCP_TOOLS", "TripleAgentOrchestra", "AgentType", "TaskComplexity", "TaskStatus"]