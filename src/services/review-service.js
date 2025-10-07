// Review Service - Smart Review Workflow Phase 1 avec Context Preparation
import { geminiSend } from "../agents/gemini-agent.js";
import { logger } from "../utils/logger.js";
import { contextService } from "./context-service.js";

export async function reviewWithGemini(ctx, reviewPrompt) {
  // Gate: n'utiliser Gemini réel que si agents.gemini===true
  const hasGemini = ctx?.agents?.gemini || ctx?.capabilities?.agents?.gemini;
  
  if (!hasGemini) {
    logger.warn(`⏸️ Gemini review skipped - agent not available`);
    return { ok: false, error: "gemini_unavailable", used: "fallback" };
  }

  logger.info(`🎨 Starting real Gemini review...`);
  
  const startTime = Date.now();
  const result = await geminiSend(reviewPrompt);
  
  if (result.ok) {
    const duration = Date.now() - startTime;
    logger.info(`✅ Gemini review completed via ${result.meta?.mode} in ${duration}ms`);
    
    return { 
      ok: true, 
      text: result.text, 
      used: result.meta?.mode || "cli",
      duration_ms: duration
    };
  }
  
  // Un seul retry light sur les erreurs retryables
  if (result.retry) {
    logger.warn(`🔄 Retrying Gemini review after error: ${result.error}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const retryResult = await geminiSend(reviewPrompt);
    if (retryResult.ok) {
      const duration = Date.now() - startTime;
      logger.info(`✅ Gemini review completed on retry via ${retryResult.meta?.mode} in ${duration}ms`);
      
      return { 
        ok: true, 
        text: retryResult.text, 
        used: retryResult.meta?.mode || "cli",
        duration_ms: duration,
        retry_used: true
      };
    }
  }
  
  // Échec définitif - pas de fallback automatique
  logger.error(`❌ Gemini review failed definitively: ${result.error} (code: ${result.code})`);
  
  return { 
    ok: false, 
    error: result.error, 
    used: "failed",
    code: result.code,
    retry_exhausted: !!result.retry
  };
}

/**
 * SMART REVIEW WORKFLOW PHASE 1 - Context-Aware Review
 * Nouveau service qui utilise context intelligent pour reviews 5x plus pertinentes
 */
export async function smartReviewWithContext(ctx, filePath, task) {
  logger.info(`🧠 Starting Smart Review Phase 1 for: ${filePath}`);
  
  // Gate: n'utiliser Gemini réel que si agents.gemini===true
  const hasGemini = ctx?.agents?.gemini || ctx?.capabilities?.agents?.gemini;
  
  if (!hasGemini) {
    logger.warn(`⏸️ Smart Gemini review skipped - agent not available`);
    return { ok: false, error: "gemini_unavailable", used: "fallback" };
  }

  const startTime = Date.now();

  try {
    // Phase 1: Context Preparation (nouveau)
    logger.info(`🔍 Phase 1a: Preparing intelligent context...`);
    const contextResult = await contextService.prepareReviewContext(filePath, task);
    
    if (!contextResult.ok) {
      logger.error(`❌ Context preparation failed: ${contextResult.error}`);
      // Fallback to basic review
      const basicPrompt = buildBasicReviewPrompt(task, await require('fs').promises.readFile(filePath, 'utf8'), task.requirements);
      return await reviewWithGemini(ctx, basicPrompt);
    }

    // Phase 1b: Build Smart Review Prompt with Context
    logger.info(`🎨 Phase 1b: Building context-aware review prompt...`);
    const smartPrompt = buildSmartReviewPrompt(contextResult.context);
    
    // Phase 1c: Execute Gemini Review with Rich Context
    logger.info(`🧠 Phase 1c: Executing intelligent Gemini review...`);
    const reviewResult = await geminiSend(smartPrompt);
    
    if (reviewResult.ok) {
      const totalDuration = Date.now() - startTime;
      logger.info(`✅ Smart Review Phase 1 completed in ${totalDuration}ms (context: ${contextResult.duration_ms}ms)`);
      
      return {
        ok: true,
        text: reviewResult.text,
        used: reviewResult.meta?.mode || "cli",
        duration_ms: totalDuration,
        context_duration_ms: contextResult.duration_ms,
        insights: contextResult.insights,
        complexity_score: contextResult.complexity_score,
        phase: "smart_review_phase_1"
      };
    }

    // Single retry with context
    if (reviewResult.retry) {
      logger.warn(`🔄 Retrying Smart Review after error: ${reviewResult.error}`);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const retryResult = await geminiSend(smartPrompt);
      if (retryResult.ok) {
        const totalDuration = Date.now() - startTime;
        return {
          ok: true,
          text: retryResult.text,
          used: retryResult.meta?.mode || "cli",
          duration_ms: totalDuration,
          context_duration_ms: contextResult.duration_ms,
          retry_used: true,
          phase: "smart_review_phase_1"
        };
      }
    }

    // Échec définitif
    logger.error(`❌ Smart Review Phase 1 failed: ${reviewResult.error}`);
    return {
      ok: false,
      error: reviewResult.error,
      used: "failed",
      code: reviewResult.code,
      phase: "smart_review_phase_1"
    };

  } catch (error) {
    logger.error(`💥 Smart Review Phase 1 error: ${error.message}`);
    return {
      ok: false,
      error: error.message,
      used: "failed",
      phase: "smart_review_phase_1"
    };
  }
}

/**
 * Build Smart Review Prompt with Rich Context (Phase 1)
 */
function buildSmartReviewPrompt(context) {
  return `🧠 **SMART CODE REVIEW - PHASE 1 CONTEXT-AWARE**

## 📋 TASK CONTEXT
**Task:** ${context.task_info.title}
**Requirements:** ${context.task_info.requirements}
**Architecture:** ${context.task_info.architecture}

## 🏗️ ARCHITECTURAL CONTEXT  
**Layer:** ${context.architecture.layer}
**Framework(s):** ${context.architecture.framework.join(', ') || 'None detected'}
**Patterns:** ${context.architecture.patterns.join(', ') || 'Standard'}
**Responsibility:** ${context.architecture.responsibility.join(', ')}

## 📊 CODE ANALYSIS
**Language:** ${context.file_info.language}
**Complexity:** ${context.file_info.complexity}/10
**Size:** ${context.file_info.lines} lines (${context.file_info.size} bytes)

## 🔧 PATTERNS DETECTED
- **Functions:** ${context.code_patterns.functions}
- **Classes:** ${context.code_patterns.classes}  
- **Async Operations:** ${context.code_patterns.async_usage}
- **Error Handling Score:** ${context.code_patterns.error_handling}/10
- **Security Score:** ${context.code_patterns.security_measures}/${context.code_patterns.security_measures + 3}

## 📦 DEPENDENCIES CONTEXT
**Frameworks:** ${context.dependencies.frameworks.join(', ') || 'None'}
**Key Libraries:** ${context.dependencies.key_dependencies.join(', ') || 'None'}
**External Deps:** ${context.dependencies.external_count}

## 🔍 SMART INSIGHTS
${context.insights.map(insight => `- ${insight}`).join('\n')}

## 💻 CODE TO REVIEW
\`\`\`${context.file_info.language}
${context.code_preview}
\`\`\`

---

## 🎯 SMART REVIEW REQUEST

Based on this **rich architectural and contextual understanding**, provide:

### 1. **CONTEXT-AWARE QUALITY SCORE** (0-100)
- Consider architectural layer, patterns, and dependencies
- Weight score based on responsibility and complexity

### 2. **CREATIVE ARCHITECTURAL IMPROVEMENTS**
- Leverage framework-specific optimizations
- Suggest patterns that fit the architectural context
- Innovation opportunities within this ecosystem

### 3. **INTELLIGENT BEST PRACTICES**
- Standards specific to detected frameworks/libraries
- Security improvements relevant to identified patterns
- Performance optimizations for this architectural layer

### 4. **SMART TEST GENERATION**
- Unit tests matching architectural patterns
- Integration tests for detected dependencies
- Edge cases based on complexity analysis

Focus on **context-intelligent feedback** that leverages the architectural understanding and dependency analysis rather than generic advice.`;
}

/**
 * Legacy: Basic Review Prompt (fallback)
 */
export function buildBasicReviewPrompt(task, code, requirements) {
  return `🎨 **CREATIVE CODE REVIEW**

Task: ${task.title || task.name || 'Code Review'}
Code to review:
\`\`\`
${code.slice(0, 2000)}${code.length > 2000 ? '...' : ''}
\`\`\`

Requirements: ${requirements}

Please provide:
1. **Quality Score** (0-100) - Overall code quality
2. **Creative Improvements** - Innovative enhancements 
3. **Best Practices** - Standards compliance
4. **Innovation Opportunities** - Unique optimizations

Focus on actionable, creative feedback that elevates the code beyond standard implementation.`;
}

// Maintenir compatibilité legacy
export function buildReviewPrompt(task, code, requirements) {
  return buildBasicReviewPrompt(task, code, requirements);
}