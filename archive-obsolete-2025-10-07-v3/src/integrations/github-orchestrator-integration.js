/**
 * GitHub Orchestrator Integration
 * Integrates GitHub MCP with Archon Orchestrator workflow
 */

import GitHubMCPClient from './github-mcp-client.js';
import { EventEmitter } from 'events';

class GitHubOrchestratorIntegration extends EventEmitter {
    constructor(orchestrator) {
        super();
        this.orchestrator = orchestrator;
        this.github = new GitHubMCPClient();
        this.initialized = false;
    }

    /**
     * Initialize GitHub integration
     */
    async initialize() {
        if (!process.env.ENABLE_GITHUB_INTEGRATION === 'true') {
            console.log('GitHub integration is disabled');
            return false;
        }

        console.log('🔗 Initializing GitHub integration for Archon Orchestrator...');
        
        try {
            await this.github.start();
            this.setupEventHandlers();
            this.registerOrchestratorTools();
            this.initialized = true;
            console.log('✅ GitHub integration initialized successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize GitHub integration:', error);
            return false;
        }
    }

    /**
     * Setup event handlers for GitHub MCP client
     */
    setupEventHandlers() {
        this.github.on('connected', () => {
            this.emit('github:connected');
        });

        this.github.on('disconnected', () => {
            this.emit('github:disconnected');
        });

        this.github.on('error', (error) => {
            this.emit('github:error', error);
        });

        this.github.on('notification', (notification) => {
            this.handleGitHubNotification(notification);
        });
    }

    /**
     * Register GitHub tools with orchestrator
     */
    registerOrchestratorTools() {
        // Register GitHub tools for use in workflows
        const tools = {
            'github:create_project_repo': async (params) => {
                return this.createProjectRepository(params);
            },
            
            'github:setup_ci_cd': async (params) => {
                return this.setupCICD(params);
            },
            
            'github:create_issue_from_task': async (params) => {
                return this.createIssueFromTask(params);
            },
            
            'github:submit_code_review': async (params) => {
                return this.submitCodeReview(params);
            },
            
            'github:create_release': async (params) => {
                return this.createProjectRelease(params);
            },
            
            'github:sync_project_status': async (params) => {
                return this.syncProjectStatus(params);
            }
        };

        // Register tools with orchestrator if it has a registration method
        if (this.orchestrator && this.orchestrator.registerTools) {
            this.orchestrator.registerTools(tools);
            console.log('✅ Registered GitHub tools with orchestrator');
        }
    }

    /**
     * Create a GitHub repository for an Archon project
     */
    async createProjectRepository(params) {
        const {
            project_name,
            description,
            private: isPrivate = false,
            template = 'Node',
            license = 'mit'
        } = params;

        console.log(`📦 Creating GitHub repository for project: ${project_name}`);

        try {
            // Create repository
            const repo = await this.github.createRepository({
                name: project_name,
                description: description || `Created by Archon Orchestrator`,
                private: isPrivate,
                auto_init: true,
                gitignore_template: template,
                license_template: license
            });

            // Create initial structure
            await this.createInitialStructure(repo.full_name);

            // Setup branch protection
            if (!isPrivate) {
                await this.setupBranchProtection(repo.full_name);
            }

            return {
                success: true,
                repository: repo,
                url: repo.html_url,
                clone_url: repo.clone_url
            };
        } catch (error) {
            console.error('Failed to create repository:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Setup CI/CD for a project
     */
    async setupCICD(params) {
        const {
            repository,
            project_type = 'node',
            deployment_target = 'none'
        } = params;

        console.log(`⚙️ Setting up CI/CD for: ${repository}`);

        try {
            const [owner, repo] = repository.split('/');

            // Create CI workflow
            const ciWorkflow = this.generateCIWorkflow(project_type);
            await this.github.createOrUpdateFile({
                owner,
                repo,
                path: '.github/workflows/ci.yml',
                message: 'Add CI workflow',
                content: Buffer.from(ciWorkflow).toString('base64')
            });

            // Create CD workflow if deployment target specified
            if (deployment_target !== 'none') {
                const cdWorkflow = this.generateCDWorkflow(deployment_target);
                await this.github.createOrUpdateFile({
                    owner,
                    repo,
                    path: '.github/workflows/deploy.yml',
                    message: 'Add deployment workflow',
                    content: Buffer.from(cdWorkflow).toString('base64')
                });
            }

            return {
                success: true,
                workflows: ['ci.yml', deployment_target !== 'none' ? 'deploy.yml' : null].filter(Boolean)
            };
        } catch (error) {
            console.error('Failed to setup CI/CD:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create GitHub issue from Archon task
     */
    async createIssueFromTask(params) {
        const {
            repository,
            task,
            assignees = [],
            labels = ['archon-generated']
        } = params;

        console.log(`📝 Creating issue for task: ${task.name}`);

        try {
            const [owner, repo] = repository.split('/');

            const issue = await this.github.createIssue({
                owner,
                repo,
                title: `Task: ${task.name}`,
                body: this.formatTaskAsIssue(task),
                assignees,
                labels: [...labels, task.type, `priority-${task.priority}`].filter(Boolean)
            });

            return {
                success: true,
                issue_number: issue.number,
                issue_url: issue.html_url
            };
        } catch (error) {
            console.error('Failed to create issue:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Submit code review using AI agents
     */
    async submitCodeReview(params) {
        const {
            repository,
            pr_number,
            review_content,
            agent_name = 'Archon'
        } = params;

        console.log(`🔍 Submitting code review for PR #${pr_number}`);

        try {
            const [owner, repo] = repository.split('/');

            // Get PR details
            const pr = await this.github.getPullRequest(owner, repo, pr_number);

            // Format review comment
            const reviewBody = `## 🤖 AI Review by ${agent_name}\n\n${review_content}\n\n---\n*Generated by Archon Orchestrator*`;

            // Create review
            const review = await this.github.createReview({
                owner,
                repo,
                pull_number: pr_number,
                body: reviewBody,
                event: 'COMMENT'
            });

            return {
                success: true,
                review_id: review.id,
                review_url: review.html_url
            };
        } catch (error) {
            console.error('Failed to submit review:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create a release for the project
     */
    async createProjectRelease(params) {
        const {
            repository,
            version,
            changelog,
            artifacts = []
        } = params;

        console.log(`🚀 Creating release ${version} for ${repository}`);

        try {
            const [owner, repo] = repository.split('/');

            const release = await this.github.createRelease({
                owner,
                repo,
                tag_name: version,
                name: `Release ${version}`,
                body: this.formatChangelog(changelog),
                draft: false,
                prerelease: version.includes('-')
            });

            // Upload artifacts if any
            for (const artifact of artifacts) {
                await this.uploadReleaseAsset(release.upload_url, artifact);
            }

            return {
                success: true,
                release_url: release.html_url,
                tag_name: release.tag_name
            };
        } catch (error) {
            console.error('Failed to create release:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Sync Archon project status with GitHub
     */
    async syncProjectStatus(params) {
        const {
            repository,
            project_id,
            status
        } = params;

        console.log(`🔄 Syncing project status for ${project_id}`);

        try {
            const [owner, repo] = repository.split('/');

            // Update repository topics
            await this.updateRepositoryTopics(owner, repo, status);

            // Create or update project board
            await this.updateProjectBoard(owner, repo, status);

            // Update README with status badge
            await this.updateStatusBadge(owner, repo, status);

            return {
                success: true,
                synced_at: new Date().toISOString()
            };
        } catch (error) {
            console.error('Failed to sync project status:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Helper: Format task as GitHub issue
     */
    formatTaskAsIssue(task) {
        return `## Task Details

**Description:** ${task.description || 'No description provided'}

**Type:** ${task.type}
**Priority:** ${task.priority}
**Status:** ${task.status}

### Acceptance Criteria
${task.criteria ? task.criteria.map(c => `- [ ] ${c}`).join('\n') : '- [ ] To be defined'}

### Technical Details
${task.technical_details || 'To be added'}

---
*This issue was automatically generated from Archon Orchestrator task #${task.id}*`;
    }

    /**
     * Helper: Generate CI workflow
     */
    generateCIWorkflow(projectType) {
        const workflows = {
            node: `name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v3
    - name: Use Node.js \${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: \${{ matrix.node-version }}
    - run: npm ci
    - run: npm run build --if-present
    - run: npm test
    - run: npm run lint --if-present`,
            
            python: `name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        python-version: ["3.9", "3.10", "3.11"]
    
    steps:
    - uses: actions/checkout@v3
    - name: Set up Python \${{ matrix.python-version }}
      uses: actions/setup-python@v4
      with:
        python-version: \${{ matrix.python-version }}
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
    - name: Test with pytest
      run: |
        pytest`
        };

        return workflows[projectType] || workflows.node;
    }

    /**
     * Helper: Generate CD workflow
     */
    generateCDWorkflow(target) {
        const workflows = {
            vercel: `name: Deploy to Vercel

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: amondnet/vercel-action@v25
      with:
        vercel-token: \${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}`,
            
            aws: `name: Deploy to AWS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1
    - name: Deploy to S3
      run: |
        aws s3 sync ./dist s3://\${{ secrets.S3_BUCKET }}`
        };

        return workflows[target] || '';
    }

    /**
     * Helper: Format changelog
     */
    formatChangelog(changelog) {
        if (typeof changelog === 'string') return changelog;
        
        return `## What's Changed

### Features
${changelog.features?.map(f => `- ${f}`).join('\n') || '- No new features'}

### Bug Fixes
${changelog.fixes?.map(f => `- ${f}`).join('\n') || '- No bug fixes'}

### Improvements
${changelog.improvements?.map(i => `- ${i}`).join('\n') || '- No improvements'}

---
*Released by Archon Orchestrator*`;
    }

    /**
     * Handle GitHub notifications
     */
    handleGitHubNotification(notification) {
        console.log('📬 GitHub notification:', notification);
        
        // Emit to orchestrator for processing
        this.emit('github:notification', notification);
        
        // Handle specific notification types
        switch (notification.type) {
            case 'issue_created':
                this.handleIssueCreated(notification.data);
                break;
            case 'pr_merged':
                this.handlePRMerged(notification.data);
                break;
            case 'workflow_completed':
                this.handleWorkflowCompleted(notification.data);
                break;
        }
    }

    /**
     * Cleanup and stop
     */
    async stop() {
        console.log('Stopping GitHub integration...');
        await this.github.stop();
        this.initialized = false;
    }
}

export default GitHubOrchestratorIntegration;