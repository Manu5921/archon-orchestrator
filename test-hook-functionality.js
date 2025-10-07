// TEST FILE TO TRIGGER CONTEXT7 HOOKS
// This file should trigger the Claude Code hooks for Context7 reminders

const express = require('express');
const app = express();

// This code should trigger:
// 1. PreToolUse hook: Before I write this code
// 2. PostToolUse hook: After I write this code  
// 3. UserPromptSubmit hook: If you asked me to "write code" or "implement" something

function createServer() {
  app.get('/api/test', (req, res) => {
    res.json({ message: 'Hello World' });
  });
  
  return app;
}

module.exports = { createServer };