/**
 * Hybrid Jules-GitHub Workflow Integration
 * Combines Jules MCP (direct communication) with GitHub MCP (repository management)
 * for optimal asynchronous collaboration
 */

import GitHubMCPClient from './github-mcp-client.js';
import { EventEmitter } from 'events';
import { spawn } from 'child_process';

class HybridJulesWorkflow extends EventEmitter {
  constructor(config = {}) {
    super();
    this.github = new GitHubMCPClient(config);
    this.julesProcess = null;
    this.julesConnected = false;
    this.requestId = 0;
    this.pendingRequests = new Map();

    this.config = {
      // GitHub configuration
      repository: process.env.JULES_WORKSPACE_REPO || 'archon-jules-workspace',
      owner: process.env.GITHUB_OWNER || process.env.GITHUB_USERNAME,

      // Jules MCP configuration
      julesDataPath: process.env.JULES_DATA_PATH || process.env.HOME + '/.jules-mcp/data.json',
      julesSessionMode: process.env.JULES_SESSION_MODE || 'cookies',
      julesHeadless: process.env.JULES_HEADLESS !== 'false',
      julesDebug: process.env.JULES_DEBUG === 'true',

      // Authentication
      googleAuthCookies: process.env.GOOGLE_AUTH_COOKIES,

      ...config
    };
  }

  /**
     * Initialize hybrid workflow
     */
  async initialize() {
    console.log('🚀 Initializing Hybrid Jules-GitHub Workflow...');

    try {
      // Start GitHub MCP
      await this.github.start();
      console.log('✅ GitHub MCP connected');

      // Start Jules MCP
      await this.startJulesMCP();
      console.log('✅ Jules MCP connected');

      // Ensure workspace exists
      await this.ensureWorkspace();

      console.log('✅ Hybrid workflow initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize hybrid workflow:', error);
      return false;
    }
  }

  /**
     * Start Jules MCP server
     */
  async startJulesMCP() {
    const julesPath = '/Users/manu/Documents/DEV/google-jules-mcp/dist/index.js';

    // Environment for Jules MCP
    const julesEnv = {
      ...process.env,
      HEADLESS: this.config.julesHeadless.toString(),
      DEBUG: this.config.julesDebug.toString(),
      JULES_DATA_PATH: this.config.julesDataPath,
      SESSION_MODE: this.config.julesSessionMode,
      GOOGLE_AUTH_COOKIES: this.config.googleAuthCookies
    };

    this.julesProcess = spawn('node', [julesPath], {
      env: julesEnv,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    this.setupJulesHandlers();

    // Wait for Jules to be ready
    await new Promise((resolve) => {
      setTimeout(() => {
        this.julesConnected = true;
        resolve();
      }, 2000);
    });
  }

  /**
     * Setup Jules process handlers
     */
  setupJulesHandlers() {
    let buffer = '';

    this.julesProcess.stdout.on('data', (data) => {
      buffer += data.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (line.trim()) {
          try {
            const message = JSON.parse(line);
            this.handleJulesMessage(message);
          } catch (e) {
            console.log(`[Jules] ${line}`);
          }
        }
      }
    });

    this.julesProcess.stderr.on('data', (data) => {
      console.error(`[Jules Error] ${data.toString()}`);
    });

    this.julesProcess.on('close', (code) => {
      console.log(`[Jules] Process exited with code ${code}`);
      this.julesConnected = false;
    });
  }

  /**
     * Handle Jules MCP messages
     */
  handleJulesMessage(message) {
    if (message.id && this.pendingRequests.has(message.id)) {
      const { resolve, reject } = this.pendingRequests.get(message.id);
      this.pendingRequests.delete(message.id);

      if (message.error) {
        reject(new Error(message.error.message));
      } else {
        resolve(message.result);
      }
    }
  }

  /**
     * Call Jules MCP method
     */
  async callJules(method, params = {}) {
    if (!this.julesConnected) {
      throw new Error('Jules MCP not connected');
    }

    const id = ++this.requestId;
    const request = {
      jsonrpc: '2.0',
      id,
      method,
      params
    };

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });

      this.julesProcess.stdin.write(JSON.stringify(request) + '\n', (error) => {
        if (error) {
          this.pendingRequests.delete(id);
          reject(error);
        }
      });

      // Timeout
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error('Jules request timeout'));
        }
      }, 60000); // 60s timeout for Jules operations
    });
  }

  /**
     * Create comprehensive task for Jules with GitHub backup
     */
  async createOptimizedTask(taskData) {
    const {
      title,
      description,
      repository,
      branch = 'main',
      priority = 'normal',
      files_to_modify = [],
      code_context = '',
      requirements = []
    } = taskData;

    console.log(`🎯 Creating optimized task for Jules: ${title}`);

    try {
      // 1. Create task directly in Jules (PRIMARY)
      console.log('📱 Creating task in Jules MCP...');
      const julesTask = await this.callJules('tools/call', {
        name: 'jules_create_task',
        arguments: {
          description: `${title}\n\n${description}\n\nRequirements:\n${requirements.map(r => `- ${r}`).join('\n')}\n\nFiles to modify:\n${files_to_modify.map(f => `- ${f}`).join('\n')}\n\nCode context:\n${code_context}`,
          repository: repository || `${this.config.owner}/${this.config.repository}`,
          branch
        }
      });

      console.log('✅ Jules task created:', julesTask.id);

      // 2. Create GitHub issue as backup/tracking (SECONDARY)
      console.log('📋 Creating GitHub issue for tracking...');
      const githubIssue = await this.github.call('tools/call', {
        name: 'create_issue',
        arguments: {
          owner: this.config.owner,
          repo: this.config.repository,
          title: `🤖 Jules Task: ${title}`,
          body: this.generateTrackingIssueBody({
            description,
            requirements,
            jules_task_id: julesTask.id,
            repository,
            branch,
            priority
          }),
          labels: ['jules-task', 'hybrid-workflow', `priority-${priority}`]
        }
      });

      // 3. Send initial context message to Jules
      if (code_context || files_to_modify.length > 0) {
        console.log('💬 Sending context to Jules...');
        await this.callJules('tools/call', {
          name: 'jules_send_message',
          arguments: {
            taskId: julesTask.id,
            message: `Additional context:\n\nCode Context:\n${code_context}\n\nFiles to focus on:\n${files_to_modify.join(', ')}\n\nPlease confirm you understand the requirements before starting.`
          }
        });
      }

      return {
        success: true,
        jules_task_id: julesTask.id,
        jules_task_url: julesTask.url,
        github_issue_number: githubIssue.content.number,
        github_issue_url: githubIssue.content.html_url,
        workflow_type: 'hybrid-optimized'
      };

    } catch (error) {
      console.error('❌ Failed to create optimized task:', error);

      // Fallback: Create GitHub-only task if Jules fails
      console.log('🔄 Falling back to GitHub-only task...');
      try {
        const fallbackIssue = await this.github.call('tools/call', {
          name: 'create_issue',
          arguments: {
            owner: this.config.owner,
            repo: this.config.repository,
            title: `⚠️ Fallback Task: ${title}`,
            body: `${description}\n\n**Note**: This is a fallback task created because Jules MCP was unavailable.\n\nRequirements:\n${requirements.map(r => `- ${r}`).join('\n')}`,
            labels: ['jules-task', 'fallback-mode', `priority-${priority}`]
          }
        });

        return {
          success: true,
          jules_task_id: null,
          github_issue_number: fallbackIssue.content.number,
          github_issue_url: fallbackIssue.content.html_url,
          workflow_type: 'github-fallback',
          warning: 'Created in fallback mode - Jules MCP unavailable'
        };
      } catch (fallbackError) {
        return {
          success: false,
          error: `Both Jules and GitHub task creation failed: ${error.message}, ${fallbackError.message}`
        };
      }
    }
  }

  /**
     * Get task status from both Jules and GitHub
     */
  async getTaskStatus(taskInfo) {
    const { jules_task_id, github_issue_number } = taskInfo;

    try {
      const status = { jules: null, github: null };

      // Get Jules status (if available)
      if (jules_task_id) {
        try {
          const julesStatus = await this.callJules('tools/call', {
            name: 'jules_get_task',
            arguments: { taskId: jules_task_id }
          });
          status.jules = {
            status: julesStatus.status,
            progress: julesStatus.chatHistory?.length || 0,
            last_update: julesStatus.updatedAt,
            source_files: julesStatus.sourceFiles || []
          };
        } catch (error) {
          status.jules = { error: error.message };
        }
      }

      // Get GitHub status
      if (github_issue_number) {
        try {
          const githubStatus = await this.github.call('tools/call', {
            name: 'get_issue',
            arguments: {
              owner: this.config.owner,
              repo: this.config.repository,
              issue_number: github_issue_number
            }
          });
          status.github = {
            state: githubStatus.content.state,
            comments: githubStatus.content.comments,
            assignees: githubStatus.content.assignees,
            labels: githubStatus.content.labels
          };
        } catch (error) {
          status.github = { error: error.message };
        }
      }

      return {
        success: true,
        ...status,
        overall_status: this.determineOverallStatus(status)
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
     * Send message to Jules with GitHub backup
     */
  async sendMessageToJules(taskInfo, message) {
    const { jules_task_id, github_issue_number } = taskInfo;

    try {
      // Primary: Send to Jules directly
      if (jules_task_id) {
        await this.callJules('tools/call', {
          name: 'jules_send_message',
          arguments: {
            taskId: jules_task_id,
            message
          }
        });
        console.log('✅ Message sent to Jules');
      }

      // Secondary: Add comment to GitHub issue
      if (github_issue_number) {
        await this.github.call('tools/call', {
          name: 'add_issue_comment',
          arguments: {
            owner: this.config.owner,
            repo: this.config.repository,
            issue_number: github_issue_number,
            body: `💬 **Message to Jules:**\n\n${message}\n\n---\n*Sent via Hybrid Jules-GitHub Workflow*`
          }
        });
        console.log('✅ Message logged to GitHub');
      }

      return { success: true };

    } catch (error) {
      console.error('❌ Failed to send message:', error);
      return { success: false, error: error.message };
    }
  }

  /**
     * Approve Jules execution plan
     */
  async approveJulesPlan(taskInfo, approved = true) {
    const { jules_task_id } = taskInfo;

    if (!jules_task_id) {
      throw new Error('No Jules task ID available for plan approval');
    }

    try {
      const result = await this.callJules('tools/call', {
        name: 'jules_approve_plan',
        arguments: {
          taskId: jules_task_id,
          approved
        }
      });

      console.log(`✅ Jules plan ${approved ? 'approved' : 'rejected'}`);
      return { success: true, result };

    } catch (error) {
      console.error('❌ Failed to approve Jules plan:', error);
      return { success: false, error: error.message };
    }
  }

  /**
     * Create multiple tasks efficiently
     */
  async createTaskBatch(tasks) {
    console.log(`📦 Creating batch of ${tasks.length} hybrid tasks...`);

    const results = [];

    // Try bulk creation in Jules first
    try {
      const julesResults = await this.callJules('tools/call', {
        name: 'jules_bulk_create_tasks',
        arguments: { tasks }
      });

      // Create corresponding GitHub issues
      for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const julesResult = julesResults[i];

        try {
          const githubIssue = await this.github.call('tools/call', {
            name: 'create_issue',
            arguments: {
              owner: this.config.owner,
              repo: this.config.repository,
              title: `🤖 Jules Task: ${task.title || task.description.substring(0, 50)}`,
              body: this.generateTrackingIssueBody({
                description: task.description,
                jules_task_id: julesResult.id,
                repository: task.repository,
                branch: task.branch,
                priority: 'normal'
              }),
              labels: ['jules-task', 'hybrid-workflow', 'batch-created']
            }
          });

          results.push({
            success: true,
            jules_task_id: julesResult.id,
            github_issue_number: githubIssue.content.number,
            workflow_type: 'hybrid-batch'
          });
        } catch (githubError) {
          results.push({
            success: true,
            jules_task_id: julesResult.id,
            github_issue_number: null,
            workflow_type: 'jules-only',
            warning: 'GitHub issue creation failed'
          });
        }
      }

    } catch (julesError) {
      // Fallback to individual task creation
      console.log('🔄 Jules bulk failed, creating individual tasks...');

      for (const task of tasks) {
        const result = await this.createOptimizedTask(task);
        results.push(result);

        // Small delay between tasks
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    return {
      success: true,
      total_tasks: tasks.length,
      successful_tasks: results.filter(r => r.success).length,
      results
    };
  }

  /**
     * Monitor all active tasks
     */
  async getAllTasksStatus() {
    try {
      // Get active Jules tasks
      const julesTasks = await this.callJules('tools/call', {
        name: 'jules_list_tasks',
        arguments: { status: 'in_progress', limit: 50 }
      });

      // Get GitHub issues
      const githubIssues = await this.github.call('tools/call', {
        name: 'search_issues_and_pull_requests',
        arguments: {
          q: `repo:${this.config.owner}/${this.config.repository} is:issue is:open label:jules-task`
        }
      });

      return {
        success: true,
        jules_tasks: julesTasks.length,
        github_issues: githubIssues.content.total_count,
        active_tasks: Math.max(julesTasks.length, githubIssues.content.total_count),
        tasks: {
          jules: julesTasks,
          github: githubIssues.content.items
        }
      };

    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
     * Helper methods
     */
  generateTrackingIssueBody(data) {
    return `## 🎯 Jules Task Tracking

**Description:** ${data.description}

**Jules Task ID:** \`${data.jules_task_id}\`
**Repository:** ${data.repository}
**Branch:** ${data.branch}
**Priority:** ${data.priority}

## 📋 Requirements

${data.requirements ? data.requirements.map(r => `- [ ] ${r}`).join('\n') : '- [ ] To be defined'}

## 🔄 Workflow Status

This issue tracks a task being executed by Jules via the Hybrid Jules-GitHub Workflow:

1. ✅ **Task Created** - Jules received the task directly
2. ⏳ **In Progress** - Jules is working on the implementation
3. ⏳ **PR Creation** - Jules will create a pull request when ready
4. ⏳ **Review** - Claude/Archon will review the changes
5. ⏳ **Integration** - Changes will be merged and integrated

---

*This is a tracking issue for the Hybrid Jules-GitHub Workflow. The actual work is managed directly through Jules MCP.*

### 🏷️ Tags
\`jules-task\` \`hybrid-workflow\` \`tracking-issue\``;
  }

  determineOverallStatus(status) {
    if (status.jules?.status === 'completed' || status.github?.state === 'closed') {
      return 'completed';
    }
    if (status.jules?.status === 'in_progress' || status.github?.state === 'open') {
      return 'in_progress';
    }
    if (status.jules?.status === 'paused') {
      return 'paused';
    }
    return 'pending';
  }

  async ensureWorkspace() {
    try {
      await this.github.call('tools/call', {
        name: 'get_repository',
        arguments: {
          owner: this.config.owner,
          repo: this.config.repository
        }
      });
    } catch (error) {
      // Create repository if it doesn't exist
      await this.github.call('tools/call', {
        name: 'create_repository',
        arguments: {
          name: this.config.repository,
          description: 'Hybrid Jules-GitHub Workflow workspace for Archon Orchestrator',
          private: false,
          autoInit: true
        }
      });
    }
  }

  /**
     * Stop all services
     */
  async stop() {
    console.log('Stopping Hybrid Jules-GitHub Workflow...');

    if (this.julesProcess) {
      this.julesProcess.kill();
    }

    await this.github.stop();
    console.log('Hybrid workflow stopped');
  }
}

export default HybridJulesWorkflow;
