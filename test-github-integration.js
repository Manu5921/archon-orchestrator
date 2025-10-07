#!/usr/bin/env node

/**
 * Test script for GitHub MCP Integration
 * Tests the GitHub MCP Server integration with Archon Orchestrator
 */

import dotenv from 'dotenv';
import GitHubMCPClient from './src/integrations/github-mcp-client.js';
import GitHubOrchestratorIntegration from './src/integrations/github-orchestrator-integration.js';

dotenv.config();

// Color codes for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

function logSection(title) {
    console.log('\n' + '='.repeat(60));
    log(title, colors.bright + colors.cyan);
    console.log('='.repeat(60) + '\n');
}

/**
 * Test basic GitHub MCP client functionality
 */
async function testBasicClient() {
    logSection('Testing Basic GitHub MCP Client');
    
    const client = new GitHubMCPClient();
    
    try {
        // Start the client
        log('Starting GitHub MCP client...', colors.yellow);
        const started = await client.start();
        
        if (!started) {
            log('❌ Failed to start GitHub MCP client', colors.red);
            log('Make sure you have:', colors.yellow);
            log('1. Set GITHUB_PAT environment variable', colors.yellow);
            log('2. Docker installed and running (or binary available)', colors.yellow);
            return false;
        }
        
        log('✅ GitHub MCP client started successfully', colors.green);
        
        // Test listing repositories
        log('\nTesting repository listing...', colors.yellow);
        const repos = await client.listRepositories({ 
            type: 'owner',
            sort: 'updated',
            per_page: 5 
        });
        
        if (repos && repos.length > 0) {
            log(`✅ Found ${repos.length} repositories:`, colors.green);
            repos.forEach(repo => {
                console.log(`  - ${repo.full_name} (⭐ ${repo.stargazers_count})`);
            });
        } else {
            log('No repositories found (this might be normal for a new account)', colors.yellow);
        }
        
        // Stop the client
        await client.stop();
        log('\n✅ Basic client test completed', colors.green);
        return true;
        
    } catch (error) {
        log(`❌ Error during basic client test: ${error.message}`, colors.red);
        await client.stop();
        return false;
    }
}

/**
 * Test orchestrator integration
 */
async function testOrchestratorIntegration() {
    logSection('Testing Orchestrator Integration');
    
    // Mock orchestrator for testing
    const mockOrchestrator = {
        tools: {},
        registerTools: function(tools) {
            Object.assign(this.tools, tools);
            log(`✅ Registered ${Object.keys(tools).length} GitHub tools`, colors.green);
        }
    };
    
    const integration = new GitHubOrchestratorIntegration(mockOrchestrator);
    
    try {
        // Initialize integration
        log('Initializing GitHub integration...', colors.yellow);
        const initialized = await integration.initialize();
        
        if (!initialized) {
            log('❌ Failed to initialize GitHub integration', colors.red);
            return false;
        }
        
        log('✅ GitHub integration initialized', colors.green);
        
        // Check registered tools
        const registeredTools = Object.keys(mockOrchestrator.tools);
        log(`\n📦 Registered tools (${registeredTools.length}):`, colors.cyan);
        registeredTools.forEach(tool => {
            console.log(`  - ${tool}`);
        });
        
        // Stop integration
        await integration.stop();
        log('\n✅ Orchestrator integration test completed', colors.green);
        return true;
        
    } catch (error) {
        log(`❌ Error during integration test: ${error.message}`, colors.red);
        await integration.stop();
        return false;
    }
}

/**
 * Test specific GitHub operations (optional - requires valid repo)
 */
async function testGitHubOperations() {
    logSection('Testing GitHub Operations (Optional)');
    
    // You can customize this with your own test repository
    const TEST_REPO = process.env.GITHUB_TEST_REPO;
    
    if (!TEST_REPO) {
        log('ℹ️ Skipping operations test (GITHUB_TEST_REPO not set)', colors.yellow);
        log('To run this test, set GITHUB_TEST_REPO=owner/repo', colors.yellow);
        return true;
    }
    
    const client = new GitHubMCPClient();
    
    try {
        await client.start();
        
        const [owner, repo] = TEST_REPO.split('/');
        
        // Test getting repository info
        log(`\nFetching info for ${TEST_REPO}...`, colors.yellow);
        const repoInfo = await client.getRepository(owner, repo);
        
        if (repoInfo) {
            log('✅ Repository info:', colors.green);
            console.log(`  Name: ${repoInfo.full_name}`);
            console.log(`  Description: ${repoInfo.description || 'No description'}`);
            console.log(`  Stars: ${repoInfo.stargazers_count}`);
            console.log(`  Language: ${repoInfo.language || 'Unknown'}`);
        }
        
        // Test listing issues
        log(`\nFetching issues for ${TEST_REPO}...`, colors.yellow);
        const issues = await client.listIssues({ 
            owner, 
            repo,
            state: 'open',
            per_page: 5 
        });
        
        if (issues && issues.length > 0) {
            log(`✅ Found ${issues.length} open issues:`, colors.green);
            issues.forEach(issue => {
                console.log(`  #${issue.number}: ${issue.title}`);
            });
        } else {
            log('No open issues found', colors.yellow);
        }
        
        await client.stop();
        log('\n✅ GitHub operations test completed', colors.green);
        return true;
        
    } catch (error) {
        log(`❌ Error during operations test: ${error.message}`, colors.red);
        await client.stop();
        return false;
    }
}

/**
 * Main test runner
 */
async function runTests() {
    console.log(colors.bright + colors.blue);
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║       GitHub MCP Integration Test Suite                   ║');
    console.log('║       for Archon Orchestrator                            ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log(colors.reset);
    
    // Check prerequisites
    if (!process.env.GITHUB_PAT) {
        log('⚠️ Warning: GITHUB_PAT not set in environment', colors.yellow);
        log('Please create a .env file with:', colors.yellow);
        log('GITHUB_PAT=your_github_personal_access_token', colors.yellow);
        log('\nOr set it directly:', colors.yellow);
        log('export GITHUB_PAT=your_token_here', colors.yellow);
        process.exit(1);
    }
    
    const results = {
        basic: false,
        integration: false,
        operations: false
    };
    
    // Run tests
    results.basic = await testBasicClient();
    
    if (results.basic) {
        results.integration = await testOrchestratorIntegration();
    }
    
    if (results.basic && results.integration) {
        results.operations = await testGitHubOperations();
    }
    
    // Summary
    logSection('Test Summary');
    
    console.log('Test Results:');
    console.log(`  Basic Client:     ${results.basic ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`  Integration:      ${results.integration ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`  Operations:       ${results.operations ? '✅ PASSED' : '⚠️ SKIPPED/PASSED'}`);
    
    const allPassed = results.basic && results.integration;
    
    if (allPassed) {
        log('\n🎉 All required tests passed!', colors.green + colors.bright);
        log('GitHub MCP integration is ready to use with Archon Orchestrator', colors.green);
        
        console.log('\nNext steps:');
        console.log('1. Add GitHub integration to your workflow scripts');
        console.log('2. Configure repository settings in your projects');
        console.log('3. Enable GitHub features in Archon UI');
    } else {
        log('\n❌ Some tests failed. Please check the errors above.', colors.red);
    }
    
    process.exit(allPassed ? 0 : 1);
}

// Run tests
runTests().catch(error => {
    log(`\n❌ Unexpected error: ${error.message}`, colors.red);
    console.error(error.stack);
    process.exit(1);
});