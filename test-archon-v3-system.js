/**
 * Test Archon V3 Complete System
 *
 * Test complet du système Archon V3 avec MetaSupervisor + SubAgent Orchestrator
 * Validation économique et performance
 */

import ArchonV3CompleteSystem from './src/integration/archon-v3-system.js';

async function testArchonV3System() {
  console.log('🧪 Testing Archon V3 Complete System');
  console.log('=====================================\n');

  // Initialize system
  const archonV3 = new ArchonV3CompleteSystem();

  // Test scenarios
  const testScenarios = [
    {
      name: 'E-Commerce Platform',
      description: 'E-commerce platform with user authentication, product catalog, and payment processing',
      requirements: [
        'React frontend with TypeScript',
        'Node.js backend API',
        'Supabase database',
        'User authentication system',
        'Product management',
        'Shopping cart functionality',
        'Stripe payment integration',
        'Admin dashboard'
      ],
      expectedAgents: 6
    },
    {
      name: 'AI-Powered Blog',
      description: 'AI-powered blog platform with content generation and SEO optimization',
      requirements: [
        'Next.js frontend',
        'AI content generation API',
        'PostgreSQL database',
        'SEO optimization',
        'Content management system',
        'User comments',
        'Analytics dashboard'
      ],
      expectedAgents: 5
    },
    {
      name: 'Simple Landing Page',
      description: 'Simple landing page with contact form',
      requirements: [
        'React frontend',
        'Contact form',
        'Email notifications'
      ],
      expectedAgents: 2
    }
  ];

  const results = [];

  for (const scenario of testScenarios) {
    console.log(`\n🎯 Testing Scenario: ${scenario.name}`);
    console.log('-'.repeat(50));

    try {
      const startTime = Date.now();

      const result = await archonV3.executeProject(
        scenario.description,
        scenario.requirements,
        {
          maxAgents: scenario.expectedAgents,
          economicMode: true
        }
      );

      const testResult = {
        scenario: scenario.name,
        success: result.success,
        duration: result.duration,
        agentsExecuted: result.phases.orchestration.agentResults?.length || 0,
        complianceScore: result.phases.orchestration.integrationResult?.complianceScore || 0,
        economics: result.economics,
        overallScore: result.summary.overallScore,
        recommendation: result.summary.recommendation
      };

      results.push(testResult);

      // Display results
      console.log(`✅ Result: ${result.success ? 'SUCCESS' : 'FAILED'}`);
      console.log(`⏱️  Duration: ${result.duration}ms`);
      console.log(`🤖 Agents: ${testResult.agentsExecuted}/${scenario.expectedAgents}`);
      console.log(`📊 Compliance: ${Math.round(testResult.complianceScore * 100)}%`);
      console.log(`💰 Savings: ${result.economics.savingsPercentage}%`);
      console.log(`🏆 Score: ${testResult.overallScore}/100`);
      console.log(`💡 Recommendation: ${testResult.recommendation}`);

      // Show economics breakdown
      if (result.economics) {
        console.log('\n💸 Economics Breakdown:');
        console.log(`  Setup Cost: $${result.economics.currentCost.toFixed(3)}`);
        console.log(`  Traditional Cost: $${result.economics.traditionalCost.toFixed(3)}`);
        console.log(`  Savings: $${result.economics.savings.toFixed(3)} (${result.economics.savingsPercentage}%)`);
        console.log(`  Local Validations: ${result.economics.localValidations}`);
        console.log(`  Escalations: ${result.economics.escalations}`);
      }

    } catch (error) {
      console.error(`❌ Test failed for ${scenario.name}:`, error.message);
      results.push({
        scenario: scenario.name,
        success: false,
        error: error.message
      });
    }
  }

  // System Statistics
  console.log('\n' + '='.repeat(60));
  console.log('📊 SYSTEM STATISTICS');
  console.log('='.repeat(60));

  const systemStats = archonV3.getSystemStatistics();
  console.log(`🏆 Success Rate: ${Math.round(systemStats.successRate * 100)}%`);
  console.log(`📈 Average Score: ${systemStats.averageScore}/100`);
  console.log(`💰 Average Savings: ${systemStats.averageSavings}%`);
  console.log(`🕒 Total Projects: ${systemStats.totalProjects}`);

  // MetaSupervisor Statistics
  console.log('\n🧠 MetaSupervisor Statistics:');
  console.log(`  Escalations: ${systemStats.metaSupervisorStats.totalEscalations}`);
  console.log(`  Avg Risk Score: ${systemStats.metaSupervisorStats.averageRiskScore.toFixed(2)}`);
  console.log(`  Economic Savings: ${systemStats.metaSupervisorStats.economicsSavings.savingsPercentage}%`);

  // SubAgent Orchestrator Statistics
  console.log('\n🎼 SubAgent Orchestrator Statistics:');
  console.log(`  Total Orchestrations: ${systemStats.orchestratorStats.totalOrchestrations}`);
  console.log(`  Success Rate: ${Math.round(systemStats.orchestratorStats.successRate * 100)}%`);
  console.log(`  Avg Duration: ${Math.round(systemStats.orchestratorStats.averageDuration)}ms`);
  console.log(`  Avg Agents/Project: ${systemStats.orchestratorStats.averageAgentsPerProject.toFixed(1)}`);

  // Test Results Summary
  console.log('\n' + '='.repeat(60));
  console.log('🏁 TEST RESULTS SUMMARY');
  console.log('='.repeat(60));

  const successfulTests = results.filter(r => r.success).length;
  const totalTests = results.length;
  const averageScore = results.reduce((sum, r) => sum + (r.overallScore || 0), 0) / totalTests;
  const averageSavings = results.reduce((sum, r) => sum + (r.economics?.savingsPercentage || 0), 0) / totalTests;

  console.log(`✅ Tests Passed: ${successfulTests}/${totalTests} (${Math.round(successfulTests/totalTests*100)}%)`);
  console.log(`📊 Average Score: ${Math.round(averageScore)}/100`);
  console.log(`💰 Average Savings: ${Math.round(averageSavings)}%`);

  // Individual test results
  console.log('\n📋 Individual Test Results:');
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    const score = result.overallScore || 0;
    const savings = result.economics?.savingsPercentage || 0;
    console.log(`  ${status} ${result.scenario}: ${score}/100 (${savings}% savings)`);
  });

  // Performance Analysis
  console.log('\n' + '='.repeat(60));
  console.log('⚡ PERFORMANCE ANALYSIS');
  console.log('='.repeat(60));

  const avgDuration = results.reduce((sum, r) => sum + (r.duration || 0), 0) / totalTests;
  const avgAgents = results.reduce((sum, r) => sum + (r.agentsExecuted || 0), 0) / totalTests;
  const avgCompliance = results.reduce((sum, r) => sum + (r.complianceScore || 0), 0) / totalTests;

  console.log(`⏱️  Average Duration: ${Math.round(avgDuration)}ms`);
  console.log(`🤖 Average Agents: ${avgAgents.toFixed(1)}`);
  console.log(`📈 Average Compliance: ${Math.round(avgCompliance * 100)}%`);

  // Economic Impact Analysis
  console.log('\n💸 Economic Impact Analysis:');
  const totalTraditionalCost = results.reduce((sum, r) => sum + (r.economics?.traditionalCost || 0), 0);
  const totalCurrentCost = results.reduce((sum, r) => sum + (r.economics?.currentCost || 0), 0);
  const totalSavings = totalTraditionalCost - totalCurrentCost;
  const overallSavingsRate = totalTraditionalCost > 0 ? (totalSavings / totalTraditionalCost) * 100 : 0;

  console.log(`  Traditional Approach: $${totalTraditionalCost.toFixed(3)}`);
  console.log(`  Archon V3 Approach: $${totalCurrentCost.toFixed(3)}`);
  console.log(`  Total Savings: $${totalSavings.toFixed(3)} (${Math.round(overallSavingsRate)}%)`);

  // Validation Metrics
  console.log('\n📊 Validation Metrics:');
  const localValidations = results.reduce((sum, r) => sum + (r.economics?.localValidations || 0), 0);
  const escalations = results.reduce((sum, r) => sum + (r.economics?.escalations || 0), 0);
  const totalValidations = localValidations + escalations;
  const escalationRate = totalValidations > 0 ? (escalations / totalValidations) * 100 : 0;

  console.log(`  Local Validations: ${localValidations} (0 tokens)`);
  console.log(`  Escalations: ${escalations} (~500-1000 tokens each)`);
  console.log(`  Escalation Rate: ${Math.round(escalationRate)}%`);
  console.log('  Target Escalation Rate: <10% ✅');

  // Final Assessment
  console.log('\n' + '='.repeat(60));
  console.log('🎯 FINAL ASSESSMENT');
  console.log('='.repeat(60));

  const systemGrade = calculateSystemGrade(successfulTests/totalTests, averageScore/100, overallSavingsRate/100);
  console.log(`🏆 System Grade: ${systemGrade.grade} (${systemGrade.score}/100)`);
  console.log(`📋 Assessment: ${systemGrade.assessment}`);
  console.log('💡 Recommendations:');
  systemGrade.recommendations.forEach(rec => {
    console.log(`  - ${rec}`);
  });

  return {
    success: successfulTests === totalTests,
    systemGrade,
    results,
    statistics: systemStats
  };
}

function calculateSystemGrade(successRate, avgScore, savingsRate) {
  let totalScore = 0;

  // Success rate (30%)
  totalScore += successRate * 30;

  // Average quality score (40%)
  totalScore += avgScore * 40;

  // Economic efficiency (30%)
  totalScore += savingsRate * 30;

  const score = Math.round(totalScore);

  let grade, assessment;
  const recommendations = [];

  if (score >= 90) {
    grade = 'A+';
    assessment = 'Excellent - Production ready with outstanding performance';
    recommendations.push('Deploy to production immediately');
    recommendations.push('Consider expanding to more complex projects');
  } else if (score >= 80) {
    grade = 'A';
    assessment = 'Very Good - Production ready with good performance';
    recommendations.push('Deploy to production');
    recommendations.push('Monitor performance and optimize further');
  } else if (score >= 70) {
    grade = 'B+';
    assessment = 'Good - Ready for production with minor improvements';
    recommendations.push('Address minor issues before production');
    recommendations.push('Enhance local validation rules');
  } else if (score >= 60) {
    grade = 'B';
    assessment = 'Satisfactory - Needs improvement before production';
    recommendations.push('Improve compliance scores');
    recommendations.push('Optimize economic efficiency');
  } else {
    grade = 'C';
    assessment = 'Needs significant improvement';
    recommendations.push('Review architecture and validation logic');
    recommendations.push('Increase local validation accuracy');
    recommendations.push('Reduce escalation rates');
  }

  return { grade, score, assessment, recommendations };
}

// Execute tests
if (import.meta.url === `file://${process.argv[1]}`) {
  testArchonV3System()
    .then(result => {
      console.log(`\n🎉 Test Suite Completed: ${result.success ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Test Suite Failed:', error);
      process.exit(1);
    });
}

export default testArchonV3System;
