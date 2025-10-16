#!/usr/bin/env node

/**
 * Simple test for GitHub MCP Server stdio communication
 */

import { spawn } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

const PAT = process.env.GITHUB_PAT;

if (!PAT) {
  console.error('❌ GITHUB_PAT not set in environment');
  process.exit(1);
}

console.log('🚀 Starting GitHub MCP Server in stdio mode...\n');

const server = spawn('/Users/manu/Documents/DEV/github-mcp-server/github-mcp-server', ['stdio'], {
  env: {
    ...process.env,
    GITHUB_PERSONAL_ACCESS_TOKEN: PAT
  },
  stdio: ['pipe', 'pipe', 'pipe']
});

let buffer = '';
let requestId = 0;
const pendingRequests = new Map();

// Handle server output
server.stdout.on('data', (data) => {
  buffer += data.toString();
  const lines = buffer.split('\n');
  buffer = lines.pop();

  for (const line of lines) {
    if (line.trim()) {
      try {
        const message = JSON.parse(line);
        console.log('📥 Received:', JSON.stringify(message, null, 2));

        if (message.id && pendingRequests.has(message.id)) {
          const { resolve } = pendingRequests.get(message.id);
          pendingRequests.delete(message.id);
          resolve(message);
        }
      } catch (e) {
        console.log('📝 Server:', line);
      }
    }
  }
});

server.stderr.on('data', (data) => {
  console.error('❌ Error:', data.toString());
});

server.on('close', (code) => {
  console.log(`\n✅ Server exited with code ${code}`);
});

// Send MCP request
function sendRequest(method, params = {}) {
  const id = ++requestId;
  const request = {
    jsonrpc: '2.0',
    id,
    method,
    params
  };

  console.log('📤 Sending:', JSON.stringify(request, null, 2));

  return new Promise((resolve) => {
    pendingRequests.set(id, { resolve });
    server.stdin.write(JSON.stringify(request) + '\n');
  });
}

// Test sequence
async function runTests() {
  console.log('='.repeat(60));
  console.log('Testing GitHub MCP Server Communication');
  console.log('='.repeat(60) + '\n');

  // Wait for server to initialize
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    // Test 1: Initialize/List tools
    console.log('📋 Test 1: Listing available tools...\n');
    const initResponse = await sendRequest('tools/list');

    if (initResponse.result && initResponse.result.tools) {
      console.log(`\n✅ Found ${initResponse.result.tools.length} tools available`);
      console.log('Available tools:', initResponse.result.tools.slice(0, 5).map(t => t.name).join(', '), '...\n');
    }

    // Test 2: Get user info
    console.log('📋 Test 2: Getting user info...\n');
    const userResponse = await sendRequest('tools/call', {
      name: 'get_user',
      arguments: {}
    });

    if (userResponse.result) {
      console.log('\n✅ User info retrieved successfully\n');
    }

    // Test 3: List repositories
    console.log('📋 Test 3: Listing repositories...\n');
    const reposResponse = await sendRequest('tools/call', {
      name: 'list_repositories',
      arguments: {
        per_page: 5,
        sort: 'updated'
      }
    });

    if (reposResponse.result) {
      console.log('\n✅ Repositories listed successfully\n');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }

  // Cleanup
  console.log('\n🔚 Closing server...');
  server.stdin.end();
}

// Run tests
runTests().catch(console.error);
