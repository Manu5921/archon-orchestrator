#!/usr/bin/env node

import WebSocket from 'ws';

async function testConnection() {
  console.log('🔌 Testing connection to Orchestra MCP Server...');
  
  try {
    const ws = new WebSocket('ws://localhost:3456');
    
    ws.on('open', () => {
      console.log('✅ Connected to Orchestra on port 3456');
      
      // Test listing tools
      ws.send(JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
        params: {}
      }));
    });
    
    ws.on('message', (data) => {
      const response = JSON.parse(data.toString());
      console.log('📨 Response:', JSON.stringify(response, null, 2));
      
      if (response.id === 1 && response.result?.tools) {
        console.log(`\n✅ Found ${response.result.tools.length} Orchestra tools:`);
        response.result.tools.forEach(tool => {
          console.log(`   🔧 ${tool.name} - ${tool.description}`);
        });
        
        // Test routing a task
        console.log('\n🎯 Testing task routing...');
        ws.send(JSON.stringify({
          jsonrpc: '2.0',
          id: 2,
          method: 'tools/call',
          params: {
            name: 'orchestra:route_task',
            arguments: {
              task_description: 'Debug authentication error in login system',
              task_type: 'debugging',
              complexity: 'medium'
            }
          }
        }));
      }
      
      if (response.id === 2) {
        if (response.result?.success) {
          console.log('✅ Task successfully routed!');
          console.log(`   Agent: ${response.result.routing_decision?.primary_agent}`);
          console.log(`   Confidence: ${response.result.routing_decision?.confidence}%`);
          console.log(`   Task ID: ${response.result.task_id}`);
        } else {
          console.log('❌ Task routing failed:', response.result?.error || 'Unknown error');
        }
        
        ws.close();
      }
    });
    
    ws.on('error', (error) => {
      console.error('❌ WebSocket error:', error.message);
    });
    
    ws.on('close', () => {
      console.log('🔌 Connection closed');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Failed to connect:', error.message);
    process.exit(1);
  }
}

testConnection();