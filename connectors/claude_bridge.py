"""
Claude Code Bridge for Triple-Agent Orchestra
Handles communication with Anthropic's Claude Code CLI
"""

import asyncio
import json
import logging
import subprocess
import tempfile
import os
from typing import Any, Dict, List, Optional, Union
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path

logger = logging.getLogger(__name__)

@dataclass
class ClaudeConfig:
    """Configuration for Claude Code connection"""
    cli_path: str = "claude"  # Assumes claude in PATH
    model: str = "claude-3-5-sonnet-20241022"
    max_tokens: int = 8192
    temperature: float = 0.0  # Claude typically works better with lower temperature
    timeout: int = 300  # 5 minutes
    api_key: Optional[str] = None
    project_path: Optional[str] = None

@dataclass
class ClaudeResponse:
    """Response from Claude Code"""
    success: bool
    content: str
    metadata: Dict[str, Any]
    duration_ms: int
    files_modified: List[str] = None
    tools_used: List[str] = None
    error: Optional[str] = None
    tokens_used: Optional[int] = None

class ClaudeBridge:
    """Bridge to communicate with Claude Code CLI"""
    
    def __init__(self, config: Optional[ClaudeConfig] = None):
        self.config = config or ClaudeConfig()
        self.session_id = f"orchestra_{int(datetime.utcnow().timestamp())}"
        self.active_sessions = {}
        
        # Validate Claude Code availability
        self._validate_cli()
    
    def _validate_cli(self) -> bool:
        """Validate that Claude Code is available and configured"""
        try:
            result = subprocess.run(
                [self.config.cli_path, "--version"],
                capture_output=True,
                text=True,
                timeout=10
            )
            if result.returncode == 0:
                logger.info(f"Claude Code available: {result.stdout.strip()}")
                return True
            else:
                logger.warning(f"Claude Code not available: {result.stderr}")
                return False
        except subprocess.TimeoutExpired:
            logger.error("Claude Code validation timeout")
            return False
        except FileNotFoundError:
            logger.error(f"Claude Code not found at: {self.config.cli_path}")
            return False
        except Exception as e:
            logger.error(f"Error validating Claude Code: {e}")
            return False
    
    async def execute_task(
        self,
        task_description: str,
        context: Dict[str, Any] = None,
        files: List[str] = None,
        working_directory: str = None,
        tools_allowed: List[str] = None
    ) -> ClaudeResponse:
        """
        Execute a task using Claude Code
        
        Args:
            task_description: The task to execute
            context: Additional context (errors, project info, etc.)
            files: List of specific files to focus on
            working_directory: Working directory for execution
            tools_allowed: Specific tools Claude can use
            
        Returns:
            ClaudeResponse with results and file modifications
        """
        start_time = datetime.utcnow()
        
        try:
            # Build the command prompt
            prompt = await self._build_claude_prompt(
                task_description, context, files, tools_allowed
            )
            
            # Execute via Claude Code CLI
            response = await self._execute_claude_cli(prompt, working_directory)
            
            duration = int((datetime.utcnow() - start_time).total_seconds() * 1000)
            
            return ClaudeResponse(
                success=response["success"],
                content=response["content"],
                metadata=response.get("metadata", {}),
                duration_ms=duration,
                files_modified=response.get("files_modified", []),
                tools_used=response.get("tools_used", []),
                error=response.get("error"),
                tokens_used=response.get("tokens_used")
            )
            
        except Exception as e:
            duration = int((datetime.utcnow() - start_time).total_seconds() * 1000)
            logger.error(f"Claude task execution failed: {e}")
            
            return ClaudeResponse(
                success=False,
                content="",
                metadata={},
                duration_ms=duration,
                error=str(e)
            )
    
    async def _build_claude_prompt(
        self,
        task_description: str,
        context: Dict[str, Any] = None,
        files: List[str] = None,
        tools_allowed: List[str] = None
    ) -> str:
        """Build a detailed prompt for Claude Code"""
        
        prompt_parts = [
            "# Triple-Agent Orchestra - Precision Task Execution",
            "",
            "You are part of a multi-agent system coordinated by Archon. Your role is precise execution and analysis.",
            "",
            "## Task Details",
            task_description,
            ""
        ]
        
        # Add context information
        if context:
            prompt_parts.extend([
                "## Context Information",
                ""
            ])
            
            # Handle specific context types
            if context.get("error_info"):
                prompt_parts.extend([
                    "### Error Information",
                    f"```",
                    json.dumps(context["error_info"], indent=2),
                    "```",
                    ""
                ])
            
            if context.get("previous_attempts"):
                prompt_parts.extend([
                    "### Previous Attempts by Other Agents",
                    ""
                ])
                for attempt in context["previous_attempts"]:
                    prompt_parts.extend([
                        f"**Agent:** {attempt.get('agent', 'Unknown')}",
                        f"**Result:** {attempt.get('result', 'No result')}",
                        f"**Issue:** {attempt.get('issue', 'Success')}",
                        ""
                    ])
            
            if context.get("project_context"):
                prompt_parts.extend([
                    "### Project Context",
                    json.dumps(context["project_context"], indent=2),
                    ""
                ])
        
        # Add file focus if specified
        if files:
            prompt_parts.extend([
                "## Files to Focus On",
                ""
            ])
            for file_path in files:
                prompt_parts.append(f"- `{file_path}`")
            prompt_parts.append("")
        
        # Add tool restrictions if specified
        if tools_allowed:
            prompt_parts.extend([
                "## Allowed Tools",
                ""
            ])
            for tool in tools_allowed:
                prompt_parts.append(f"- {tool}")
            prompt_parts.append("")
        
        # Claude-specific instructions
        prompt_parts.extend([
            "## Execution Guidelines",
            "",
            "1. **Precision First**: Focus on accurate, clean solutions",
            "2. **Code Quality**: Follow best practices and maintainability",
            "3. **Error Analysis**: If there are errors, provide detailed diagnosis",
            "4. **Architecture**: Consider the broader system impact",
            "5. **Testing**: Validate your changes if possible",
            "6. **Documentation**: Update relevant documentation",
            "",
            "## Expected Output",
            "",
            "Provide a structured response with:",
            "",
            "### Analysis",
            "- Problem assessment",
            "- Root cause identification (if applicable)",
            "- Approach rationale",
            "",
            "### Implementation",
            "- Specific changes made",
            "- Code modifications",
            "- Commands executed",
            "",
            "### Validation",
            "- How you verified the solution",
            "- Tests run (if applicable)",
            "- Potential issues to watch",
            "",
            "### Handoff Notes",
            "- Summary for other agents",
            "- Next steps recommendations",
            "- Files modified",
            "",
            "Begin execution now."
        ])
        
        return "\n".join(prompt_parts)
    
    async def _execute_claude_cli(
        self,
        prompt: str,
        working_directory: str = None
    ) -> Dict[str, Any]:
        """Execute Claude Code CLI command"""
        
        # Determine working directory
        work_dir = working_directory or self.config.project_path or os.getcwd()
        
        try:
            # Build CLI command
            cmd = [self.config.cli_path]
            
            # Add model specification if supported
            if hasattr(self.config, 'model') and self.config.model:
                cmd.extend(["--model", self.config.model])
            
            # Execute in interactive mode
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                cwd=work_dir
            )
            
            # Send prompt and get response
            stdout, stderr = await asyncio.wait_for(
                process.communicate(input=prompt.encode('utf-8')),
                timeout=self.config.timeout
            )
            
            # Parse response
            if process.returncode == 0:
                content = stdout.decode('utf-8').strip()
                
                # Parse Claude's output for structured information
                parsed_response = self._parse_claude_output(content)
                
                return {
                    "success": True,
                    "content": content,
                    "metadata": {
                        "model": self.config.model,
                        "session_id": self.session_id,
                        "working_directory": work_dir
                    },
                    **parsed_response
                }
            else:
                error_msg = stderr.decode('utf-8').strip()
                logger.error(f"Claude CLI error: {error_msg}")
                return {
                    "success": False,
                    "content": "",
                    "error": error_msg
                }
                
        except asyncio.TimeoutError:
            logger.error("Claude CLI timeout")
            return {
                "success": False,
                "content": "",
                "error": "Execution timeout"
            }
        except Exception as e:
            logger.error(f"Claude CLI execution error: {e}")
            return {
                "success": False,
                "content": "",
                "error": str(e)
            }
    
    def _parse_claude_output(self, output: str) -> Dict[str, Any]:
        """Parse Claude's structured output to extract metadata"""
        parsed = {
            "files_modified": [],
            "tools_used": [],
            "tokens_used": None
        }
        
        # Look for file modification patterns
        lines = output.split('\n')
        for line in lines:
            # Common patterns Claude uses to indicate file operations
            if "wrote to" in line.lower() or "modified" in line.lower():
                # Extract file path (basic pattern matching)
                if ".py" in line or ".js" in line or ".ts" in line:
                    # Simple extraction - could be more sophisticated
                    words = line.split()
                    for word in words:
                        if any(ext in word for ext in ['.py', '.js', '.ts', '.json', '.md']):
                            parsed["files_modified"].append(word.strip('`"\''))
            
            # Look for tool usage indicators
            if "using" in line.lower() and ("tool" in line.lower() or "command" in line.lower()):
                # Extract tool names - this is a basic implementation
                if "bash" in line.lower():
                    parsed["tools_used"].append("bash")
                if "edit" in line.lower():
                    parsed["tools_used"].append("edit")
                if "read" in line.lower():
                    parsed["tools_used"].append("read")
        
        return parsed
    
    async def precision_fix(
        self,
        error_description: str,
        stack_trace: str = None,
        files_involved: List[str] = None,
        context: Dict[str, Any] = None
    ) -> ClaudeResponse:
        """
        Claude's specialty: Precise error fixing and code correction
        """
        
        fix_context = (context or {}).copy()
        fix_context.update({
            "task_type": "precision_fix",
            "error_info": {
                "description": error_description,
                "stack_trace": stack_trace,
                "files_involved": files_involved or []
            }
        })
        
        task_prompt = f"""
        ## Precision Error Fix Required
        
        **Error:** {error_description}
        
        {f"**Stack Trace:**\n```\n{stack_trace}\n```\n" if stack_trace else ""}
        
        {f"**Files Involved:** {', '.join(files_involved)}\n" if files_involved else ""}
        
        Please provide a precise fix for this error. Focus on:
        1. Root cause identification
        2. Minimal, targeted changes
        3. Verification that the fix works
        4. Prevention of similar issues
        """
        
        return await self.execute_task(
            task_prompt,
            fix_context,
            files_involved
        )
    
    async def code_review(
        self,
        files_to_review: List[str],
        focus_areas: List[str] = None,
        context: Dict[str, Any] = None
    ) -> ClaudeResponse:
        """
        Perform detailed code review and analysis
        """
        
        review_context = (context or {}).copy()
        review_context.update({
            "task_type": "code_review",
            "focus_areas": focus_areas or ["quality", "security", "performance", "maintainability"]
        })
        
        focus_list = focus_areas or ["code quality", "best practices", "potential issues", "architecture"]
        
        task_prompt = f"""
        ## Code Review Request
        
        Please perform a thorough code review focusing on:
        {chr(10).join(f"- {area}" for area in focus_list)}
        
        **Files to Review:** {', '.join(files_to_review)}
        
        Provide:
        1. Overall assessment
        2. Specific issues found with line numbers
        3. Recommendations for improvement
        4. Priority levels for each issue
        5. Suggested refactoring if needed
        """
        
        return await self.execute_task(
            task_prompt,
            review_context,
            files_to_review,
            tools_allowed=["read", "grep", "edit"]
        )
    
    async def architectural_analysis(
        self,
        project_path: str,
        analysis_focus: str = None,
        context: Dict[str, Any] = None
    ) -> ClaudeResponse:
        """
        Perform high-level architectural analysis
        """
        
        arch_context = (context or {}).copy()
        arch_context.update({
            "task_type": "architectural_analysis",
            "project_path": project_path,
            "analysis_focus": analysis_focus
        })
        
        task_prompt = f"""
        ## Architectural Analysis Request
        
        Please analyze the project architecture at: {project_path}
        
        {f"**Specific Focus:** {analysis_focus}\n" if analysis_focus else ""}
        
        Provide insights on:
        1. Overall architecture patterns
        2. Component relationships
        3. Potential architectural issues
        4. Scalability considerations
        5. Recommendations for improvement
        6. Migration paths if needed
        """
        
        return await self.execute_task(
            task_prompt,
            arch_context,
            working_directory=project_path,
            tools_allowed=["read", "grep", "find", "bash"]
        )
    
    def get_capabilities(self) -> List[str]:
        """Return Claude's primary capabilities"""
        return [
            "precision_fixes",
            "code_quality",
            "architectural_analysis",
            "detailed_planning",
            "error_analysis",
            "best_practices",
            "code_review",
            "refactoring",
            "debugging",
            "documentation"
        ]
    
    async def health_check(self) -> Dict[str, Any]:
        """Check if Claude Code is healthy and responsive"""
        try:
            start_time = datetime.utcnow()
            
            response = await self.execute_task(
                "Health check: Please confirm you can read this message and respond with 'HEALTHY' and your current model name.",
                {"test": True}
            )
            
            duration = int((datetime.utcnow() - start_time).total_seconds() * 1000)
            
            return {
                "healthy": response.success,
                "response_time_ms": duration,
                "model": self.config.model,
                "capabilities": self.get_capabilities(),
                "session_id": self.session_id,
                "tools_available": ["read", "edit", "write", "bash", "grep"],
                "error": response.error if not response.success else None
            }
            
        except Exception as e:
            return {
                "healthy": False,
                "error": str(e),
                "capabilities": self.get_capabilities()
            }
    
    async def create_session(self, project_path: str) -> str:
        """Create a persistent Claude session for a project"""
        session_id = f"claude_session_{int(datetime.utcnow().timestamp())}"
        
        self.active_sessions[session_id] = {
            "project_path": project_path,
            "created_at": datetime.utcnow(),
            "message_count": 0,
            "files_accessed": set()
        }
        
        logger.info(f"Created Claude session {session_id} for project {project_path}")
        return session_id
    
    async def close_session(self, session_id: str):
        """Close a Claude session"""
        if session_id in self.active_sessions:
            session_info = self.active_sessions[session_id]
            duration = datetime.utcnow() - session_info["created_at"]
            
            logger.info(f"Closed Claude session {session_id}: "
                       f"{session_info['message_count']} messages, "
                       f"{len(session_info['files_accessed'])} files, "
                       f"{duration.total_seconds():.1f}s duration")
            
            del self.active_sessions[session_id]

# Factory function for easy instantiation
def create_claude_bridge(
    cli_path: str = "claude",
    model: str = "claude-3-5-sonnet-20241022",
    project_path: str = None
) -> ClaudeBridge:
    """Create a Claude bridge with the specified configuration"""
    config = ClaudeConfig(
        cli_path=cli_path,
        model=model,
        project_path=project_path,
        api_key=os.getenv("ANTHROPIC_API_KEY")
    )
    return ClaudeBridge(config)

__all__ = ["ClaudeBridge", "ClaudeConfig", "ClaudeResponse", "create_claude_bridge"]