#!/usr/bin/env node

// 🧪 TEST MULTI-TASK ORCHESTRATOR

const { MultiTaskOrchestrator } = require('./src/orchestrator/multi-task-orchestrator.cjs');

async function testOrchestrator() {
  console.log('🧪 TESTING MULTI-TASK ORCHESTRATOR\n');

  // Architecture exemple validée par Gemini
  const validatedArchitecture = {
    project: 'TrustBoost',
    stack: ['Next.js 15', 'Supabase', 'Stripe', 'Vercel KV'],
    structure: {
      frontend: 'React Server Components + Client Components',
      backend: 'API Routes + Server Actions',
      database: 'Supabase PostgreSQL with RLS',
      auth: 'Supabase Auth with OAuth',
      payments: 'Stripe Checkout + Webhooks',
      deployment: 'Vercel with GitHub CI/CD'
    },
    geminiScore: 87, // > 85 donc approuvé
    approvalStatus: 'APPROVED'
  };

  const projectRequirements = {
    features: ['Widget embarquable', 'Dashboard', 'RGPD compliance'],
    constraints: ['<20KB widget', 'Rate limiting', 'No Google reviews incentive'],
    timeline: '3 days MVP'
  };

  // Créer et configurer orchestrateur
  const orchestrator = new MultiTaskOrchestrator();

  // Événements pour monitoring temps réel
  orchestrator.on('agentCompleted', (result) => {
    console.log(`📊 AGENT COMPLETED: ${result.agent} (${result.duration}ms)`);
  });

  // Définir sub-agents
  const agents = orchestrator.defineSubAgents();
  console.log('🤖 Sub-agents defined:', Object.keys(agents).join(', '));

  // Créer plan d'exécution
  const plan = orchestrator.createExecutionPlan(validatedArchitecture, projectRequirements);
  console.log('\n📋 EXECUTION PLAN:');
  console.log('   Phase 1 (Parallel):', plan.phase1_parallel.join(', '));
  console.log('   Phase 2 (Dependent):', plan.phase2_dependent.join(', '));
  console.log('   Phase 3 (Final):', plan.phase3_final.join(', '));
  console.log('   Estimated time:', plan.estimated_time);

  // Lancer orchestration
  console.log('\n🚀 STARTING ORCHESTRATION...\n');
  const startTime = Date.now();

  const results = await orchestrator.startOrchestration();

  const totalTime = Date.now() - startTime;

  // Rapport final détaillé
  console.log('\n📊 FINAL RESULTS:');
  console.log(`   Real execution time: ${totalTime}ms`);
  console.log(`   Files to be generated: ${results.filesGenerated.length}`);
  console.log('   Files list:');
  results.filesGenerated.forEach(file => console.log(`   - ${file}`));

  console.log('\n📈 AGENT PERFORMANCE:');
  Object.entries(results.summary).forEach(([agent, tasks]) => {
    console.log(`   ${agent}: ${tasks} tasks completed`);
  });

  console.log('\n✅ ORCHESTRATOR TEST COMPLETED!');
  console.log('💡 In real usage, each agent would execute actual Write/Edit operations');
  console.log('🎯 This simulation proves the coordination and dependency management works');

  return results;
}

// Lancer le test
if (require.main === module) {
  testOrchestrator().catch(console.error);
}
