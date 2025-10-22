import { spawn } from 'child_process';
import { EventEmitter } from 'events';
import { logger } from '../utils/logger.js';

/**
 * Gemini Explorer - Creative exploration and rapid code review agent
 * Specialized for initial project exploration and iterative code review cycles
 */
export class GeminiExplorer extends EventEmitter {
  constructor() {
    super();
    this.healthy = false;
    this.contexts = new Map();
    this.explorationHistory = new Map();
    this.reviewCycles = new Map();
  }

  async healthCheck() {
    try {
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
          if (code === 0 && output.includes('gemini')) {
            this.healthy = true;
            resolve({
              healthy: true,
              version: output.trim(),
              message: 'Gemini Explorer available',
              capabilities: ['project_exploration', 'creative_analysis', 'rapid_review', 'iteration']
            });
          } else {
            resolve({
              healthy: false,
              error: 'Gemini CLI not found or not working'
            });
          }
        });

        testProcess.on('error', (err) => {
          resolve({
            healthy: false,
            error: `Gemini CLI error: ${err.message}`
          });
        });

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
   * Explore project ideas and generate multiple approaches
   */
  async exploreProject(projectId, description, constraints = []) {
    logger.info(`🎨 Gemini exploring project: ${projectId}`);

    const explorationPrompt = this.buildExplorationPrompt(description, constraints);

    const result = await this.execute(
      `${projectId}_exploration`,
      'explore',
      [explorationPrompt],
      { mode: 'creative_exploration', depth: 'comprehensive' }
    );

    if (result.success) {
      const exploration = this.parseExplorationResult(result.output);
      this.explorationHistory.set(projectId, exploration);

      logger.info(`✅ Exploration completed: ${exploration.approaches?.length || 0} approaches found`);

      return {
        success: true,
        exploration,
        confidence: this.calculateExplorationConfidence(exploration)
      };
    }

    return { success: false, error: result.error };
  }

  /**
   * Review code and provide rapid feedback
   * Enhanced for revolutionary review cycle integration
   */
  async reviewCode(projectId, taskId, code, requirements = '', reviewContext = {}) {
    logger.info(`🔍 Gemini reviewing code for task ${taskId} (iteration: ${reviewContext.iteration || 1})`);

    const reviewPrompt = this.buildAdvancedReviewPrompt(code, requirements, reviewContext);

    const result = await this.execute(
      `${projectId}_review_${taskId}_${reviewContext.iteration || 1}`,
      'review',
      [reviewPrompt],
      {
        mode: 'creative_review',
        focus: 'quality_and_innovation',
        iteration: reviewContext.iteration,
        baseline: reviewContext.baseline_review
      }
    );

    if (result.success) {
      const review = this.parseAdvancedReviewResult(result.output, reviewContext);

      // Track enhanced review cycle
      const cycleKey = `${projectId}_${taskId}`;
      if (!this.reviewCycles.has(cycleKey)) {
        this.reviewCycles.set(cycleKey, []);
      }

      const cycleEntry = {
        iteration: reviewContext.iteration || (this.reviewCycles.get(cycleKey).length + 1),
        timestamp: new Date().toISOString(),
        review,
        context: reviewContext,
        code_reviewed: code.substring(0, 500) // Store snippet for reference
      };

      this.reviewCycles.get(cycleKey).push(cycleEntry);

      // Store detailed context for future iterations
      this.contexts.set(`${projectId}_${taskId}_review_${cycleEntry.iteration}`, {
        review_result: review,
        code_reviewed: code,
        requirements,
        review_context: reviewContext,
        timestamp: new Date().toISOString()
      });

      this.emit('advanced_review_completed', {
        projectId,
        taskId,
        review,
        iteration: cycleEntry.iteration,
        context: reviewContext
      });

      return review;
    }

    return {
      success: false,
      error: result.error,
      quality_score: 40,
      approved: false,
      confidence: 20,
      feedback: [`Review failed: ${result.error}`],
      suggestions: [],
      strengths: [],
      focus_analysis: {}
    };
  }

  /**
   * Rapid iteration on ideas or approaches
   */
  async iterateOnApproach(projectId, approach, refinementRequest) {
    logger.info(`🔄 Gemini iterating on approach for project ${projectId}`);

    const iterationPrompt = `
As a creative technology explorer, iterate on this approach based on the refinement request:

CURRENT APPROACH:
${JSON.stringify(approach, null, 2)}

REFINEMENT REQUEST:
${refinementRequest}

Please provide:
1. Refined approach with improvements
2. Alternative variations to explore
3. Pros/cons of the refined approach
4. Implementation considerations
5. Potential innovations or creative solutions

Focus on creative problem-solving and exploring unconventional solutions.
`;

    const result = await this.execute(
      `${projectId}_iteration`,
      'iterate',
      [iterationPrompt],
      { mode: 'creative_iteration' }
    );

    return result;
  }

  /**
   * Generate creative alternatives for technical decisions
   */
  async generateAlternatives(projectId, decision, context = {}) {
    logger.info(`💡 Generating alternatives for decision in project ${projectId}`);

    const alternativesPrompt = `
Generate creative alternative solutions for this technical decision:

DECISION: ${decision}
CONTEXT: ${JSON.stringify(context, null, 2)}

Please provide 3-5 creative alternatives that:
1. Solve the same problem differently
2. Consider unconventional approaches
3. Balance innovation with practicality
4. Include emerging technologies where relevant
5. Account for future scalability

For each alternative, provide:
- Brief description
- Key benefits
- Potential drawbacks
- Implementation complexity (1-10)
- Innovation score (1-10)
`;

    const result = await this.execute(
      `${projectId}_alternatives`,
      'alternatives',
      [alternativesPrompt],
      { mode: 'creative_alternatives' }
    );

    if (result.success) {
      return this.parseAlternatives(result.output);
    }

    return [];
  }

  /**
   * Rapid prototyping suggestions
   */
  async suggestPrototype(projectId, feature, constraints = []) {
    logger.info(`🚀 Suggesting prototype approach for feature in project ${projectId}`);

    const prototypePrompt = `
As a rapid prototyping expert, suggest a quick prototype approach:

FEATURE: ${feature}
CONSTRAINTS: ${constraints.join(', ')}

Please provide:
1. Minimum viable prototype (MVP) approach
2. Quick and dirty implementation strategy
3. Tools and technologies for rapid development
4. Key features to include/exclude for speed
5. Testing strategy for the prototype
6. Timeline estimate for prototype completion

Focus on speed and validation over perfection.
`;

    const result = await this.execute(
      `${projectId}_prototype`,
      'prototype',
      [prototypePrompt],
      { mode: 'rapid_prototyping' }
    );

    return result;
  }

  // Core execution method
  async execute(taskId, command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      logger.debug(`Gemini Explorer executing: ${taskId} - ${command}`);

      const enhancedArgs = this.enhanceArgsWithOptions(args, options);

      const geminiProcess = spawn('gemini', [command, ...enhancedArgs], {
        shell: true,
        env: {
          ...process.env,
          GEMINI_API_KEY: process.env.GEMINI_API_KEY,
          GEMINI_MODE: options.mode || 'standard'
        }
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
        const duration = Date.now() - startTime;

        if (code === 0) {
          resolve({
            success: true,
            output: stdout,
            duration_ms: duration,
            mode: options.mode
          });
        } else {
          resolve({
            success: false,
            output: stdout,
            error: stderr,
            duration_ms: duration
          });
        }
      });

      geminiProcess.on('error', (err) => {
        reject(err);
      });
    });
  }

  // Helper methods
  buildExplorationPrompt(description, constraints) {
    return `
As a creative technology explorer, analyze this project and provide multiple innovative approaches:

PROJECT DESCRIPTION:
${description}

CONSTRAINTS:
${constraints.join('\n- ')}

Please provide:
1. 4-5 distinct technical approaches (from traditional to cutting-edge)
2. For each approach:
   - Technology stack recommendations
   - Architecture overview
   - Key benefits and drawbacks
   - Implementation complexity (1-10)
   - Innovation level (1-10)
   - Timeline estimate
   - Risk assessment

3. Creative considerations:
   - Emerging technologies that could be leveraged
   - Unconventional solutions worth exploring
   - Future-proofing strategies
   - User experience innovations

4. Recommendations:
   - Which approach to prioritize and why
   - Hybrid approaches combining multiple strategies
   - Phased implementation strategies

Focus on creative problem-solving and exploring possibilities beyond conventional solutions.
`;
  }

  buildReviewPrompt(code, requirements, taskId) {
    return `
As a rapid code reviewer focused on quality and best practices, review this code:

TASK ID: ${taskId}
REQUIREMENTS: ${requirements}

CODE TO REVIEW:
${code}

Please provide:
1. APPROVAL STATUS: APPROVED/NEEDS_WORK/REJECTED
2. OVERALL QUALITY SCORE: (1-10)
3. SPECIFIC FEEDBACK:
   - Code structure and organization
   - Best practices adherence
   - Potential bugs or issues
   - Performance considerations
   - Security concerns
   - Readability and maintainability

4. IMPROVEMENT SUGGESTIONS:
   - Specific changes needed (if any)
   - Alternative approaches to consider
   - Code quality enhancements

5. POSITIVE ASPECTS:
   - What's working well
   - Good practices observed

Be thorough but concise. Focus on actionable feedback.
`;
  }

  /**
   * Build advanced review prompt with context awareness for revolutionary workflow
   */
  buildAdvancedReviewPrompt(code, requirements, context) {
    const focusAreas = context.focus_areas || ['code_quality', 'best_practices', 'performance', 'maintainability'];
    const isBaseline = context.baseline_review || false;
    const iteration = context.iteration || 1;
    const previousIterations = context.previous_iterations || [];

    const previousContext = previousIterations.length > 0 ?
      `\nPREVIOUS ITERATIONS INSIGHTS:\n${previousIterations.map(iter =>
        `Iteration ${iter.iteration}: Quality ${iter.quality_score}/100, Issues: ${iter.main_issues?.join(', ') || 'None'}`
      ).join('\n')}` : '';

    return `
As Gemini, a creative and rapid code reviewer with AI innovation expertise, please assess this code:

CODE TO REVIEW:
\`\`\`
${code}
\`\`\`

REQUIREMENTS & CONTEXT:
${typeof requirements === 'string' ? requirements : JSON.stringify(requirements, null, 2)}

REVIEW PARAMETERS:
- Focus Areas: ${focusAreas.join(', ')}
- Review Type: ${isBaseline ? 'BASELINE ASSESSMENT' : `ITERATION ${iteration} IMPROVEMENT CHECK`}
- Quality Threshold: ${context.quality_threshold || 90}/100
- Assessment Mode: Creative + Rapid

${previousContext}

Please provide a comprehensive creative review with:

## QUALITY ASSESSMENT
- **QUALITY_SCORE**: Overall code quality (0-100)
- **APPROVED**: true/false (meets ${context.quality_threshold || 90}+ quality threshold)
- **CONFIDENCE**: Your confidence in this assessment (0-100)

## DETAILED ANALYSIS
- **FEEDBACK**: Specific issues found (be precise and actionable)
- **SUGGESTIONS**: Creative improvement recommendations
- **STRENGTHS**: What's working exceptionally well
- **INNOVATION_OPPORTUNITIES**: Creative enhancement possibilities

## FOCUS AREA SCORING
${focusAreas.map(area => `- **${area.toUpperCase()}_SCORE**: 0-100 assessment`).join('\n')}

## CREATIVE INSIGHTS
- **USER_EXPERIENCE_IMPACT**: How changes affect end users
- **SCALABILITY_ASSESSMENT**: Future-proofing considerations
- **INNOVATION_RATING**: Creative/modern approach score (0-100)

Be creative, rapid, and provide actionable insights that push code quality to the next level.
Focus especially on ${focusAreas[0]} and user-centric improvements.

${isBaseline ? 'This is a baseline review - establish quality foundation.' :
    `This is iteration ${iteration} - focus on improvements from previous feedback.`}
`;
  }

  /**
   * Parse advanced review result with enhanced extraction for revolutionary workflow
   */
  parseAdvancedReviewResult(output, context) {
    const text = output.toString();

    // Extract structured scores and assessments
    const qualityScore = this._extractScore(text, 'QUALITY_SCORE') || this._estimateQualityFromText(text);
    const approved = this._extractBoolean(text, 'APPROVED') || qualityScore >= (context.quality_threshold || 90);
    const confidence = this._extractScore(text, 'CONFIDENCE') || this._estimateConfidence(text);

    // Extract detailed feedback
    const feedback = this._extractListItems(text, 'FEEDBACK') || this._extractGeneralIssues(text);
    const suggestions = this._extractListItems(text, 'SUGGESTIONS') || this._extractSuggestions(text);
    const strengths = this._extractListItems(text, 'STRENGTHS') || this._extractPositives(text);

    // Extract focus area scores
    const focusAreas = context.focus_areas || ['code_quality'];
    const focusAnalysis = {};
    for (const area of focusAreas) {
      const areaScore = this._extractScore(text, `${area.toUpperCase()}_SCORE`) ||
                      this._estimateAreaScore(text, area);
      focusAnalysis[area] = {
        score: areaScore,
        analyzed: text.toLowerCase().includes(area.toLowerCase())
      };
    }

    // Extract creative insights
    const innovationRating = this._extractScore(text, 'INNOVATION_RATING') || 70;
    const userExperienceImpact = this._extractSection(text, 'USER_EXPERIENCE_IMPACT') || '';
    const scalabilityAssessment = this._extractSection(text, 'SCALABILITY_ASSESSMENT') || '';

    return {
      success: true,
      quality_score: qualityScore,
      approved,
      confidence,
      feedback,
      suggestions,
      strengths,
      focus_analysis: focusAnalysis,
      creative_insights: {
        innovation_rating: innovationRating,
        user_experience_impact: userExperienceImpact,
        scalability_assessment: scalabilityAssessment,
        enhancement_opportunities: this._extractListItems(text, 'INNOVATION_OPPORTUNITIES') || []
      },
      review_metadata: {
        iteration: context.iteration || 1,
        baseline_review: context.baseline_review || false,
        focus_areas: focusAreas,
        review_timestamp: new Date().toISOString(),
        word_count: text.split(/\s+/).length
      }
    };
  }

  parseExplorationResult(output) {
    const exploration = {
      approaches: this.extractApproaches(output),
      recommendations: this.extractRecommendations(output),
      creative_insights: this.extractCreativeInsights(output),
      risk_assessment: this.extractRiskAssessment(output),
      innovation_opportunities: this.extractInnovationOpportunities(output)
    };

    return exploration;
  }

  extractApproaches(text) {
    const approaches = [];
    const sections = text.split(/(?=\d+\.\s)|(?=Approach \d+)/i);

    for (const section of sections) {
      if (section.trim() && section.match(/^\d+\.|approach/i)) {
        const approach = {
          name: this.extractApproachName(section),
          description: this.extractApproachDescription(section),
          technology_stack: this.extractTechnologyStack(section),
          complexity: this.extractComplexity(section),
          innovation_level: this.extractInnovationLevel(section),
          timeline: this.extractTimeline(section),
          pros: this.extractPros(section),
          cons: this.extractCons(section)
        };
        approaches.push(approach);
      }
    }

    return approaches.length > 0 ? approaches : this.getDefaultApproaches();
  }

  extractApproachName(section) {
    const nameMatch = section.match(/^\d+\.\s*(.+?)(?:\n|:)/);
    return nameMatch ? nameMatch[1].trim() : 'Unnamed Approach';
  }

  extractApproachDescription(section) {
    const lines = section.split('\n');
    return lines.slice(1, 4).join(' ').trim();
  }

  extractTechnologyStack(section) {
    const techMatches = section.match(/(?:technology|stack|tools?):\s*(.+?)(?:\n|$)/i);
    return techMatches ? techMatches[1].split(/[,;]/).map(t => t.trim()) : [];
  }

  extractComplexity(section) {
    const complexityMatch = section.match(/complexity[:\s]*(\d+)/i);
    return complexityMatch ? parseInt(complexityMatch[1]) : 5;
  }

  extractInnovationLevel(section) {
    const innovationMatch = section.match(/innovation[:\s]*(\d+)/i);
    return innovationMatch ? parseInt(innovationMatch[1]) : 5;
  }

  extractTimeline(section) {
    const timelineMatch = section.match(/timeline[:\s]*(.+?)(?:\n|$)/i);
    return timelineMatch ? timelineMatch[1].trim() : '4-6 weeks';
  }

  extractPros(section) {
    const prosSection = section.match(/(?:benefits?|pros?):\s*([\s\S]*?)(?:drawbacks?|cons?|$)/i);
    return prosSection ? prosSection[1].split(/[•\-\n]/).filter(p => p.trim()).map(p => p.trim()) : [];
  }

  extractCons(section) {
    const consSection = section.match(/(?:drawbacks?|cons?):\s*([\s\S]*?)(?:\n\n|$)/i);
    return consSection ? consSection[1].split(/[•\-\n]/).filter(c => c.trim()).map(c => c.trim()) : [];
  }

  getDefaultApproaches() {
    return [
      {
        name: 'Modern Full-Stack Approach',
        description: 'Contemporary web development using modern frameworks',
        technology_stack: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
        complexity: 6,
        innovation_level: 5,
        timeline: '4-6 weeks',
        pros: ['Battle-tested technologies', 'Good community support', 'Scalable'],
        cons: ['Conventional approach', 'Higher initial setup complexity']
      },
      {
        name: 'JAMstack with Microservices',
        description: 'Static site generation with serverless backend services',
        technology_stack: ['Next.js', 'Serverless Functions', 'Headless CMS'],
        complexity: 7,
        innovation_level: 8,
        timeline: '3-5 weeks',
        pros: ['High performance', 'Great developer experience', 'Cost-effective'],
        cons: ['Learning curve', 'Vendor lock-in potential']
      }
    ];
  }

  extractRecommendations(text) {
    const recommendationSection = text.match(/recommendations?:\s*([\s\S]*?)(?:\n\n|$)/i);
    return recommendationSection ?
      recommendationSection[1].split(/[•\-\n]/).filter(r => r.trim()).map(r => r.trim()) :
      ['Consider hybrid approach', 'Start with MVP', 'Plan for scalability'];
  }

  extractCreativeInsights(text) {
    const creativeSection = text.match(/creative[:\s]*([\s\S]*?)(?:recommendations?|$)/i);
    return creativeSection ? creativeSection[1].trim() : 'Explore emerging technologies for competitive advantage';
  }

  extractRiskAssessment(text) {
    const riskSection = text.match(/risk[:\s]*([\s\S]*?)(?:\n\n|$)/i);
    return riskSection ? riskSection[1].trim() : 'Standard development risks apply';
  }

  extractInnovationOpportunities(text) {
    const innovationSection = text.match(/innovation[:\s]*([\s\S]*?)(?:\n\n|$)/i);
    return innovationSection ? innovationSection[1].trim() : 'Consider AI integration and automation opportunities';
  }

  calculateExplorationConfidence(exploration) {
    let confidence = 60;

    if (exploration.approaches?.length >= 3) confidence += 20;
    if (exploration.recommendations?.length > 0) confidence += 10;
    if (exploration.creative_insights) confidence += 5;
    if (exploration.innovation_opportunities) confidence += 5;

    return Math.min(confidence, 95);
  }

  parseReviewResult(output) {
    const review = {
      approved: this.extractApprovalStatus(output),
      quality_score: this.extractQualityScore(output),
      feedback: this.extractFeedback(output),
      suggestions: this.extractSuggestions(output),
      positive_aspects: this.extractPositiveAspects(output),
      needs_work: this.extractNeedsWork(output)
    };

    return review;
  }

  extractApprovalStatus(text) {
    const approvalMatch = text.match(/(?:approval status|status):\s*(approved|needs_work|rejected)/i);
    if (approvalMatch) {
      return approvalMatch[1].toLowerCase() === 'approved';
    }

    // Fallback to keyword analysis
    const approvalKeywords = ['approved', 'good', 'excellent', 'ready', 'looks good', 'lgtm'];
    const rejectionKeywords = ['issues', 'problems', 'fix', 'error', 'incorrect', 'needs work'];

    const textLower = text.toLowerCase();
    const approvalScore = approvalKeywords.reduce((score, keyword) =>
      score + (textLower.includes(keyword) ? 1 : 0), 0);
    const rejectionScore = rejectionKeywords.reduce((score, keyword) =>
      score + (textLower.includes(keyword) ? 1 : 0), 0);

    return approvalScore > rejectionScore;
  }

  extractQualityScore(text) {
    const scoreMatch = text.match(/(?:quality score|score):\s*(\d+)/i);
    return scoreMatch ? parseInt(scoreMatch[1]) : 7;
  }

  extractFeedback(text) {
    const feedbackSection = text.match(/specific feedback:\s*([\s\S]*?)(?:improvement suggestions|positive aspects|$)/i);
    return feedbackSection ?
      feedbackSection[1].split(/[•\-\n]/).filter(f => f.trim()).map(f => f.trim()) :
      ['Code structure looks good', 'Consider adding more comments'];
  }

  extractSuggestions(text) {
    const suggestionsSection = text.match(/improvement suggestions:\s*([\s\S]*?)(?:positive aspects|$)/i);
    return suggestionsSection ?
      suggestionsSection[1].split(/[•\-\n]/).filter(s => s.trim()).map(s => s.trim()) :
      [];
  }

  extractPositiveAspects(text) {
    const positiveSection = text.match(/positive aspects:\s*([\s\S]*?)$/i);
    return positiveSection ?
      positiveSection[1].split(/[•\-\n]/).filter(p => p.trim()).map(p => p.trim()) :
      ['Clean code structure'];
  }

  extractNeedsWork(text) {
    const needsWorkSection = text.match(/needs work|issues|problems:\s*([\s\S]*?)(?:\n\n|$)/i);
    return needsWorkSection ?
      needsWorkSection[1].split(/[•\-\n]/).filter(n => n.trim()).map(n => n.trim()) :
      [];
  }

  parseAlternatives(text) {
    const alternatives = [];
    const sections = text.split(/(?=\d+\.\s)|(?=Alternative \d+)/i);

    for (const section of sections) {
      if (section.trim() && section.match(/^\d+\.|alternative/i)) {
        alternatives.push({
          name: this.extractAlternativeName(section),
          description: this.extractAlternativeDescription(section),
          benefits: this.extractAlternativeBenefits(section),
          drawbacks: this.extractAlternativeDrawbacks(section),
          complexity: this.extractAlternativeComplexity(section),
          innovation_score: this.extractAlternativeInnovation(section)
        });
      }
    }

    return alternatives;
  }

  extractAlternativeName(section) {
    const nameMatch = section.match(/^\d+\.\s*(.+?)(?:\n|:)/);
    return nameMatch ? nameMatch[1].trim() : 'Alternative Approach';
  }

  extractAlternativeDescription(section) {
    const lines = section.split('\n');
    return lines.slice(1, 3).join(' ').trim();
  }

  extractAlternativeBenefits(section) {
    const benefitsSection = section.match(/benefits:\s*([\s\S]*?)(?:drawbacks|$)/i);
    return benefitsSection ? benefitsSection[1].split(/[•\-\n]/).filter(b => b.trim()).map(b => b.trim()) : [];
  }

  extractAlternativeDrawbacks(section) {
    const drawbacksSection = section.match(/drawbacks:\s*([\s\S]*?)(?:complexity|$)/i);
    return drawbacksSection ? drawbacksSection[1].split(/[•\-\n]/).filter(d => d.trim()).map(d => d.trim()) : [];
  }

  extractAlternativeComplexity(section) {
    const complexityMatch = section.match(/complexity[:\s]*(\d+)/i);
    return complexityMatch ? parseInt(complexityMatch[1]) : 5;
  }

  extractAlternativeInnovation(section) {
    const innovationMatch = section.match(/innovation[:\s]*(\d+)/i);
    return innovationMatch ? parseInt(innovationMatch[1]) : 5;
  }

  enhanceArgsWithOptions(args, options) {
    const enhanced = [...args];

    if (options.mode) {
      enhanced.push('--mode', options.mode);
    }

    if (options.depth) {
      enhanced.push('--depth', options.depth);
    }

    if (options.focus) {
      enhanced.push('--focus', options.focus);
    }

    return enhanced;
  }

  async exportContext(taskId) {
    const context = this.contexts.get(taskId) || {};

    return {
      agent: 'gemini_explorer',
      task_id: taskId,
      exploration_history: this.explorationHistory.size,
      review_cycles: this.reviewCycles.size,
      context_data: context,
      timestamp: new Date().toISOString()
    };
  }

  async importContext(taskId, context) {
    this.contexts.set(taskId, {
      ...context,
      imported_from: context.previous_agent,
      imported_at: new Date().toISOString()
    });

    logger.debug(`Gemini Explorer imported context for task ${taskId}`);
    return { success: true };
  }

  async syncContext(contextType, data) {
    logger.debug(`Gemini Explorer syncing ${contextType} context`);
    this.contexts.set(`sync_${contextType}`, data);
    return { success: true };
  }

  getExplorationHistory(projectId) {
    return this.explorationHistory.get(projectId);
  }

  getReviewCycles(projectId, taskId) {
    return this.reviewCycles.get(`${projectId}_${taskId}`) || [];
  }

  async close() {
    this.contexts.clear();
    this.explorationHistory.clear();
    this.reviewCycles.clear();
    logger.debug('Gemini Explorer closed');
  }
}
