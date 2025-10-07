import { test, expect } from '@playwright/test';
import { MCPTools } from '../../src/mcp/tools.js';
import { logger } from '../../src/utils/logger.js';

test.describe('Orchestra → Archon Synchronization', () => {
  let mcpTools;
  let archonProjectId;

  test.beforeAll(async () => {
    // Configuration pour utiliser les vrais connecteurs Archon
    process.env.USE_MOCK_AGENTS = 'false'; // CRITIQUE: Utiliser le vrai connecteur
    
    // Initialiser l'orchestrator avec les vrais connecteurs (comme dans le test fonctionnel)
    const { OrchestratorCore } = await import('../../src/orchestrator/core.js');
    const orchestrator = new OrchestratorCore();
    await orchestrator.initialize();
    
    // Initialiser les MCP tools avec l'orchestrator réel
    mcpTools = new MCPTools(orchestrator);
    
    // Project ID existant dans Archon pour les tests
    archonProjectId = 'eeca5715-7e9d-4932-9f66-7be4435b88d8';
    
    logger.info('🧪 Test E2E initialized avec VRAI connecteur Archon');
  });

  test.afterAll(async () => {
    if (mcpTools?.orchestrator) {
      await mcpTools.orchestrator.shutdown();
    }
  });

  test('should create tasks in Archon via Orchestra workflow', async ({ page }) => {
    // 1. Aller sur l'interface Archon et se connecter au projet
    await page.goto(`/project/${archonProjectId}`);
    await page.waitForLoadState('networkidle');
    
    // 2. Compter les tâches initiales
    await page.waitForSelector('[data-testid="task-item"], .task-item, .task, [class*="task"]', { 
      state: 'visible', 
      timeout: 10000 
    });
    
    const initialTasks = await page.locator('[data-testid="task-item"], .task-item, .task, [class*="task"]').count();
    logger.info(`📊 Tâches initiales dans Archon UI: ${initialTasks}`);

    // 3. Lancer le workflow hybride avec le VRAI connecteur Archon
    logger.info('🚀 Lancement du workflow hybride avec le VRAI connecteur...');
    
    const workflowResult = await mcpTools.executeTool('orchestra:start_hybrid_workflow', {
      project_description: 'E2E Test Project - Smart Task Tracker with AI insights and real-time collaboration',
      constraints: ['Web-based application', 'Modern tech stack', 'Real-time features', 'AI integration'],
      deadline: '2024-12-31',
      team_size: 'small'
    });

    // 4. Vérifier que le workflow s'est exécuté avec succès
    expect(workflowResult.success).toBeTruthy();
    expect(workflowResult.archon_project_id).toBeDefined();
    expect(workflowResult.archon_integration.tasks_created).toBeGreaterThan(0);
    
    logger.info(`✅ Workflow executé: Projet ${workflowResult.archon_project_id}, ${workflowResult.archon_integration.tasks_created} tâches créées`);

    // 5. Attendre un peu pour la synchronisation
    await page.waitForTimeout(2000);
    
    // 6. Rafraîchir la page pour voir les nouvelles tâches
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // 7. Compter les tâches après le workflow
    await page.waitForSelector('[data-testid="task-item"], .task-item, .task, [class*="task"]', { 
      state: 'visible', 
      timeout: 10000 
    });
    
    const finalTasks = await page.locator('[data-testid="task-item"], .task-item, .task, [class*="task"]').count();
    logger.info(`📊 Tâches finales dans Archon UI: ${finalTasks}`);
    
    // 8. Vérifier que des tâches ont été ajoutées
    const tasksAdded = finalTasks - initialTasks;
    logger.info(`➕ Tâches ajoutées via Orchestra: ${tasksAdded}`);
    
    // ASSERTION CRITIQUE: Les tâches doivent apparaître dans l'UI
    expect(tasksAdded).toBeGreaterThanOrEqual(workflowResult.archon_integration.tasks_created);
    
    // 9. Vérifier que les titres des tâches correspondent au workflow révolutionnaire
    const taskTitles = await page.locator('[data-testid="task-title"], .task-title, [class*="title"]').allTextContents();
    const revolutionaryTasks = taskTitles.filter(title => 
      title.includes('Phase') || 
      title.includes('Creative') || 
      title.includes('Validation') || 
      title.includes('Orchestration') || 
      title.includes('Review')
    );
    
    logger.info(`🎯 Tâches révolutionnaires trouvées: ${revolutionaryTasks.length}/${taskTitles.length}`);
    expect(revolutionaryTasks.length).toBeGreaterThan(0);
    
    // 10. Screenshot pour documentation
    await page.screenshot({ 
      path: `tests/e2e/results/orchestra-archon-sync-${Date.now()}.png`,
      fullPage: true 
    });
  });

  test('should show task details with Orchestra workflow context', async ({ page }) => {
    // Test plus détaillé pour vérifier le contenu des tâches créées
    await page.goto(`/project/${archonProjectId}`);
    await page.waitForLoadState('networkidle');
    
    // Rechercher une tâche créée par Orchestra (qui contient "Phase")
    const orchestraTask = page.locator('[data-testid="task-item"], .task-item').filter({ 
      hasText: /Phase|Creative|Validation|Orchestration|Review/ 
    }).first();
    
    if (await orchestraTask.count() > 0) {
      await orchestraTask.click();
      
      // Vérifier les détails de la tâche
      await expect(page.locator('[data-testid="task-details"], .task-details')).toBeVisible();
      
      // La tâche devrait avoir été créée récemment (moins de 5 minutes)
      const createdTime = await page.locator('[data-testid="task-created"], .task-created, [class*="created"]').textContent();
      logger.info(`⏰ Tâche créée: ${createdTime}`);
      
      await page.screenshot({ 
        path: `tests/e2e/results/task-details-${Date.now()}.png` 
      });
    }
  });
});