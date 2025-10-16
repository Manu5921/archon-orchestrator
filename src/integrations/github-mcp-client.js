/**
 * GitHub MCP Client for Archon Orchestrator
 * Handles communication with GitHub MCP Server
 */

import { spawn } from 'child_process';
import WebSocket from 'ws';
import { EventEmitter } from 'events';

class GitHubMCPClient extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = {
      mode: process.env.GITHUB_MCP_MODE || 'docker',
      pat: process.env.GITHUB_PAT,
      port: process.env.GITHUB_MCP_PORT || 8054,
      enabled: process.env.GITHUB_MCP_ENABLED === 'true',
      ...config
    };

    this.serverProcess = null;
    this.ws = null;
    this.isConnected = false;
    this.requestQueue = new Map();
    this.requestId = 0;
  }

  /**
     * Start GitHub MCP Server
     */
  async start() {
    if (!this.config.enabled) {
      console.log('⚠️ GitHub MCP integration is disabled');
      return false;
    }

    if (!this.config.pat) {
      console.error('❌ GitHub PAT not configured. Please set GITHUB_PAT environment variable');
      return false;
    }

    console.log('🚀 Starting GitHub MCP Server...');

    try {
      if (this.config.mode === 'docker') {
        await this.startDocker();
      } else {
        await this.startBinary();
      }

      // Connect via WebSocket
      await this.connect();

      console.log('✅ GitHub MCP Server started successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to start GitHub MCP Server:', error);
      return false;
    }
  }

  /**
     * Start server using Docker
     */
  async startDocker() {
    const args = [
      'run',
      '-i',
      '--rm',
      '-p', `${this.config.port}:8080`,
      '-e', 'GITHUB_PERSONAL_ACCESS_TOKEN',
      'ghcr.io/github/github-mcp-server'
    ];

    this.serverProcess = spawn('docker', args, {
      env: {
        ...process.env,
        GITHUB_PERSONAL_ACCESS_TOKEN: this.config.pat
      },
      stdio: ['pipe', 'pipe', 'pipe']
    });

    this.setupProcessHandlers();
  }

  /**
     * Start server using binary with stdio mode
     */
  async startBinary() {
    const binaryPath = '/Users/manu/Documents/DEV/github-mcp-server/github-mcp-server';

    this.serverProcess = spawn(binaryPath, ['stdio'], {
      env: {
        ...process.env,
        GITHUB_PERSONAL_ACCESS_TOKEN: this.config.pat
      },
      stdio: ['pipe', 'pipe', 'pipe']
    });

    this.setupProcessHandlers();
    this.setupStdioHandlers();
  }

  /**
     * Setup process event handlers
     */
  setupProcessHandlers() {
    if (!this.serverProcess) return;

    this.serverProcess.stdout.on('data', (data) => {
      console.log(`[GitHub MCP] ${data.toString()}`);
    });

    this.serverProcess.stderr.on('data', (data) => {
      console.error(`[GitHub MCP Error] ${data.toString()}`);
    });

    this.serverProcess.on('close', (code) => {
      console.log(`[GitHub MCP] Process exited with code ${code}`);
      this.isConnected = false;
      this.emit('disconnected');
    });

    this.serverProcess.on('error', (error) => {
      console.error('[GitHub MCP] Process error:', error);
      this.emit('error', error);
    });
  }

  /**
     * Setup stdio handlers for binary mode
     */
  setupStdioHandlers() {
    if (!this.serverProcess) return;

    // Handle JSON-RPC over stdio
    let buffer = '';

    this.serverProcess.stdout.on('data', (data) => {
      buffer += data.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop(); // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.trim()) {
          try {
            const message = JSON.parse(line);
            this.handleMessage(message);
          } catch (e) {
            console.log(`[GitHub MCP] ${line}`);
          }
        }
      }
    });
  }

  /**
     * Connect to GitHub MCP Server
     */
  async connect() {
    if (this.config.mode === 'binary') {
      // For stdio mode, we're connected as soon as the process starts
      return new Promise((resolve) => {
        this.isConnected = true;
        this.emit('connected');
        console.log('✅ Connected to GitHub MCP Server (stdio mode)');
        resolve();
      });
    } else {
      // Docker mode uses WebSocket
      return this.connectWebSocket();
    }
  }

  /**
     * Connect via WebSocket (for Docker mode)
     */
  async connectWebSocket() {
    return new Promise((resolve, reject) => {
      const wsUrl = `ws://localhost:${this.config.port}/mcp`;

      this.ws = new WebSocket(wsUrl);

      this.ws.on('open', () => {
        console.log('✅ Connected to GitHub MCP Server');
        this.isConnected = true;
        this.emit('connected');
        resolve();
      });

      this.ws.on('message', (data) => {
        this.handleMessage(JSON.parse(data.toString()));
      });

      this.ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      });

      this.ws.on('close', () => {
        this.isConnected = false;
        this.emit('disconnected');
      });

      // Timeout connection attempt
      setTimeout(() => {
        if (!this.isConnected) {
          reject(new Error('Connection timeout'));
        }
      }, 10000);
    });
  }

  /**
     * Handle incoming messages from server
     */
  handleMessage(message) {
    if (message.id && this.requestQueue.has(message.id)) {
      const { resolve, reject } = this.requestQueue.get(message.id);
      this.requestQueue.delete(message.id);

      if (message.error) {
        reject(new Error(message.error.message));
      } else {
        resolve(message.result);
      }
    } else if (message.method) {
      // Handle server-initiated messages
      this.emit('notification', message);
    }
  }

  /**
     * Call a GitHub MCP method
     */
  async call(method, params = {}) {
    if (!this.isConnected) {
      throw new Error('Not connected to GitHub MCP Server');
    }

    const id = ++this.requestId;
    const request = {
      jsonrpc: '2.0',
      id,
      method,
      params
    };

    return new Promise((resolve, reject) => {
      this.requestQueue.set(id, { resolve, reject });

      if (this.config.mode === 'binary') {
        // Send via stdio
        this.serverProcess.stdin.write(JSON.stringify(request) + '\n', (error) => {
          if (error) {
            this.requestQueue.delete(id);
            reject(error);
          }
        });
      } else {
        // Send via WebSocket
        this.ws.send(JSON.stringify(request), (error) => {
          if (error) {
            this.requestQueue.delete(id);
            reject(error);
          }
        });
      }

      // Timeout request
      setTimeout(() => {
        if (this.requestQueue.has(id)) {
          this.requestQueue.delete(id);
          reject(new Error('Request timeout'));
        }
      }, 30000);
    });
  }

  /**
     * Repository Operations
     */
  async createRepository(params) {
    return this.call('create_repository', params);
  }

  async getRepository(owner, repo) {
    return this.call('get_repository', { owner, repo });
  }

  async listRepositories(params = {}) {
    return this.call('list_repositories', params);
  }

  async searchCode(query, params = {}) {
    return this.call('search_code', { query, ...params });
  }

  /**
     * Issue Operations
     */
  async createIssue(params) {
    return this.call('create_issue', params);
  }

  async getIssue(owner, repo, number) {
    return this.call('get_issue', { owner, repo, number });
  }

  async updateIssue(params) {
    return this.call('update_issue', params);
  }

  async listIssues(params = {}) {
    return this.call('list_issues', params);
  }

  /**
     * Pull Request Operations
     */
  async createPullRequest(params) {
    return this.call('create_pull_request', params);
  }

  async getPullRequest(owner, repo, number) {
    return this.call('get_pull_request', { owner, repo, number });
  }

  async mergePullRequest(params) {
    return this.call('merge_pull_request', params);
  }

  async createReview(params) {
    return this.call('create_review', params);
  }

  /**
     * Workflow Operations
     */
  async triggerWorkflow(params) {
    return this.call('trigger_workflow', params);
  }

  async getWorkflowRuns(owner, repo, workflow_id) {
    return this.call('get_workflow_runs', { owner, repo, workflow_id });
  }

  async getWorkflowRunLogs(owner, repo, run_id) {
    return this.call('get_workflow_run_logs', { owner, repo, run_id });
  }

  /**
     * Release Operations
     */
  async createRelease(params) {
    return this.call('create_release', params);
  }

  async getLatestRelease(owner, repo) {
    return this.call('get_latest_release', { owner, repo });
  }

  /**
     * File Operations
     */
  async getFileContent(owner, repo, path, ref = 'main') {
    return this.call('get_file_content', { owner, repo, path, ref });
  }

  async createOrUpdateFile(params) {
    return this.call('create_or_update_file', params);
  }

  async deleteFile(params) {
    return this.call('delete_file', params);
  }

  /**
     * Branch Operations
     */
  async createBranch(owner, repo, branch, from = 'main') {
    return this.call('create_branch', { owner, repo, branch, from });
  }

  async deleteBranch(owner, repo, branch) {
    return this.call('delete_branch', { owner, repo, branch });
  }

  /**
     * Stop GitHub MCP Server
     */
  async stop() {
    console.log('Stopping GitHub MCP Server...');

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    if (this.serverProcess) {
      this.serverProcess.kill();
      this.serverProcess = null;
    }

    this.isConnected = false;
    console.log('GitHub MCP Server stopped');
  }
}

export default GitHubMCPClient;
