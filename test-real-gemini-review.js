/**
 * TEST REVIEW SERVICE AVEC VRAI GEMINI
 * Vérifie que les reviews utilisent le vrai agent, pas les fallbacks
 */

import { reviewWithGemini, buildReviewPrompt } from './src/services/review-service.js';
import { logger } from './src/utils/logger.js';

async function testRealGeminiReview() {
  logger.info('🧪 Testing Real Gemini Review Service...');
  
  // Mock capabilities avec Gemini disponible
  const mockCapabilities = {
    agents: { gemini: true, claude: true, archon: true }
  };
  
  // Mock task et code pour review
  const mockTask = {
    title: 'User Authentication Service',
    requirements: 'Secure login with JWT tokens'
  };
  
  const mockCode = `
function authenticateUser(email, password) {
  if (!email || !password) {
    throw new Error('Missing credentials');
  }
  
  const user = database.findUserByEmail(email);
  if (!user || !verifyPassword(password, user.hashedPassword)) {
    throw new Error('Invalid credentials');
  }
  
  const token = generateJWT(user.id);
  return { token, user: { id: user.id, email: user.email } };
}
  `;
  
  try {
    // Build review prompt
    const reviewPrompt = buildReviewPrompt(mockTask, mockCode, mockTask.requirements);
    logger.info(`📝 Built review prompt (${reviewPrompt.length} chars)`);
    
    // Execute real Gemini review
    const reviewResult = await reviewWithGemini(mockCapabilities, reviewPrompt);
    
    // Analyze results
    logger.info(`📊 Review Results:`);
    logger.info(`   Success: ${reviewResult.ok}`);
    logger.info(`   Used: ${reviewResult.used}`);
    logger.info(`   Duration: ${reviewResult.duration_ms}ms`);
    
    if (reviewResult.ok) {
      logger.info(`   Text length: ${reviewResult.text.length} chars`);
      logger.info(`   Text preview: ${reviewResult.text.slice(0, 200)}...`);
      
      // Check if it's really using Gemini (not fallback)
      const usedRealGemini = reviewResult.used === 'bridge' || reviewResult.used === 'cli-prompt';
      
      if (usedRealGemini) {
        logger.info(`✅ SUCCESS: Real Gemini conversation confirmed via ${reviewResult.used}`);
        return { success: true, mode: reviewResult.used, duration: reviewResult.duration_ms };
      } else {
        logger.warn(`⚠️ Warning: Used ${reviewResult.used}, not real Gemini`);
        return { success: false, reason: 'not_real_gemini', mode: reviewResult.used };
      }
    } else {
      logger.error(`❌ Review failed: ${reviewResult.error}`);
      return { success: false, reason: 'review_failed', error: reviewResult.error };
    }
    
  } catch (error) {
    logger.error(`💥 Test error: ${error.message}`);
    return { success: false, reason: 'test_error', error: error.message };
  }
}

// Execute test
testRealGeminiReview()
  .then(result => {
    if (result.success) {
      logger.info(`🎉 REAL GEMINI REVIEW TEST PASSED!`);
      logger.info(`   Mode: ${result.mode}`);
      logger.info(`   Duration: ${result.duration}ms`);
    } else {
      logger.error(`😞 Real Gemini Review test failed: ${result.reason}`);
      if (result.error) logger.error(`   Error: ${result.error}`);
    }
    
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    logger.error('Test suite crashed:', error);
    process.exit(1);
  });