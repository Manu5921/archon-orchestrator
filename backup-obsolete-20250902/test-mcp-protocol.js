#!/usr/bin/env node

import WebSocket from 'ws';

/**
 * Test si Orchestra implémente vraiment le protocole MCP standard
 * que Claude Code attend
 */

async function testMCPProtocol() {
  console.log('🔍 Testing Orchestra MCP Protocol Compliance...\n');
  
  const ws = new WebSocket('ws://localhost:3456');
  
  ws.on('open', () => {
    console.log('✅ WebSocket connected to Orchestra');
    
    // Test 1: MCP Initialize request (ce que Claude Code envoie)
    const initializeRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {
          roots: {
            listChanged: true
          },
          sampling: {}
        },
        clientInfo: {
          name: 'claude-code',
          version: '1.0.0'
        }
      }
    };
    
    console.log('📤 Sending MCP Initialize request...');
    ws.send(JSON.stringify(initializeRequest));
  });
  
  ws.on('message', (data) => {
    try {
      const response = JSON.parse(data.toString());
      console.log('📥 Orchestra response:');
      console.log(JSON.stringify(response, null, 2));
      
      // Check if it's a valid MCP response
      if (response.jsonrpc === '2.0' && response.id === 1) {
        console.log('✅ Valid MCP response format');
        
        // Test 2: List tools request
        const listToolsRequest = {
          jsonrpc: '2.0',
          id: 2,
          method: 'tools/list',
          params: {}
        };
        
        console.log('\n📤 Sending tools/list request...');
        ws.send(JSON.stringify(listToolsRequest));
        
      } else {
        console.log('❌ Invalid MCP response format - this explains Claude Code rejection');
      }
      
    } catch (error) {
      console.log('❌ Invalid JSON response:', data.toString());
    }
  });
  
  ws.on('error', (error) => {
    console.log('❌ WebSocket error:', error.message);
  });
  
  ws.on('close', () => {
    console.log('🔌 Connection closed');
  });
  
  // Auto-close after 10 seconds
  setTimeout(() => {
    ws.close();
    process.exit(0);
  }, 10000);
}

testMCPProtocol().catch(console.error);