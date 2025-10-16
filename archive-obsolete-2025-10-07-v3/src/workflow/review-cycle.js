import { EventEmitter } from 'events';
import { logger } from '../utils/logger.js';

/**
 * Revolutionary Review Cycle - Gemini-Claude Collaborative Code Improvement
 *
 * This implements the revolutionary workflow where:
 * 1. Gemini provides rapid, creative code review with quality scoring
 * 2. Claude adjusts code based on Gemini feedback with precision
 * 3. Iterative improvement until quality standards are met
 * 4. Context preservation throughout the cycle
 */
export class ReviewCycle extends EventEmitter {
  constructor(geminiAgent, claudeAgent) {
    super();
    this.geminiAgent = geminiAgent;
    this.claudeAgent = claudeAgent;
    this.activeReviews = new Map();
    this.reviewMetrics = {
      total_cycles: 0,
      successful_reviews: 0,
      average_iterations: 0,
      quality_improvement: 0
    };
  }

  /**
   * Start a comprehensive review cycle for code
   */
  async startReviewCycle(projectId, taskId, initialCode, requirements = {}) {
    const cycleId = `${projectId}_${taskId}_${Date.now()}`;

    logger.info(`🔄 Starting Revolutionary Review Cycle: ${cycleId}`);

    const reviewCycle = {
      id: cycleId,
      project_id: projectId,
      task_id: taskId,
      requirements,
      iterations: [],
      current_code: initialCode,
      initial_quality_score: 0,
      final_quality_score: 0,
      status: 'in_progress',
      started_at: new Date(),
      max_iterations: requirements.max_iterations || 5,
      quality_threshold: requirements.quality_threshold || 90,
      focus_areas: requirements.focus_areas || ['code_quality', 'best_practices', 'performance', 'maintainability']
    };

    this.activeReviews.set(cycleId, reviewCycle);
    this.reviewMetrics.total_cycles++;

    try {
      // Get initial quality baseline from Gemini
      const initialReview = await this.geminiAgent.reviewCode(
        projectId,
        taskId,
        initialCode,
        requirements,
        { baseline_review: true }
      );

      reviewCycle.initial_quality_score = initialReview.quality_score || 60;
      logger.info(`📊 Initial quality score: ${reviewCycle.initial_quality_score}/100`);

      // Start the iterative improvement process
      const result = await this._executeIterativeImprovement(reviewCycle);

      // Update metrics
      this._updateReviewMetrics(reviewCycle);

      return result;

    } catch (error) {
      logger.error(`❌ Review cycle failed: ${cycleId}`, error);
      reviewCycle.status = 'failed';
      reviewCycle.error = error.message;

      return {
        success: false,
        cycle_id: cycleId,
        error: error.message,
        iterations: reviewCycle.iterations.length
      };
    }
  }

  /**
   * Execute the core iterative improvement process
   */
  async _executeIterativeImprovement(reviewCycle) {
    let currentCode = reviewCycle.current_code;
    let iterationCount = 0;

    while (iterationCount < reviewCycle.max_iterations) {
      iterationCount++;
      logger.info(`🔄 Review iteration ${iterationCount}/${reviewCycle.max_iterations} for ${reviewCycle.id}`);

      const iteration = {
        number: iterationCount,
        started_at: new Date(),
        gemini_review: null,
        claude_adjustment: null,
        quality_improvement: 0
      };

      // Phase 1: Gemini Creative Review
      logger.info(`🎨 Gemini reviewing code (iteration ${iterationCount})`);

      const geminiReview = await this.geminiAgent.reviewCode(
        reviewCycle.project_id,
        reviewCycle.task_id,
        currentCode,
        reviewCycle.requirements,
        {
          iteration: iterationCount,
          focus_areas: reviewCycle.focus_areas,
          previous_iterations: reviewCycle.iterations.map(i => ({
            quality_score: i.gemini_review?.quality_score,
            main_issues: i.gemini_review?.feedback?.slice(0, 3)
          }))
        }
      );

      iteration.gemini_review = {
        quality_score: geminiReview.quality_score || 70,
        approved: geminiReview.approved || false,
        confidence: geminiReview.confidence || 80,
        feedback: geminiReview.feedback || [],
        suggestions: geminiReview.suggestions || [],
        strengths: geminiReview.strengths || [],
        focus_analysis: geminiReview.focus_analysis || {}
      };

      logger.info(`📊 Gemini review - Quality: ${iteration.gemini_review.quality_score}/100, Approved: ${iteration.gemini_review.approved}`);

      // Check if quality threshold reached
      if (iteration.gemini_review.approved ||
          iteration.gemini_review.quality_score >= reviewCycle.quality_threshold) {

        logger.info(`✅ Quality threshold reached! Final score: ${iteration.gemini_review.quality_score}/100`);

        iteration.completed_at = new Date();
        reviewCycle.iterations.push(iteration);
        reviewCycle.status = 'approved';
        reviewCycle.final_quality_score = iteration.gemini_review.quality_score;
        reviewCycle.final_code = currentCode;
        reviewCycle.completed_at = new Date();

        return this._buildSuccessfulResult(reviewCycle);
      }

      // Phase 2: Claude Precise Adjustment
      if (iterationCount < reviewCycle.max_iterations) {
        logger.info('🎯 Claude adjusting code based on Gemini feedback');

        const claudeAdjustment = await this.claudeAgent.adjustCodeFromReview(
          reviewCycle.project_id,
          reviewCycle.task_id,
          currentCode,
          iteration.gemini_review.feedback,
          {
            suggestions: iteration.gemini_review.suggestions,
            focus_areas: reviewCycle.focus_areas,
            target_quality: reviewCycle.quality_threshold,
            iteration_context: {
              current_quality: iteration.gemini_review.quality_score,
              iteration_number: iterationCount,
              previous_attempts: reviewCycle.iterations.length
            }
          }
        );

        iteration.claude_adjustment = {
          success: claudeAdjustment.success || true,
          changes_made: claudeAdjustment.changes_made || [],
          reasoning: claudeAdjustment.reasoning || 'Code improvements applied',
          confidence: claudeAdjustment.confidence || 85
        };

        if (claudeAdjustment.success && claudeAdjustment.output) {
          currentCode = claudeAdjustment.output;
          reviewCycle.current_code = currentCode;

          logger.info(`🔧 Claude adjustment completed with confidence: ${iteration.claude_adjustment.confidence}%`);
        } else {
          logger.warn(`⚠️ Claude adjustment had issues: ${claudeAdjustment.error || 'Unknown error'}`);
          iteration.claude_adjustment.error = claudeAdjustment.error;
        }
      }

      // Calculate quality improvement
      if (reviewCycle.iterations.length > 0) {
        const previousQuality = reviewCycle.iterations[reviewCycle.iterations.length - 1].gemini_review.quality_score;
        iteration.quality_improvement = iteration.gemini_review.quality_score - previousQuality;
      } else {
        iteration.quality_improvement = iteration.gemini_review.quality_score - reviewCycle.initial_quality_score;
      }

      iteration.completed_at = new Date();
      reviewCycle.iterations.push(iteration);

      // Emit progress event
      this.emit('iteration_completed', {
        cycle_id: reviewCycle.id,
        iteration: iterationCount,
        quality_score: iteration.gemini_review.quality_score,
        approved: iteration.gemini_review.approved,
        improvement: iteration.quality_improvement
      });

      // Check for quality stagnation
      if (iterationCount >= 2) {
        const lastTwoIterations = reviewCycle.iterations.slice(-2);
        const qualityDifference = Math.abs(
          lastTwoIterations[1].gemini_review.quality_score -
          lastTwoIterations[0].gemini_review.quality_score
        );

        if (qualityDifference < 2) {
          logger.warn(`⚠️ Quality improvement stagnating (difference: ${qualityDifference})`);

          if (iterationCount >= 3) {
            logger.info('🛑 Stopping review cycle due to stagnation');
            break;
          }
        }
      }
    }

    // Max iterations reached or stagnated
    const finalQuality = reviewCycle.iterations.length > 0 ?
      reviewCycle.iterations[reviewCycle.iterations.length - 1].gemini_review.quality_score :
      reviewCycle.initial_quality_score;

    reviewCycle.status = 'max_iterations_reached';
    reviewCycle.final_quality_score = finalQuality;
    reviewCycle.final_code = currentCode;
    reviewCycle.completed_at = new Date();

    logger.info(`⏰ Review cycle completed: ${reviewCycle.iterations.length} iterations, final quality: ${finalQuality}/100`);

    return this._buildFinalResult(reviewCycle);
  }

  /**
   * Build successful result when quality threshold is reached
   */
  _buildSuccessfulResult(reviewCycle) {
    this.reviewMetrics.successful_reviews++;

    return {
      success: true,
      status: 'approved',
      cycle_id: reviewCycle.id,
      final_code: reviewCycle.final_code,
      quality_improvement: reviewCycle.final_quality_score - reviewCycle.initial_quality_score,
      initial_quality: reviewCycle.initial_quality_score,
      final_quality: reviewCycle.final_quality_score,
      iterations_completed: reviewCycle.iterations.length,
      total_duration_ms: Date.now() - reviewCycle.started_at.getTime(),
      summary: this._generateCycleSummary(reviewCycle),
      recommendations: this._generateRecommendations(reviewCycle)
    };
  }

  /**
   * Build final result when max iterations reached
   */
  _buildFinalResult(reviewCycle) {
    const wasSuccessful = reviewCycle.final_quality_score >= reviewCycle.quality_threshold;

    if (wasSuccessful) {
      this.reviewMetrics.successful_reviews++;
    }

    return {
      success: wasSuccessful,
      status: reviewCycle.status,
      cycle_id: reviewCycle.id,
      final_code: reviewCycle.final_code,
      quality_improvement: reviewCycle.final_quality_score - reviewCycle.initial_quality_score,
      initial_quality: reviewCycle.initial_quality_score,
      final_quality: reviewCycle.final_quality_score,
      iterations_completed: reviewCycle.iterations.length,
      total_duration_ms: Date.now() - reviewCycle.started_at.getTime(),
      threshold_reached: wasSuccessful,
      summary: this._generateCycleSummary(reviewCycle),
      recommendations: this._generateRecommendations(reviewCycle)
    };
  }

  /**
   * Generate comprehensive cycle summary
   */
  _generateCycleSummary(reviewCycle) {
    const totalImprovement = reviewCycle.final_quality_score - reviewCycle.initial_quality_score;
    const avgIterationTime = reviewCycle.iterations.reduce((sum, iter) => {
      return sum + (iter.completed_at.getTime() - iter.started_at.getTime());
    }, 0) / reviewCycle.iterations.length;

    const majorIssuesResolved = reviewCycle.iterations.reduce((count, iter) => {
      return count + (iter.claude_adjustment?.changes_made?.length || 0);
    }, 0);

    return {
      quality_improvement: totalImprovement,
      improvement_percentage: Math.round((totalImprovement / reviewCycle.initial_quality_score) * 100),
      avg_iteration_time_ms: Math.round(avgIterationTime),
      major_issues_resolved: majorIssuesResolved,
      gemini_avg_confidence: Math.round(
        reviewCycle.iterations.reduce((sum, iter) => sum + (iter.gemini_review?.confidence || 0), 0) /
        reviewCycle.iterations.length
      ),
      claude_avg_confidence: Math.round(
        reviewCycle.iterations
          .filter(iter => iter.claude_adjustment)
          .reduce((sum, iter) => sum + (iter.claude_adjustment.confidence || 0), 0) /
        reviewCycle.iterations.filter(iter => iter.claude_adjustment).length
      ),
      focus_areas_addressed: reviewCycle.focus_areas.length,
      collaboration_efficiency: this._calculateCollaborationEfficiency(reviewCycle)
    };
  }

  /**
   * Calculate collaboration efficiency between Gemini and Claude
   */
  _calculateCollaborationEfficiency(reviewCycle) {
    const iterationsWithImprovements = reviewCycle.iterations.filter(
      iter => iter.quality_improvement > 0
    ).length;

    const successfulClaudeAdjustments = reviewCycle.iterations.filter(
      iter => iter.claude_adjustment?.success
    ).length;

    const efficiencyScore = (
      (iterationsWithImprovements / reviewCycle.iterations.length) * 50 +
      (successfulClaudeAdjustments / reviewCycle.iterations.filter(iter => iter.claude_adjustment).length) * 50
    );

    return Math.round(efficiencyScore);
  }

  /**
   * Generate recommendations based on review cycle results
   */
  _generateRecommendations(reviewCycle) {
    const recommendations = [];

    // Quality-based recommendations
    if (reviewCycle.final_quality_score < 80) {
      recommendations.push({
        type: 'quality_improvement',
        priority: 'high',
        message: 'Consider additional code refactoring sessions to reach higher quality standards'
      });
    }

    // Iteration efficiency recommendations
    if (reviewCycle.iterations.length >= reviewCycle.max_iterations) {
      recommendations.push({
        type: 'process_optimization',
        priority: 'medium',
        message: 'Consider breaking down complex tasks into smaller, more focused units for better review efficiency'
      });
    }

    // Collaboration effectiveness
    const claudeSuccessRate = reviewCycle.iterations.filter(
      iter => iter.claude_adjustment?.success
    ).length / reviewCycle.iterations.filter(iter => iter.claude_adjustment).length;

    if (claudeSuccessRate < 0.8) {
      recommendations.push({
        type: 'collaboration_improvement',
        priority: 'medium',
        message: 'Claude adjustments could be more effective - consider providing more specific feedback context'
      });
    }

    // Focus area recommendations
    const focusAnalysis = this._analyzeFocusAreaPerformance(reviewCycle);
    for (const [area, performance] of Object.entries(focusAnalysis)) {
      if (performance.improvement < 10) {
        recommendations.push({
          type: 'focus_area_attention',
          priority: 'low',
          message: `${area} showed minimal improvement - consider dedicated attention in future cycles`
        });
      }
    }

    return recommendations;
  }

  /**
   * Analyze performance in each focus area
   */
  _analyzeFocusAreaPerformance(reviewCycle) {
    const analysis = {};

    for (const area of reviewCycle.focus_areas) {
      analysis[area] = {
        initial_score: this._extractAreaScore(reviewCycle.iterations[0]?.gemini_review, area) || 0,
        final_score: this._extractAreaScore(
          reviewCycle.iterations[reviewCycle.iterations.length - 1]?.gemini_review, area
        ) || 0,
        improvement: 0
      };

      analysis[area].improvement = analysis[area].final_score - analysis[area].initial_score;
    }

    return analysis;
  }

  /**
   * Extract score for specific focus area from review
   */
  _extractAreaScore(review, area) {
    if (!review?.focus_analysis) return null;
    return review.focus_analysis[area]?.score || null;
  }

  /**
   * Update overall review metrics
   */
  _updateReviewMetrics(reviewCycle) {
    const totalIterations = this.reviewMetrics.average_iterations * (this.reviewMetrics.total_cycles - 1);
    this.reviewMetrics.average_iterations = (totalIterations + reviewCycle.iterations.length) / this.reviewMetrics.total_cycles;

    const qualityImprovement = reviewCycle.final_quality_score - reviewCycle.initial_quality_score;
    const totalQualityImprovement = this.reviewMetrics.quality_improvement * (this.reviewMetrics.total_cycles - 1);
    this.reviewMetrics.quality_improvement = (totalQualityImprovement + qualityImprovement) / this.reviewMetrics.total_cycles;
  }

  /**
   * Get review cycle status
   */
  getReviewCycleStatus(cycleId) {
    const cycle = this.activeReviews.get(cycleId);
    if (!cycle) {
      return { found: false, error: 'Review cycle not found' };
    }

    return {
      found: true,
      cycle_id: cycleId,
      status: cycle.status,
      current_iteration: cycle.iterations.length,
      max_iterations: cycle.max_iterations,
      current_quality: cycle.iterations.length > 0 ?
        cycle.iterations[cycle.iterations.length - 1].gemini_review?.quality_score :
        cycle.initial_quality_score,
      quality_threshold: cycle.quality_threshold,
      started_at: cycle.started_at,
      duration_ms: Date.now() - cycle.started_at.getTime()
    };
  }

  /**
   * Get comprehensive review metrics
   */
  getReviewMetrics() {
    return {
      ...this.reviewMetrics,
      success_rate: this.reviewMetrics.total_cycles > 0 ?
        (this.reviewMetrics.successful_reviews / this.reviewMetrics.total_cycles) * 100 : 0,
      active_reviews: this.activeReviews.size,
      last_updated: new Date().toISOString()
    };
  }

  /**
   * Cancel an active review cycle
   */
  async cancelReviewCycle(cycleId, reason = 'Manual cancellation') {
    const cycle = this.activeReviews.get(cycleId);
    if (!cycle) {
      return { success: false, error: 'Review cycle not found' };
    }

    cycle.status = 'cancelled';
    cycle.cancelled_at = new Date();
    cycle.cancellation_reason = reason;

    logger.info(`🛑 Review cycle cancelled: ${cycleId} - ${reason}`);

    this.emit('cycle_cancelled', { cycle_id: cycleId, reason });

    return {
      success: true,
      cycle_id: cycleId,
      status: 'cancelled',
      iterations_completed: cycle.iterations.length,
      reason
    };
  }

  /**
   * Clean up completed review cycles (keep only last 10)
   */
  cleanupCompletedCycles() {
    const completedCycles = Array.from(this.activeReviews.entries())
      .filter(([_, cycle]) => ['approved', 'max_iterations_reached', 'cancelled', 'failed'].includes(cycle.status))
      .sort(([_, a], [__, b]) => b.completed_at - a.completed_at);

    if (completedCycles.length > 10) {
      const toRemove = completedCycles.slice(10);
      for (const [cycleId] of toRemove) {
        this.activeReviews.delete(cycleId);
      }

      logger.debug(`🧹 Cleaned up ${toRemove.length} completed review cycles`);
    }
  }

  /**
   * Shutdown and cleanup
   */
  async shutdown() {
    logger.info('🛑 Shutting down Review Cycle engine');

    // Cancel all active reviews
    const activeCycles = Array.from(this.activeReviews.entries())
      .filter(([_, cycle]) => cycle.status === 'in_progress');

    for (const [cycleId] of activeCycles) {
      await this.cancelReviewCycle(cycleId, 'System shutdown');
    }

    this.activeReviews.clear();
    this.removeAllListeners();

    logger.info('✅ Review Cycle engine shutdown complete');
  }
}

/**
 * Enhanced Gemini Agent Integration for Review Cycle
 */
export class EnhancedGeminiAgent {
  constructor(baseGeminiAgent) {
    this.baseAgent = baseGeminiAgent;
  }

  async reviewCode(projectId, taskId, code, requirements, reviewContext = {}) {
    logger.info(`🎨 Enhanced Gemini review for ${taskId} (iteration: ${reviewContext.iteration || 1})`);

    try {
      // Build enhanced review prompt
      const reviewPrompt = this._buildEnhancedReviewPrompt(
        code,
        requirements,
        reviewContext
      );

      // Execute review with base agent
      const result = await this.baseAgent.exploreProject(
        projectId,
        reviewPrompt,
        ['code_review', 'quality_assessment'],
        { mode: 'code_review', depth: 'detailed' }
      );

      // Parse and enhance the result
      return this._parseEnhancedReviewResult(result, reviewContext);

    } catch (error) {
      logger.error(`❌ Enhanced Gemini review failed: ${taskId}`, error);
      return this._getDefaultReviewResult(error);
    }
  }

  _buildEnhancedReviewPrompt(code, requirements, context) {
    const focusAreas = (context.focus_areas || ['code_quality']).join(', ');
    const previousContext = context.previous_iterations ?
      `\nPREVIOUS ITERATIONS CONTEXT:\n${JSON.stringify(context.previous_iterations, null, 2)}` : '';

    return `
As a creative code reviewer with rapid assessment capabilities, please review this code:

CODE TO REVIEW:
${code}

REQUIREMENTS:
${JSON.stringify(requirements, null, 2)}

FOCUS AREAS: ${focusAreas}
ITERATION: ${context.iteration || 1}
BASELINE REVIEW: ${context.baseline_review ? 'YES' : 'NO'}

${previousContext}

Please provide a rapid, creative assessment with:

1. QUALITY SCORE (0-100): Overall code quality assessment
2. APPROVED (true/false): Whether code meets standards
3. CONFIDENCE (0-100): Your confidence in this assessment
4. FEEDBACK: List of specific issues found
5. SUGGESTIONS: Concrete improvement recommendations
6. STRENGTHS: What's working well in the code
7. FOCUS_ANALYSIS: Score each focus area (0-100)

Emphasize creativity, speed, and practical suggestions for improvement.
`;
  }

  _parseEnhancedReviewResult(result, context) {
    const output = result.exploration || result.output || result;

    // Extract structured data from review output
    const qualityMatch = output.toString().match(/QUALITY SCORE.*?(\d+)/i);
    const approvedMatch = output.toString().match(/APPROVED.*?(true|false)/i);
    const confidenceMatch = output.toString().match(/CONFIDENCE.*?(\d+)/i);

    return {
      success: result.success !== false,
      quality_score: qualityMatch ? parseInt(qualityMatch[1]) : this._estimateQualityScore(output),
      approved: approvedMatch ? approvedMatch[1].toLowerCase() === 'true' : false,
      confidence: confidenceMatch ? parseInt(confidenceMatch[1]) : 80,
      feedback: this._extractFeedback(output),
      suggestions: this._extractSuggestions(output),
      strengths: this._extractStrengths(output),
      focus_analysis: this._extractFocusAnalysis(output, context.focus_areas || []),
      raw_review: output.toString().substring(0, 1000) // Keep first 1000 chars for reference
    };
  }

  _estimateQualityScore(output) {
    const text = output.toString().toLowerCase();

    // Simple heuristic quality scoring
    let score = 50;

    if (text.includes('excellent') || text.includes('great')) score += 20;
    if (text.includes('good') || text.includes('well')) score += 10;
    if (text.includes('issues') || text.includes('problems')) score -= 15;
    if (text.includes('critical') || text.includes('serious')) score -= 25;
    if (text.includes('minor') && text.includes('issues')) score -= 5;

    return Math.max(0, Math.min(100, score));
  }

  _extractFeedback(output) {
    const lines = output.toString().split('\n');
    const feedback = [];

    for (const line of lines) {
      if (line.match(/^\d+\.|^-\s|issue|problem|concern/i)) {
        feedback.push(line.trim());
      }
    }

    return feedback.slice(0, 8); // Limit to 8 feedback items
  }

  _extractSuggestions(output) {
    const lines = output.toString().split('\n');
    const suggestions = [];

    for (const line of lines) {
      if (line.match(/suggest|recommend|consider|should/i)) {
        suggestions.push(line.trim());
      }
    }

    return suggestions.slice(0, 5); // Limit to 5 suggestions
  }

  _extractStrengths(output) {
    const lines = output.toString().split('\n');
    const strengths = [];

    for (const line of lines) {
      if (line.match(/good|excellent|well|strength|positive/i)) {
        strengths.push(line.trim());
      }
    }

    return strengths.slice(0, 3); // Limit to 3 strengths
  }

  _extractFocusAnalysis(output, focusAreas) {
    const analysis = {};
    const text = output.toString().toLowerCase();

    for (const area of focusAreas) {
      const areaLower = area.toLowerCase().replace('_', ' ');

      // Simple scoring based on keywords
      let score = 70; // Default score

      if (text.includes(areaLower)) {
        if (text.includes(`${areaLower} good`) || text.includes(`${areaLower} excellent`)) {
          score = 85;
        } else if (text.includes(`${areaLower} issues`) || text.includes(`${areaLower} problems`)) {
          score = 45;
        }
      }

      analysis[area] = { score, analyzed: text.includes(areaLower) };
    }

    return analysis;
  }

  _getDefaultReviewResult(error) {
    return {
      success: false,
      quality_score: 60,
      approved: false,
      confidence: 30,
      feedback: [`Review failed: ${error.message}`],
      suggestions: ['Please retry the review with valid code'],
      strengths: [],
      focus_analysis: {},
      error: error.message
    };
  }
}

/**
 * Enhanced Claude Agent Integration for Review Cycle
 */
export class EnhancedClaudeAgent {
  constructor(baseClaudeAgent) {
    this.baseAgent = baseClaudeAgent;
  }

  async adjustCodeFromReview(projectId, taskId, code, feedback, adjustmentContext = {}) {
    logger.info(`🎯 Enhanced Claude adjustment for ${taskId}`);

    try {
      // Build enhanced adjustment prompt
      const adjustmentPrompt = this._buildEnhancedAdjustmentPrompt(
        code,
        feedback,
        adjustmentContext
      );

      // Execute adjustment with base agent
      const result = await this.baseAgent.execute(
        `${projectId}_${taskId}_adjustment`,
        'improve',
        [adjustmentPrompt],
        {
          mode: 'code_improvement',
          focus: 'review_feedback',
          context: adjustmentContext.iteration_context
        }
      );

      // Parse and enhance the result
      return this._parseEnhancedAdjustmentResult(result, adjustmentContext);

    } catch (error) {
      logger.error(`❌ Enhanced Claude adjustment failed: ${taskId}`, error);
      return this._getDefaultAdjustmentResult(error);
    }
  }

  _buildEnhancedAdjustmentPrompt(code, feedback, context) {
    const suggestions = context.suggestions || [];
    const focusAreas = context.focus_areas || ['code_quality'];
    const targetQuality = context.target_quality || 90;
    const iterationContext = context.iteration_context || {};

    return `
As a precision code improvement specialist, adjust this code based on detailed review feedback:

ORIGINAL CODE:
${code}

REVIEW FEEDBACK:
${Array.isArray(feedback) ? feedback.join('\n') : feedback}

SUGGESTIONS FOR IMPROVEMENT:
${suggestions.join('\n')}

CONTEXT:
- Focus Areas: ${focusAreas.join(', ')}
- Target Quality Score: ${targetQuality}/100
- Current Quality: ${iterationContext.current_quality || 'Unknown'}/100
- Iteration: ${iterationContext.iteration_number || 1}
- Previous Attempts: ${iterationContext.previous_attempts || 0}

INSTRUCTIONS:
1. Address each piece of feedback systematically
2. Apply suggested improvements where applicable
3. Focus especially on: ${focusAreas.join(', ')}
4. Ensure code quality reaches target level
5. Maintain code functionality while improving quality
6. Provide clear reasoning for changes made

Please provide:
- IMPROVED CODE: The enhanced version
- CHANGES MADE: List of specific improvements
- REASONING: Explanation of why each change was made
- CONFIDENCE: Your confidence in these improvements (0-100)

Deliver production-ready, well-documented code that addresses all feedback points.
`;
  }

  _parseEnhancedAdjustmentResult(result, context) {
    const output = result.output || '';

    // Extract improved code (everything after "IMPROVED CODE:")
    const improvedCodeMatch = output.match(/IMPROVED CODE:?\s*([\s\S]*?)(?:\n\n[A-Z]|\nCHANGES MADE|$)/i);
    const changesMatch = output.match(/CHANGES MADE:?\s*([\s\S]*?)(?:\n\n[A-Z]|\nREASONING|$)/i);
    const reasoningMatch = output.match(/REASONING:?\s*([\s\S]*?)(?:\n\n[A-Z]|\nCONFIDENCE|$)/i);
    const confidenceMatch = output.match(/CONFIDENCE.*?(\d+)/i);

    const changesList = changesMatch ?
      changesMatch[1].split('\n').filter(line => line.trim()).slice(0, 10) : [];

    return {
      success: result.success !== false,
      output: improvedCodeMatch ? improvedCodeMatch[1].trim() : output,
      changes_made: changesList,
      reasoning: reasoningMatch ? reasoningMatch[1].trim() : 'Code improvements applied',
      confidence: confidenceMatch ? parseInt(confidenceMatch[1]) : 85,
      duration_ms: result.duration_ms || 0,
      iteration_context: context.iteration_context || {}
    };
  }

  _getDefaultAdjustmentResult(error) {
    return {
      success: false,
      output: null,
      changes_made: [],
      reasoning: `Adjustment failed: ${error.message}`,
      confidence: 0,
      error: error.message
    };
  }
}
