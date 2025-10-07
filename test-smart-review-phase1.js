/**
 * TEST SMART REVIEW WORKFLOW PHASE 1
 * Vérifie le nouveau système de context preparation + intelligent review
 */

import { smartReviewWithContext } from './src/services/review-service.js';
import { contextService } from './src/services/context-service.js';
import { logger } from './src/utils/logger.js';
import fs from 'fs/promises';

async function testSmartReviewPhase1() {
  logger.info('🧠 Testing Smart Review Workflow Phase 1...');
  
  // Mock capabilities avec Gemini disponible
  const mockCapabilities = {
    agents: { gemini: true, claude: true, archon: true }
  };
  
  // Task de test avec contexte architectural
  const testTask = {
    title: 'User Authentication Service Review',
    requirements: 'Secure JWT-based authentication with password hashing and rate limiting',
    architecture: 'Next.js App Router + Supabase + Middleware'
  };
  
  // Create test file temporairement 
  const testFilePath = './test-auth-service.js';
  const testCode = `
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import rateLimit from 'express-rate-limit';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Rate limiting middleware
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts'
});

export async function authenticateUser(email, password) {
  try {
    if (!email || !password) {
      throw new Error('Missing credentials');
    }
    
    // Find user in Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();
      
    if (error || !user) {
      throw new Error('Invalid credentials');
    }
    
    // Verify password with bcrypt
    const passwordMatch = await bcrypt.compare(password, user.hashed_password);
    if (!passwordMatch) {
      throw new Error('Invalid credentials');
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
    
  } catch (error) {
    logger.error(\`Authentication error: \${error.message}\`);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function registerUser(email, password, name) {
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user in Supabase
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        email: email.toLowerCase(),
        hashed_password: hashedPassword,
        name
      })
      .select()
      .single();
      
    if (error) {
      throw new Error('Registration failed: ' + error.message);
    }
    
    return { success: true, userId: user.id };
    
  } catch (error) {
    logger.error(\`Registration error: \${error.message}\`);
    return {
      success: false,
      error: error.message
    };
  }
}
  `;
  
  try {
    // 1. Create test file
    await fs.writeFile(testFilePath, testCode);
    logger.info(`📄 Created test file: ${testFilePath}`);
    
    // 2. Test Context Preparation Service
    logger.info(`🔍 Testing Context Preparation...`);
    const contextStartTime = Date.now();
    const contextResult = await contextService.prepareReviewContext(testFilePath, testTask);
    const contextDuration = Date.now() - contextStartTime;
    
    if (!contextResult.ok) {
      logger.error(`❌ Context preparation failed: ${contextResult.error}`);
      return { success: false, reason: 'context_preparation_failed' };
    }
    
    logger.info(`✅ Context prepared in ${contextDuration}ms`);
    logger.info(`   Complexity Score: ${contextResult.complexity_score}/10`);
    logger.info(`   Insights: ${contextResult.insights.length} detected`);
    logger.info(`   Context insights: ${contextResult.insights.join(', ')}`);
    
    // 3. Test Smart Review with Context
    logger.info(`🧠 Testing Smart Review Phase 1...`);
    const reviewStartTime = Date.now();
    const reviewResult = await smartReviewWithContext(mockCapabilities, testFilePath, testTask);
    const totalDuration = Date.now() - reviewStartTime;
    
    // 4. Analyze Results
    logger.info(`📊 Smart Review Phase 1 Results:`);
    logger.info(`   Success: ${reviewResult.ok}`);
    logger.info(`   Phase: ${reviewResult.phase || 'unknown'}`);
    logger.info(`   Used: ${reviewResult.used}`);
    logger.info(`   Total Duration: ${totalDuration}ms`);
    
    if (reviewResult.ok) {
      logger.info(`   Context Duration: ${reviewResult.context_duration_ms}ms`);
      logger.info(`   Review Duration: ${reviewResult.duration_ms - reviewResult.context_duration_ms}ms`);
      logger.info(`   Response Length: ${reviewResult.text.length} chars`);
      logger.info(`   Insights Count: ${reviewResult.insights?.length || 0}`);
      
      // Check if it's really using Smart Review Phase 1
      const isSmartReview = reviewResult.phase === "smart_review_phase_1" && 
                           reviewResult.context_duration_ms && 
                           reviewResult.insights;
      
      if (isSmartReview) {
        logger.info(`✅ SUCCESS: Smart Review Phase 1 confirmed!`);
        logger.info(`   Context preparation: ${reviewResult.context_duration_ms}ms`);
        logger.info(`   Complexity detected: ${reviewResult.complexity_score}/10`);
        
        // Show preview of intelligent response
        const preview = reviewResult.text.slice(0, 300);
        logger.info(`   Response preview: "${preview}..."`);
        
        return {
          success: true,
          phase: "smart_review_phase_1",
          total_duration: totalDuration,
          context_duration: reviewResult.context_duration_ms,
          complexity_score: reviewResult.complexity_score,
          insights_count: reviewResult.insights?.length || 0
        };
        
      } else {
        logger.warn(`⚠️ Warning: Not using Smart Review Phase 1 (mode: ${reviewResult.used})`);
        return {
          success: false,
          reason: 'not_smart_review_phase1',
          mode: reviewResult.used,
          phase: reviewResult.phase
        };
      }
      
    } else {
      logger.error(`❌ Smart Review failed: ${reviewResult.error}`);
      return {
        success: false,
        reason: 'review_failed',
        error: reviewResult.error,
        code: reviewResult.code
      };
    }
    
  } catch (error) {
    logger.error(`💥 Test error: ${error.message}`);
    return {
      success: false,
      reason: 'test_error',
      error: error.message
    };
  } finally {
    // Cleanup test file
    try {
      await fs.unlink(testFilePath);
      logger.info(`🧹 Cleaned up test file: ${testFilePath}`);
    } catch (cleanupError) {
      logger.warn(`⚠️ Cleanup warning: ${cleanupError.message}`);
    }
  }
}

// Execute test with detailed reporting
testSmartReviewPhase1()
  .then(result => {
    logger.info(`\n${'='.repeat(50)}`);
    
    if (result.success) {
      logger.info(`🎉 SMART REVIEW PHASE 1 TEST PASSED!`);
      logger.info(`   Phase: ${result.phase}`);
      logger.info(`   Total Duration: ${result.total_duration}ms`);
      logger.info(`   Context Duration: ${result.context_duration}ms`);
      logger.info(`   Review Duration: ${result.total_duration - result.context_duration}ms`);
      logger.info(`   Complexity Score: ${result.complexity_score}/10`);
      logger.info(`   Insights Detected: ${result.insights_count}`);
      
      // Performance Analysis
      const performanceGain = result.context_duration < 2000 ? 'EXCELLENT' : 
                             result.context_duration < 3000 ? 'GOOD' : 'NEEDS_OPTIMIZATION';
      logger.info(`   Performance: ${performanceGain} (target: <2000ms)`);
      
    } else {
      logger.error(`😞 Smart Review Phase 1 test failed: ${result.reason}`);
      if (result.error) logger.error(`   Error: ${result.error}`);
      if (result.mode) logger.error(`   Mode: ${result.mode}`);
      if (result.phase) logger.error(`   Phase: ${result.phase}`);
    }
    
    logger.info(`${'='.repeat(50)}\n`);
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    logger.error('Test suite crashed:', error);
    process.exit(1);
  });