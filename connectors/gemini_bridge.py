"""
Gemini CLI Bridge for Triple-Agent Orchestra
Handles communication with Google's Gemini CLI tool
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
class GeminiConfig:
    """Configuration for Gemini CLI connection"""
    cli_path: str = "gemini"  # Assumes gemini in PATH
    model: str = "gemini-1.5-pro"
    max_tokens: int = 8192
    temperature: float = 0.7
    timeout: int = 300  # 5 minutes
    api_key: Optional[str] = None
    project_id: Optional[str] = None

@dataclass
class GeminiResponse:
    """Response from Gemini CLI"""
    success: bool
    content: str
    metadata: Dict[str, Any]
    duration_ms: int
    error: Optional[str] = None
    tokens_used: Optional[int] = None

class GeminiBridge:
    """Bridge to communicate with Gemini CLI"""
    
    def __init__(self, config: Optional[GeminiConfig] = None):
        self.config = config or GeminiConfig()
        self.session_id = f"orchestra_{int(datetime.utcnow().timestamp())}"
        self.active_processes = {}
        
        # Validate Gemini CLI availability
        self._validate_cli()
    
    def _validate_cli(self) -> bool:
        """Validate that Gemini CLI is available and configured"""
        try:
            result = subprocess.run(
                [self.config.cli_path, "--version"],
                capture_output=True,
                text=True,
                timeout=10
            )
            if result.returncode == 0:
                logger.info(f"Gemini CLI available: {result.stdout.strip()}")
                return True
            else:
                logger.warning(f"Gemini CLI not available: {result.stderr}")
                return False
        except subprocess.TimeoutExpired:
            logger.error("Gemini CLI validation timeout")
            return False
        except FileNotFoundError:
            logger.error(f"Gemini CLI not found at: {self.config.cli_path}")
            return False
        except Exception as e:
            logger.error(f"Error validating Gemini CLI: {e}")
            return False
    
    async def execute_task(
        self,
        task_description: str,
        context: Dict[str, Any] = None,
        files: List[str] = None,
        working_directory: str = None
    ) -> GeminiResponse:
        """
        Execute a task using Gemini CLI
        
        Args:
            task_description: The task to execute
            context: Additional context (project info, errors, etc.)
            files: List of files to include in context
            working_directory: Working directory for execution
            
        Returns:
            GeminiResponse with results
        """
        start_time = datetime.utcnow()
        
        try:
            # Prepare the prompt
            prompt = await self._build_prompt(task_description, context, files)
            
            # Execute via CLI
            response = await self._execute_cli_command(prompt, working_directory)
            
            duration = int((datetime.utcnow() - start_time).total_seconds() * 1000)
            
            return GeminiResponse(
                success=response["success"],
                content=response["content"],
                metadata=response.get("metadata", {}),
                duration_ms=duration,
                error=response.get("error"),
                tokens_used=response.get("tokens_used")
            )
            
        except Exception as e:
            duration = int((datetime.utcnow() - start_time).total_seconds() * 1000)
            logger.error(f"Gemini task execution failed: {e}")
            
            return GeminiResponse(
                success=False,
                content="",
                metadata={},
                duration_ms=duration,
                error=str(e)
            )
    
    async def _build_prompt(
        self,
        task_description: str,
        context: Dict[str, Any] = None,
        files: List[str] = None
    ) -> str:
        """Build a comprehensive prompt for Gemini"""
        
        prompt_parts = [
            "# Triple-Agent Orchestra Task Execution",
            "",
            "## Task Description",
            task_description,
            ""
        ]
        
        # Add context if available
        if context:
            prompt_parts.extend([
                "## Context",
                json.dumps(context, indent=2),
                ""
            ])
        
        # Add file contents if specified
        if files:
            prompt_parts.append("## Relevant Files")
            for file_path in files:
                try:
                    if os.path.exists(file_path):
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                        prompt_parts.extend([
                            f"### {file_path}",
                            "```",
                            content,
                            "```",
                            ""
                        ])
                except Exception as e:
                    prompt_parts.append(f"Error reading {file_path}: {e}")
        
        # Add specific instructions for Gemini
        prompt_parts.extend([
            "## Instructions",
            "1. Analyze the task and context carefully",
            "2. Provide a clear, actionable solution",
            "3. If code changes are needed, provide complete implementations",
            "4. Explain your reasoning and approach", 
            "5. If you encounter issues, suggest alternative approaches",
            "6. Be concise but thorough",
            "",
            "## Response Format",
            "Provide your response in the following format:",
            "",
            "### Analysis",
            "[Your analysis of the problem/task]",
            "",
            "### Solution", 
            "[Your solution with code/commands if applicable]",
            "",
            "### Reasoning",
            "[Explanation of your approach]",
            "",
            "### Next Steps",
            "[Suggested next steps or follow-up actions]"
        ])
        
        return "\n".join(prompt_parts)
    
    async def _execute_cli_command(
        self,
        prompt: str,
        working_directory: str = None
    ) -> Dict[str, Any]:
        """Execute Gemini CLI command with the given prompt"""
        
        # Create temporary file for the prompt
        with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
            f.write(prompt)
            prompt_file = f.name
        
        try:
            # Build CLI command
            cmd = [
                self.config.cli_path,
                "chat",
                "--model", self.config.model,
                "--max-tokens", str(self.config.max_tokens),
                "--temperature", str(self.config.temperature)
            ]
            
            # Add API key if available
            if self.config.api_key:
                cmd.extend(["--api-key", self.config.api_key])
            
            # Add project ID if available
            if self.config.project_id:
                cmd.extend(["--project", self.config.project_id])
            
            # Execute command
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                cwd=working_directory
            )
            
            # Send prompt and get response
            stdout, stderr = await asyncio.wait_for(
                process.communicate(input=prompt.encode()),
                timeout=self.config.timeout
            )
            
            # Process results
            if process.returncode == 0:
                content = stdout.decode('utf-8').strip()
                return {
                    "success": True,
                    "content": content,
                    "metadata": {
                        "model": self.config.model,
                        "session_id": self.session_id
                    }
                }
            else:
                error_msg = stderr.decode('utf-8').strip()
                logger.error(f"Gemini CLI error: {error_msg}")
                return {
                    "success": False,
                    "content": "",
                    "error": error_msg
                }
                
        except asyncio.TimeoutError:
            logger.error("Gemini CLI timeout")
            return {
                "success": False,
                "content": "",
                "error": "Execution timeout"
            }
        except Exception as e:
            logger.error(f"Gemini CLI execution error: {e}")
            return {
                "success": False,
                "content": "",
                "error": str(e)
            }
        finally:
            # Clean up temporary file
            try:
                os.unlink(prompt_file)
            except:
                pass
    
    async def interactive_session(
        self,
        initial_prompt: str,
        working_directory: str = None
    ) -> 'GeminiInteractiveSession':
        """Start an interactive session with Gemini"""
        return GeminiInteractiveSession(self, initial_prompt, working_directory)
    
    async def rapid_iteration(
        self,
        task: str,
        attempts: int = 3,
        context: Dict[str, Any] = None
    ) -> List[GeminiResponse]:
        """
        Perform rapid iteration on a task
        Gemini's specialty - try multiple approaches quickly
        """
        responses = []
        
        for attempt in range(attempts):
            # Modify prompt for each attempt
            iteration_context = (context or {}).copy()
            iteration_context["attempt"] = attempt + 1
            iteration_context["previous_attempts"] = [
                {"attempt": i + 1, "result": resp.content[:200] + "..."}
                for i, resp in enumerate(responses)
            ]
            
            prompt = f"""
            ## Rapid Iteration Attempt {attempt + 1}/{attempts}
            
            Task: {task}
            
            {'Previous attempts: ' + json.dumps(iteration_context.get('previous_attempts', []), indent=2) if attempt > 0 else ''}
            
            Try a different approach this time. Be creative and explore alternative solutions.
            """
            
            response = await self.execute_task(prompt, iteration_context)
            responses.append(response)
            
            # Break if we get a successful response
            if response.success and "solution" in response.content.lower():
                break
        
        return responses
    
    def get_capabilities(self) -> List[str]:
        """Return Gemini's primary capabilities"""
        return [
            "rapid_iteration",
            "exploratory_coding", 
            "creative_solutions",
            "parallel_processing",
            "proof_of_concept",
            "multi_attempt_solving",
            "alternative_approaches"
        ]
    
    async def health_check(self) -> Dict[str, Any]:
        """Check if Gemini CLI is healthy and responsive"""
        try:
            start_time = datetime.utcnow()
            
            response = await self.execute_task(
                "Simple health check - respond with 'OK' if you can read this message.",
                {"test": True}
            )
            
            duration = int((datetime.utcnow() - start_time).total_seconds() * 1000)
            
            return {
                "healthy": response.success,
                "response_time_ms": duration,
                "model": self.config.model,
                "capabilities": self.get_capabilities(),
                "error": response.error if not response.success else None
            }
            
        except Exception as e:
            return {
                "healthy": False,
                "error": str(e),
                "capabilities": self.get_capabilities()
            }

class GeminiInteractiveSession:
    """Interactive session handler for ongoing Gemini conversations"""
    
    def __init__(self, bridge: GeminiBridge, initial_prompt: str, working_directory: str = None):
        self.bridge = bridge
        self.working_directory = working_directory
        self.conversation_history = [initial_prompt]
        self.session_id = f"interactive_{int(datetime.utcnow().timestamp())}"
    
    async def send_message(self, message: str) -> GeminiResponse:
        """Send a message in the interactive session"""
        self.conversation_history.append(f"User: {message}")
        
        # Build context with conversation history
        context = {
            "session_type": "interactive",
            "conversation_history": self.conversation_history[-10:],  # Last 10 messages
            "session_id": self.session_id
        }
        
        prompt = f"""
        ## Interactive Session Message
        
        {message}
        
        ## Previous Context
        {chr(10).join(self.conversation_history[-5:-1])}  # Last 4 messages for context
        
        Continue the conversation naturally, building on previous context.
        """
        
        response = await self.bridge.execute_task(prompt, context)
        
        if response.success:
            self.conversation_history.append(f"Gemini: {response.content}")
        
        return response
    
    async def close(self):
        """Close the interactive session"""
        logger.info(f"Closing Gemini interactive session {self.session_id}")
        # Could save conversation history here if needed

# Factory function for easy instantiation
def create_gemini_bridge(
    cli_path: str = "gemini",
    model: str = "gemini-1.5-pro",
    api_key: str = None
) -> GeminiBridge:
    """Create a Gemini bridge with the specified configuration"""
    config = GeminiConfig(
        cli_path=cli_path,
        model=model,
        api_key=api_key or os.getenv("GEMINI_API_KEY")
    )
    return GeminiBridge(config)

__all__ = ["GeminiBridge", "GeminiConfig", "GeminiResponse", "create_gemini_bridge"]