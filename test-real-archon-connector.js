import { MCPTools } from './src/mcp/tools.js';
import { logger } from './src/utils/logger.js';

/**
 * Test du workflow hybride avec le VRAI connecteur Archon
 * Vérifie que Orchestra peut créer des tâches dans Archon
 */
async function testRealArchonConnector() {
  let mcpTools; // Déclarer ici pour la fermeture
  
  try {
    logger.info('🚀 TEST REAL ARCHON CONNECTOR');
    logger.info('=' + '='.repeat(50));
    
    // CRITIQUE: Désactiver les mock agents
    process.env.USE_MOCK_AGENTS = 'false';
    logger.info('⚠️ MODE: REAL ARCHON CONNECTOR (no mocks)');
    
    // Initialiser l'orchestrator avec les vrais connecteurs
    const { OrchestratorCore } = await import('./src/orchestrator/core.js');
    const orchestrator = new OrchestratorCore();
    await orchestrator.initialize(); // Ceci va créer les vrais connecteurs
    
    // Initialiser les MCP tools avec l'orchestrator réel
    mcpTools = new MCPTools(orchestrator);
    
    // Vérifier que le connecteur Archon est disponible
    if (!mcpTools.orchestrator.agents.has('archon_mcp')) {
      throw new Error('❌ Archon MCP connector not available - check Archon services');
    }
    
    logger.info('✅ Archon MCP connector available');
    
    // Test 1: Health check du connecteur Archon
    logger.info('\\n🔍 Testing Archon MCP health...');
    const archonAgent = mcpTools.orchestrator.agents.get('archon_mcp');
    const healthCheck = await archonAgent.healthCheck();
    logger.info(`Health: ${healthCheck.healthy ? '✅' : '❌'} - ${healthCheck.message}`);
    
    if (!healthCheck.healthy) {
      throw new Error('Archon MCP connector not healthy');
    }
    
    // Test 2: Lister les projets existants
    logger.info('\\n📋 Testing project listing...');
    const projectList = await archonAgent.execute(
      'list_projects_test',
      'manage_project', 
      [{ action: 'list' }]
    );
    
    logger.info(`Projects found: ${projectList.success ? '✅' : '❌'}`);
    if (projectList.projects) {
      logger.info(`   📊 Total projects: ${projectList.projects.length}`);
      projectList.projects.slice(0, 3).forEach(p => {
        logger.info(`   🆔 ${p.id}: ${p.title}`);
      });
    }
    
    // Test 3: Utiliser un projet existant pour le test
    const existingProjectId = 'eeca5715-7e9d-4932-9f66-7be4435b88d8'; // TaskFlow AI
    
    logger.info(`\\n🎯 Testing task creation in project ${existingProjectId}...`);
    
    // Compter les tâches existantes
    const initialTasks = await archonAgent.execute(
      'list_initial_tasks',
      'manage_task',
      [{ 
        action: 'list',
        filter_by: 'project',
        filter_value: existingProjectId
      }]
    );
    
    const initialCount = initialTasks.tasks ? initialTasks.tasks.length : 0;
    logger.info(`📊 Initial tasks: ${initialCount}`);
    
    // Test 4: Lancer le workflow hybride avec le vrai connecteur
    logger.info('\\n🚀 Launching REAL hybrid workflow...');
    
    const workflowResult = await mcpTools.executeTool('orchestra:start_hybrid_workflow', {
      project_description: 'Real Connector Test - Smart Task Management with AI insights',
      constraints: ['Web-based', 'Modern tech stack', 'Real-time collaboration', 'AI integration'],
      existing_archon_project: existingProjectId // Utiliser projet existant
    });
    
    logger.info('\\n📊 WORKFLOW RESULTS:');
    logger.info(`Success: ${workflowResult.success ? '✅' : '❌'}`);
    
    if (workflowResult.success) {
      logger.info(`🆔 Orchestra Project: ${workflowResult.project_id}`);
      logger.info(`🏛️ Archon Project: ${workflowResult.archon_project_id}`);
      logger.info(`📊 Status: ${workflowResult.workflow_status}`);
      logger.info(`🔍 Patterns Found: ${workflowResult.archon_integration.patterns_found}`);
      logger.info(`💼 Examples Found: ${workflowResult.archon_integration.examples_found}`);
      logger.info(`📋 Tasks Created: ${workflowResult.archon_integration.tasks_created}`);
      logger.info(`⏱️ Duration: ${workflowResult.duration_ms}ms`);
      
      // Test 5: Vérifier que les tâches ont été créées dans Archon
      logger.info('\\n🔍 Verifying tasks in Archon...');
      
      const finalTasks = await archonAgent.execute(
        'list_final_tasks',
        'manage_task',
        [{ 
          action: 'list',
          filter_by: 'project',
          filter_value: existingProjectId
        }]
      );
      
      const finalCount = finalTasks.tasks ? finalTasks.tasks.length : 0;
      const tasksAdded = finalCount - initialCount;
      
      logger.info(`📊 Final tasks: ${finalCount}`);
      logger.info(`➕ Tasks added: ${tasksAdded}`);
      
      if (tasksAdded > 0) {
        logger.info('\\n✅ SYNCHRONISATION RÉUSSIE !');
        logger.info('🎉 Orchestra a bien créé des tâches dans Archon');
        
        // Afficher les nouvelles tâches
        if (finalTasks.tasks && finalTasks.tasks.length > initialCount) {
          logger.info('\\n🆕 New tasks created:');
          finalTasks.tasks.slice(-tasksAdded).forEach(task => {
            logger.info(`   📋 ${task.title} (${task.status})`);
          });
        }
        
        return {
          success: true,
          archon_project: existingProjectId,
          tasks_before: initialCount,
          tasks_after: finalCount,
          tasks_added: tasksAdded,
          workflow_result: workflowResult
        };
        
      } else {
        logger.error('❌ ÉCHEC SYNCHRONISATION: Aucune tâche ajoutée');
        return { success: false, error: 'No tasks added to Archon' };
      }
      
    } else {
      logger.error(`❌ Workflow failed: ${workflowResult.error}`);
      return { success: false, error: workflowResult.error };
    }
    
  } catch (error) {
    logger.error('💥 Test failed:', error);
    return { success: false, error: error.message };
  } finally {
    // Fermeture propre de l'orchestrator
    if (mcpTools?.orchestrator) {
      await mcpTools.orchestrator.shutdown();
      logger.info('🔄 Orchestrator shutdown completed');
    }
  }
}

// Execute test
testRealArchonConnector()
  .then(result => {
    if (result.success) {
      console.log('\\n🏆 TEST RÉUSSI - SYNCHRONISATION ORCHESTRA → ARCHON VALIDÉE');
      process.exit(0);
    } else {
      console.log('\\n💥 TEST ÉCHOUÉ:', result.error);
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('💥 Erreur critique:', error);
    process.exit(1);
  });