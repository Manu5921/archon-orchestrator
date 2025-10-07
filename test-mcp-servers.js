#!/usr/bin/env node

/**
 * TEST MCP SERVERS CONFIGURATION
 * Vérifie que Archon et Context7 MCP sont correctement configurés
 */

import { readFileSync, existsSync } from 'fs';
import { Logger } from './src/utils/logger.js';

const logger = new Logger('MCP-Servers-Test');

class MCPServersTest {
  
  constructor() {
    this.mcpConfigPath = './.mcp.json';
    this.claudeSettingsPath = process.env.HOME + '/.claude/settings.json';
  }

  /**
   * Vérifie la configuration .mcp.json
   */
  testMcpJsonConfig() {
    logger.info('🔍 Testing .mcp.json configuration...');
    
    if (!existsSync(this.mcpConfigPath)) {
      logger.error('❌ .mcp.json not found');
      return false;
    }

    try {
      const mcpConfig = JSON.parse(readFileSync(this.mcpConfigPath, 'utf8'));
      
      // Check Archon MCP
      if (mcpConfig.mcpServers?.archon) {
        const archon = mcpConfig.mcpServers.archon;
        logger.info(`✅ Archon MCP: ${archon.transport}://${archon.url}`);
        
        if (archon.transport === 'http' && archon.url === 'http://localhost:8051/mcp') {
          logger.info('   📡 Archon configuration: CORRECT');
        } else {
          logger.warn('   ⚠️ Archon configuration may be incorrect');
        }
      } else {
        logger.error('❌ Archon MCP not found in configuration');
        return false;
      }

      // Check Context7 MCP  
      if (mcpConfig.mcpServers?.context7) {
        const context7 = mcpConfig.mcpServers.context7;
        logger.info(`✅ Context7 MCP: ${context7.transport}://${context7.url}`);
        logger.info('   📚 Context7 configuration: READY');
      } else {
        logger.error('❌ Context7 MCP not found in configuration');
        return false;
      }

      return true;

    } catch (error) {
      logger.error(`❌ Failed to parse .mcp.json: ${error.message}`);
      return false;
    }
  }

  /**
   * Vérifie les paramètres Claude
   */  
  testClaudeSettings() {
    logger.info('🔍 Testing Claude settings...');

    if (!existsSync(this.claudeSettingsPath)) {
      logger.warn('⚠️ Claude settings.json not found');
      return false;
    }

    try {
      const settings = JSON.parse(readFileSync(this.claudeSettingsPath, 'utf8'));
      
      // Check enableAllProjectMcpServers
      if (settings.enableAllProjectMcpServers === true) {
        logger.info('✅ enableAllProjectMcpServers: true');
      } else {
        logger.warn('⚠️ enableAllProjectMcpServers not enabled - servers may need manual approval');
      }

      // Check enabled servers
      if (settings.enabledMcpjsonServers?.includes('archon')) {
        logger.info('✅ Archon MCP enabled in Claude settings');  
      } else {
        logger.warn('⚠️ Archon MCP not explicitly enabled');
      }

      if (settings.enabledMcpjsonServers?.includes('context7')) {
        logger.info('✅ Context7 MCP enabled in Claude settings');
      } else {
        logger.warn('⚠️ Context7 MCP not explicitly enabled');
      }

      // Check hooks
      if (settings.hooks) {
        logger.info('✅ Context7 hooks configured');
      } else {
        logger.warn('⚠️ No hooks configured');
      }

      return true;

    } catch (error) {
      logger.error(`❌ Failed to parse Claude settings: ${error.message}`);
      return false;
    }
  }

  /**
   * Test de connectivité Archon MCP
   */
  async testArchonConnectivity() {
    logger.info('🌐 Testing Archon MCP connectivity...');

    try {
      const response = await fetch('http://localhost:8051/mcp', {
        method: 'GET',
        timeout: 5000
      });

      if (response.ok) {
        logger.info('✅ Archon MCP server responding');
        return true;
      } else {
        logger.warn(`⚠️ Archon MCP server returned ${response.status}`);
        return false;
      }

    } catch (error) {
      logger.warn(`⚠️ Archon MCP server not reachable: ${error.message}`);
      logger.info('   💡 Make sure Archon is running: http://localhost:8051');
      return false;
    }
  }

  /**
   * Génère le résumé de configuration
   */
  generateConfigSummary() {
    return {
      project_mcp_config: './.mcp.json',
      claude_settings: '~/.claude/settings.json',
      servers: {
        archon: {
          url: 'http://localhost:8051/mcp',
          transport: 'http',
          description: 'Archon Orchestrator MCP Server'
        },
        context7: {
          url: 'mcp+sse://context7.ai', 
          transport: 'sse',
          description: 'Context7 Code Quality MCP Server'
        }
      },
      hooks: [
        'PreToolUse: Context7 reminder before Write/Edit',
        'PostToolUse: Context7 suggestion after code generation',
        'UserPromptSubmit: Context7 reminder for code prompts'
      ]
    };
  }

  /**
   * Test complet
   */
  async runCompleteTest() {
    logger.info('🚀 MCP SERVERS CONFIGURATION TEST');
    logger.info('═'.repeat(50));

    const results = {
      mcp_json: false,
      claude_settings: false, 
      archon_connectivity: false,
      overall: false
    };

    // Test 1: .mcp.json configuration
    results.mcp_json = this.testMcpJsonConfig();
    
    // Test 2: Claude settings
    results.claude_settings = this.testClaudeSettings();

    // Test 3: Archon connectivity
    results.archon_connectivity = await this.testArchonConnectivity();

    // Overall result
    results.overall = results.mcp_json && results.claude_settings;

    logger.info('\n📊 TEST RESULTS:');
    logger.info('═'.repeat(30));
    logger.info(`📄 .mcp.json config: ${results.mcp_json ? '✅' : '❌'}`);
    logger.info(`⚙️ Claude settings: ${results.claude_settings ? '✅' : '❌'}`);
    logger.info(`🌐 Archon connectivity: ${results.archon_connectivity ? '✅' : '⚠️'}`);
    logger.info(`🎯 Overall ready: ${results.overall ? '✅' : '❌'}`);

    // Configuration summary
    const summary = this.generateConfigSummary();
    
    logger.info('\n📋 CONFIGURATION SUMMARY:');
    logger.info('═'.repeat(35));
    logger.info(`📄 Project MCP: ${summary.project_mcp_config}`);
    logger.info(`⚙️ Claude settings: ${summary.claude_settings}`);
    logger.info('🔧 Servers configured:');
    Object.entries(summary.servers).forEach(([name, config]) => {
      logger.info(`   • ${name}: ${config.url}`);
    });

    if (results.overall) {
      logger.info('\n🎉 MCP servers ready! Claude can now use:');
      logger.info('   /mcp archon <command>     # Archon orchestration');
      logger.info('   /mcp context7 <command>   # Code quality patterns');
    } else {
      logger.info('\n🔧 Next steps to fix issues:');
      logger.info('   1. Restart Claude Code to load MCP configuration');
      logger.info('   2. Ensure Archon is running on port 8051');  
      logger.info('   3. Approve MCP servers when prompted');
    }

    return results;
  }
}

/**
 * MAIN EXECUTION
 */
async function main() {
  const test = new MCPServersTest();
  
  try {
    const results = await test.runCompleteTest();
    process.exit(results.overall ? 0 : 1);
    
  } catch (error) {
    logger.error(`Test crashed: ${error.message}`);
    process.exit(1);
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { MCPServersTest };