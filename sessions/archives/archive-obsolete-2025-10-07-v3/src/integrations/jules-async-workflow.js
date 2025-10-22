/**
 * Jules Async Workflow Integration
 * Enables asynchronous collaboration between Archon/Claude and Jules (GitHub Copilot)
 */

import GitHubMCPClient from './github-mcp-client.js';
import { EventEmitter } from 'events';

class JulesAsyncWorkflow extends EventEmitter {
  constructor(config = {}) {
    super();
    this.github = new GitHubMCPClient(config);
    this.config = {
      repository: process.env.JULES_WORKSPACE_REPO || 'archon-jules-workspace',
      owner: process.env.GITHUB_OWNER || process.env.GITHUB_USERNAME,
      baseBranch: 'main',
      workBranch: 'jules-tasks',
      issueLabels: ['jules-task', 'archon-generated'],
      prLabels: ['jules-pr', 'auto-review'],
      ...config
    };
  }

  /**
     * Initialize Jules workspace
     */
  async initialize() {
    console.log('🚀 Initializing Jules async workspace...');

    try {
      await this.github.start();

      // Create workspace repository if it doesn't exist
      await this.ensureWorkspaceRepository();

      // Setup branch structure
      await this.setupBranchStructure();

      // Setup issue templates
      await this.setupIssueTemplates();

      // Setup GitHub Actions for automation
      await this.setupAutomationWorkflows();

      console.log('✅ Jules async workspace initialized');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Jules workspace:', error);
      return false;
    }
  }

  /**
     * Create a task for Jules to work on asynchronously
     */
  async createTaskForJules(taskData) {
    const {
      title,
      description,
      code_context = '',
      requirements = [],
      priority = 'normal',
      estimated_time = '30 minutes',
      files_to_modify = [],
      additional_context = ''
    } = taskData;

    console.log(`📝 Creating async task for Jules: ${title}`);

    try {
      // 1. Create a dedicated branch for this task
      const taskBranch = `jules-task-${Date.now()}`;
      await this.github.call('tools/call', {
        name: 'create_branch',
        arguments: {
          owner: this.config.owner,
          repo: this.config.repository,
          branch: taskBranch,
          from_branch: this.config.baseBranch
        }
      });

      // 2. Create initial context files if needed
      await this.createContextFiles(taskBranch, {
        code_context,
        files_to_modify,
        additional_context
      });

      // 3. Create GitHub issue with detailed instructions
      const issueBody = this.generateIssueBodyForJules({
        description,
        requirements,
        priority,
        estimated_time,
        files_to_modify,
        additional_context,
        branch: taskBranch
      });

      const issue = await this.github.call('tools/call', {
        name: 'create_issue',
        arguments: {
          owner: this.config.owner,
          repo: this.config.repository,
          title: `🤖 Jules Task: ${title}`,
          body: issueBody,
          labels: [...this.config.issueLabels, `priority-${priority}`],
          assignees: [] // Jules will assign himself via Copilot
        }
      });

      // 4. Assign Jules (Copilot) to the issue
      await this.github.call('tools/call', {
        name: 'assign_copilot_to_issue',
        arguments: {
          owner: this.config.owner,
          repo: this.config.repository,
          issueNumber: issue.content.number
        }
      });

      console.log(`✅ Task created for Jules: Issue #${issue.content.number}`);

      return {
        success: true,
        issue_number: issue.content.number,
        issue_url: issue.content.html_url,
        branch: taskBranch,
        task_id: `jules-${issue.content.number}`
      };

    } catch (error) {
      console.error('❌ Failed to create task for Jules:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
     * Generate comprehensive issue body for Jules
     */
  generateIssueBodyForJules(data) {
    const {
      description,
      requirements = [],
      priority,
      estimated_time,
      files_to_modify = [],
      additional_context,
      branch
    } = data;

    return `## 🎯 Task Description

${description}

## 📋 Requirements

${requirements.length > 0 ? requirements.map(req => `- [ ] ${req}`).join('\n') : '- [ ] To be defined during implementation'}

## ⚙️ Technical Details

**Priority:** ${priority}
**Estimated Time:** ${estimated_time}
**Working Branch:** \`${branch}\`

### 📁 Files to Modify/Create
${files_to_modify.length > 0 ? files_to_modify.map(file => `- \`${file}\``).join('\n') : 'To be determined'}

## 🔍 Additional Context

${additional_context || 'No additional context provided'}

## 📝 Instructions for Jules

1. **Review** the task description and requirements
2. **Create a new branch** from \`${branch}\` for your work
3. **Implement** the required functionality
4. **Test** your implementation
5. **Create a Pull Request** when ready
6. **Add comments** to your code explaining the implementation

## 🔄 Workflow

1. Jules will work on this asynchronously
2. Progress updates will be posted as comments
3. When complete, Jules will create a PR
4. Archon/Claude will review and merge if approved

---

*This task was automatically generated by Archon Orchestrator for asynchronous collaboration with Jules (GitHub Copilot)*

### 🏷️ Tags
\`jules-task\` \`archon-generated\` \`async-work\` \`priority-${priority}\``;
  }

  /**
     * Create context files in the repository
     */
  async createContextFiles(branch, context) {
    const { code_context, files_to_modify, additional_context } = context;

    try {
      // Create TASK_CONTEXT.md
      const taskContextContent = `# Task Context

## Code Context
\`\`\`
${code_context}
\`\`\`

## Files to Modify
${files_to_modify.map(file => `- ${file}`).join('\n')}

## Additional Context
${additional_context}

---
Generated by Archon Orchestrator
`;

      await this.github.call('tools/call', {
        name: 'create_or_update_file',
        arguments: {
          owner: this.config.owner,
          repo: this.config.repository,
          path: 'TASK_CONTEXT.md',
          content: taskContextContent,
          message: 'Add task context for Jules',
          branch
        }
      });

      // Create TODO.md for tracking
      const todoContent = `# TODO for Jules

## Current Task
- [ ] Review task requirements
- [ ] Analyze code context
- [ ] Plan implementation approach
- [ ] Implement solution
- [ ] Test implementation
- [ ] Create Pull Request
- [ ] Document changes

## Notes
Add your implementation notes here...

---
*This file is automatically maintained*
`;

      await this.github.call('tools/call', {
        name: 'create_or_update_file',
        arguments: {
          owner: this.config.owner,
          repo: this.config.repository,
          path: 'TODO.md',
          content: todoContent,
          message: 'Add TODO tracking for Jules',
          branch
        }
      });

    } catch (error) {
      console.error('Failed to create context files:', error);
    }
  }

  /**
     * Setup workspace repository
     */
  async ensureWorkspaceRepository() {
    try {
      // Try to get the repository
      await this.github.call('tools/call', {
        name: 'get_repository',
        arguments: {
          owner: this.config.owner,
          repo: this.config.repository
        }
      });
      console.log('✅ Workspace repository exists');
    } catch (error) {
      // Repository doesn't exist, create it
      console.log('📦 Creating workspace repository...');

      await this.github.call('tools/call', {
        name: 'create_repository',
        arguments: {
          name: this.config.repository,
          description: 'Asynchronous workspace for Jules (GitHub Copilot) and Archon Orchestrator collaboration',
          private: false,
          autoInit: true
        }
      });

      // Create initial README
      const readmeContent = `# Jules Async Workspace

This repository serves as an asynchronous collaboration workspace between:
- **Archon Orchestrator** (Task creation and management)
- **Jules (GitHub Copilot)** (Code implementation)
- **Claude** (Code review and integration)

## Workflow

1. **Archon** creates tasks as GitHub issues
2. **Jules** is auto-assigned and implements solutions
3. **Claude** reviews PRs and provides feedback
4. **Archon** integrates completed work back into main projects

## Structure

- \`main\` - Stable branch
- \`jules-tasks\` - Base branch for new tasks
- \`jules-task-*\` - Individual task branches
- \`TASK_CONTEXT.md\` - Context for current task
- \`TODO.md\` - Task tracking

Generated by Archon Orchestrator v3
`;

      await this.github.call('tools/call', {
        name: 'create_or_update_file',
        arguments: {
          owner: this.config.owner,
          repo: this.config.repository,
          path: 'README.md',
          content: readmeContent,
          message: 'Initialize Jules async workspace',
          branch: 'main'
        }
      });

      console.log('✅ Workspace repository created');
    }
  }

  /**
     * Setup branch structure
     */
  async setupBranchStructure() {
    try {
      // Create jules-tasks branch if it doesn't exist
      await this.github.call('tools/call', {
        name: 'create_branch',
        arguments: {
          owner: this.config.owner,
          repo: this.config.repository,
          branch: this.config.workBranch,
          from_branch: this.config.baseBranch
        }
      });
      console.log('✅ Jules work branch created');
    } catch (error) {
      // Branch might already exist, that's okay
      console.log('ℹ️ Jules work branch already exists');
    }
  }

  /**
     * Setup issue templates
     */
  async setupIssueTemplates() {
    const taskTemplate = `---
name: Jules Task
about: Task for Jules (GitHub Copilot) to work on asynchronously
title: '🤖 Jules Task: [TASK_TITLE]'
labels: ['jules-task', 'archon-generated']
assignees: []
---

## 🎯 Task Description
<!-- Describe what needs to be implemented -->

## 📋 Requirements
<!-- List specific requirements -->
- [ ] Requirement 1
- [ ] Requirement 2

## ⚙️ Technical Details
**Priority:** normal
**Estimated Time:** 30 minutes
**Working Branch:** \`jules-task-XXXX\`

## 🔍 Additional Context
<!-- Any additional context or constraints -->

---
*Automatically generated by Archon Orchestrator*
`;

    try {
      await this.github.call('tools/call', {
        name: 'create_or_update_file',
        arguments: {
          owner: this.config.owner,
          repo: this.config.repository,
          path: '.github/ISSUE_TEMPLATE/jules-task.md',
          content: taskTemplate,
          message: 'Add Jules task issue template',
          branch: 'main'
        }
      });
      console.log('✅ Issue templates created');
    } catch (error) {
      console.error('Failed to create issue templates:', error);
    }
  }

  /**
     * Setup GitHub Actions for automation
     */
  async setupAutomationWorkflows() {
    const julesWorkflow = `name: Jules Automation

on:
  issues:
    types: [opened, labeled]
  pull_request:
    types: [opened, ready_for_review]

jobs:
  handle_jules_task:
    if: contains(github.event.issue.labels.*.name, 'jules-task')
    runs-on: ubuntu-latest
    steps:
      - name: Assign Copilot
        uses: actions/github-script@v7
        with:
          script: |
            // Auto-assign GitHub Copilot to Jules tasks
            if (context.eventName === 'issues' && 
                context.payload.action === 'opened' && 
                context.payload.issue.labels.some(label => label.name === 'jules-task')) {
              
              await github.rest.issues.addAssignees({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.payload.issue.number,
                assignees: ['github-copilot'] // This will trigger Copilot assignment
              });
              
              await github.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.payload.issue.number,
                body: '🤖 Jules (GitHub Copilot) has been assigned to this task. Work will begin asynchronously.'
              });
            }

  handle_jules_pr:
    if: contains(github.event.pull_request.labels.*.name, 'jules-pr')
    runs-on: ubuntu-latest
    steps:
      - name: Notify completion
        uses: actions/github-script@v7
        with:
          script: |
            if (context.eventName === 'pull_request' && 
                context.payload.action === 'opened') {
              
              await github.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.payload.pull_request.number,
                body: '✅ Jules has completed the task! Ready for Claude/Archon review.'
              });
            }
`;

    try {
      await this.github.call('tools/call', {
        name: 'create_or_update_file',
        arguments: {
          owner: this.config.owner,
          repo: this.config.repository,
          path: '.github/workflows/jules-automation.yml',
          content: julesWorkflow,
          message: 'Add Jules automation workflow',
          branch: 'main'
        }
      });
      console.log('✅ Automation workflows created');
    } catch (error) {
      console.error('Failed to create automation workflows:', error);
    }
  }

  /**
     * Check status of Jules tasks
     */
  async checkTaskStatus(taskId) {
    try {
      const issueNumber = parseInt(taskId.replace('jules-', ''));

      const issue = await this.github.call('tools/call', {
        name: 'get_issue',
        arguments: {
          owner: this.config.owner,
          repo: this.config.repository,
          issue_number: issueNumber
        }
      });

      // Check for associated PRs
      const prs = await this.github.call('tools/call', {
        name: 'search_issues_and_pull_requests',
        arguments: {
          q: `repo:${this.config.owner}/${this.config.repository} is:pr mentions:#${issueNumber}`
        }
      });

      return {
        issue_status: issue.content.state,
        issue_assignees: issue.content.assignees,
        has_pull_request: prs.content.total_count > 0,
        pull_requests: prs.content.items || []
      };

    } catch (error) {
      console.error('Failed to check task status:', error);
      return { error: error.message };
    }
  }

  /**
     * Create a batch of tasks for Jules
     */
  async createTaskBatch(tasks) {
    console.log(`📦 Creating batch of ${tasks.length} tasks for Jules...`);

    const results = [];

    for (const task of tasks) {
      const result = await this.createTaskForJules(task);
      results.push(result);

      // Small delay between task creation
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return {
      success: true,
      total_tasks: tasks.length,
      successful_tasks: results.filter(r => r.success).length,
      results
    };
  }

  /**
     * Get all pending Jules tasks
     */
  async getPendingTasks() {
    try {
      const issues = await this.github.call('tools/call', {
        name: 'search_issues_and_pull_requests',
        arguments: {
          q: `repo:${this.config.owner}/${this.config.repository} is:issue is:open label:jules-task`
        }
      });

      return {
        success: true,
        pending_tasks: issues.content.total_count,
        tasks: issues.content.items.map(issue => ({
          id: `jules-${issue.number}`,
          title: issue.title,
          number: issue.number,
          created_at: issue.created_at,
          assignees: issue.assignees,
          labels: issue.labels
        }))
      };
    } catch (error) {
      console.error('Failed to get pending tasks:', error);
      return { success: false, error: error.message };
    }
  }

  /**
     * Close completed tasks
     */
  async closeCompletedTasks() {
    try {
      // Find issues with completed PRs
      const completedIssues = await this.github.call('tools/call', {
        name: 'search_issues_and_pull_requests',
        arguments: {
          q: `repo:${this.config.owner}/${this.config.repository} is:issue is:open label:jules-task`
        }
      });

      let closedCount = 0;

      for (const issue of completedIssues.content.items) {
        // Check if there's a merged PR that references this issue
        const relatedPRs = await this.github.call('tools/call', {
          name: 'search_issues_and_pull_requests',
          arguments: {
            q: `repo:${this.config.owner}/${this.config.repository} is:pr is:merged mentions:#${issue.number}`
          }
        });

        if (relatedPRs.content.total_count > 0) {
          // Close the issue
          await this.github.call('tools/call', {
            name: 'update_issue',
            arguments: {
              owner: this.config.owner,
              repo: this.config.repository,
              issue_number: issue.number,
              state: 'closed'
            }
          });

          await this.github.call('tools/call', {
            name: 'add_issue_comment',
            arguments: {
              owner: this.config.owner,
              repo: this.config.repository,
              issue_number: issue.number,
              body: '✅ Task completed! Associated PR has been merged. Closing this issue.'
            }
          });

          closedCount++;
        }
      }

      return {
        success: true,
        closed_tasks: closedCount
      };
    } catch (error) {
      console.error('Failed to close completed tasks:', error);
      return { success: false, error: error.message };
    }
  }

  /**
     * Cleanup and stop
     */
  async stop() {
    console.log('Stopping Jules async workflow...');
    await this.github.stop();
  }
}

export default JulesAsyncWorkflow;
