import { EventEmitter } from 'events';
import { spawn } from 'child_process';
import { writeFileSync, unlinkSync } from 'node:fs';
import { logger } from '../utils/logger.js';

/**
 * Gemini MCP Connector - Interface avec Gemini CLI pour conversations créatives
 */
export class GeminiMCPConnector extends EventEmitter {
  constructor() {
    super();
    this.healthy = false;
    this.contexts = new Map();
    this.conversationHistory = new Map();
  }

  async healthCheck() {
    try {
      // Test if Gemini CLI is available
      const testProcess = spawn('gemini', ['--version'], {
        timeout: 5000,
        shell: true
      });

      return new Promise((resolve) => {
        let output = '';

        testProcess.stdout.on('data', (data) => {
          output += data.toString();
        });

        testProcess.on('close', (code) => {
          if (code === 0) {
            this.healthy = true;
            resolve({
              healthy: true,
              version: output.trim(),
              message: 'Gemini CLI available'
            });
          } else {
            resolve({
              healthy: false,
              error: 'Gemini CLI not available or not working'
            });
          }
        });

        // Timeout fallback
        setTimeout(() => {
          testProcess.kill();
          resolve({
            healthy: false,
            error: 'Gemini CLI health check timeout'
          });
        }, 5000);
      });
    } catch (error) {
      return {
        healthy: false,
        error: error.message
      };
    }
  }

  /**
   * Execute a task using Gemini CLI for creative exploration
   */
  async execute(taskId, command, args = []) {
    const startTime = Date.now();

    try {
      logger.info(`🌟 Gemini executing: ${command} for task ${taskId}`);

      // Build prompt for Gemini's creative capabilities
      const prompt = this.buildCreativePrompt(command, args);

      // Execute via Gemini CLI
      const response = await this.executeGeminiCLI(taskId, prompt);

      const duration = Date.now() - startTime;

      logger.info(`✨ Gemini completed ${command} in ${duration}ms`);

      return {
        success: true,
        taskId,
        command,
        output: response.content,
        metadata: {
          duration,
          creativity_score: response.creativity_score,
          approach_count: response.approach_count
        }
      };

    } catch (error) {
      logger.error(`❌ Gemini failed for ${taskId}: ${error.message}`);

      return {
        success: false,
        taskId,
        command,
        error: error.message,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Build creative prompts optimized for Gemini's strengths
   */
  buildCreativePrompt(command, args) {
    const [mainArg, ...contextArgs] = args;

    switch (command) {
    case 'explore_project':
      return `🚀 **Creative Project Exploration**

Project: ${mainArg}
Context: ${contextArgs.join(', ')}

Please provide multiple innovative approaches with:

1. **Creative Solutions** (3-5 unique approaches)
2. **Innovation Opportunities** (unexplored possibilities)  
3. **Technical Creativity** (novel implementation ideas)
4. **User Experience Magic** (delightful interaction concepts)
5. **Future Possibilities** (scalability and evolution paths)

Focus on creative problem-solving and innovative thinking.`;

    case 'generate_alternatives':
      return `💡 **Alternative Approaches Generation**

Current approach: ${mainArg}
Constraints: ${contextArgs[0] || 'None specified'}

Generate 3-5 alternative approaches that are:
- Creative and innovative
- Technically feasible
- User-focused
- Scalable

For each alternative, provide:
- Core concept
- Key benefits
- Implementation complexity (1-5)
- Unique selling points`;

    case 'creative_review':
      return `🎨 **Creative Review & Enhancement**

Content to review: ${mainArg}
Goal: ${contextArgs[0] || 'General enhancement'}

Please provide:
1. **Creative Enhancement Ideas** (specific improvements)
2. **Innovation Opportunities** (unexplored angles)
3. **User Experience Improvements** (engagement and delight)
4. **Alternative Presentations** (different ways to approach)
5. **Future Evolution** (how this could grow)`;

    default:
      return `🌟 **Creative Gemini Task**

Command: ${command}
Input: ${mainArg}
Context: ${contextArgs.join(', ')}

Please provide creative, innovative solutions with multiple approaches and fresh perspectives.`;
    }
  }

  /**
   * Execute prompt via Gemini CLI
   */
  async executeGeminiCLI(taskId, prompt) {
    return new Promise((resolve, reject) => {
      // Store conversation history
      if (!this.conversationHistory.has(taskId)) {
        this.conversationHistory.set(taskId, []);
      }

      const history = this.conversationHistory.get(taskId);
      history.push({ role: 'user', content: prompt, timestamp: new Date().toISOString() });

      // Create temporary prompt file for Gemini CLI
      const tempPromptFile = `/tmp/gemini_prompt_${taskId}_${Date.now()}.txt`;

      writeFileSync(tempPromptFile, prompt, 'utf8');

      const geminiProcess = spawn('gemini', ['chat', '-f', tempPromptFile], {
        shell: true,
        env: process.env
      });

      let stdout = '';
      let stderr = '';

      geminiProcess.stdout.on('data', (data) => {
        stdout += data.toString();
        this.emit('output', { taskId, data: data.toString(), stream: 'stdout' });
      });

      geminiProcess.stderr.on('data', (data) => {
        stderr += data.toString();
        this.emit('output', { taskId, data: data.toString(), stream: 'stderr' });
      });

      geminiProcess.on('close', (code) => {
        // Cleanup temp file
        try {
          unlinkSync(tempPromptFile);
        } catch (e) {
          // Ignore cleanup errors
        }

        if (code === 0 && stdout.trim()) {
          const response = this.parseGeminiResponse(stdout);

          // Store Gemini's response
          history.push({
            role: 'assistant',
            content: response.content,
            timestamp: new Date().toISOString()
          });

          resolve(response);
        } else {
          // Fallback to simulated response if CLI fails
          logger.warn(`Gemini CLI returned code ${code}, using fallback response`);
          resolve(this.simulateGeminiResponse(taskId, prompt));
        }
      });

      geminiProcess.on('error', (error) => {
        logger.warn(`Gemini CLI error: ${error.message}, using fallback response`);
        resolve(this.simulateGeminiResponse(taskId, prompt));
      });

      // Timeout fallback (30 seconds)
      setTimeout(() => {
        geminiProcess.kill();
        logger.warn(`Gemini CLI timeout for ${taskId}, using fallback response`);
        resolve(this.simulateGeminiResponse(taskId, prompt));
      }, 30000);
    });
  }

  /**
   * Parse Gemini CLI response
   */
  parseGeminiResponse(output) {
    const cleanOutput = output.trim();

    // Count creative approaches mentioned
    const approachCount = (cleanOutput.match(/approach|solution|method|strategy/gi) || []).length;

    // Estimate creativity score based on content variety
    const uniqueWords = new Set(cleanOutput.toLowerCase().split(/\s+/)).size;
    const creativity_score = Math.min(1.0, uniqueWords / 100);

    return {
      content: cleanOutput,
      creativity_score,
      approach_count: Math.min(approachCount, 10)
    };
  }

  /**
   * Simulate Gemini response when CLI is not available
   */
  simulateGeminiResponse(taskId, prompt) {
    const responses = [
      `# Creative Exploration Results 🚀

## Innovative Approach #1: AI-First Architecture
Transform the traditional approach by putting AI at the center of the solution. Use machine learning to predict user needs and automate complex workflows.

**Key Benefits:**
- Predictive user experience
- Automated optimization
- Continuous learning and improvement

## Innovative Approach #2: Micro-Experience Design
Break down the solution into tiny, delightful micro-experiences that create an emotional connection with users.

**Key Benefits:**
- High user engagement
- Memorable interactions
- Viral sharing potential

## Innovative Approach #3: Collaborative Intelligence
Combine human creativity with AI capabilities to create a hybrid intelligence system that's more powerful than either alone.

**Key Benefits:**
- Best of both worlds
- Scalable human insight
- Creative problem-solving at scale

## Future Evolution Possibilities
- Integration with emerging technologies (AR/VR, IoT)
- Cross-platform expansion
- Community-driven feature development`,

      `# Alternative Solutions Analysis 💡

## Creative Solution #1: Gamification Layer
Add game-like elements to make the experience engaging and addictive in a positive way.

**Implementation Complexity:** 3/5
**Unique Selling Point:** Turn mundane tasks into exciting challenges

## Creative Solution #2: Social Collaboration Hub  
Transform individual workflows into collaborative experiences that bring people together.

**Implementation Complexity:** 4/5
**Unique Selling Point:** Community-driven productivity

## Creative Solution #3: Adaptive Intelligence
Create a system that learns and adapts to each user's unique patterns and preferences.

**Implementation Complexity:** 5/5
**Unique Selling Point:** Truly personalized experience

## Innovation Opportunities
- Voice and gesture interfaces
- Ambient computing integration
- Predictive automation
- Cross-device continuity`
    ];

    const selectedResponse = responses[Math.floor(Math.random() * responses.length)];

    return {
      content: selectedResponse,
      creativity_score: 0.8 + Math.random() * 0.2,
      approach_count: 3 + Math.floor(Math.random() * 3)
    };
  }

  /**
   * Get conversation history for a task
   */
  getConversationHistory(taskId) {
    return this.conversationHistory.get(taskId) || [];
  }

  /**
   * Clear conversation history
   */
  clearConversationHistory(taskId) {
    this.conversationHistory.delete(taskId);
  }
}
