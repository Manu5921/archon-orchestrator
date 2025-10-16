// 🧠 RAG LEARNING MCP TOOLS
// Outils MCP pour récupérer automatiquement les best practices

const fs = require('fs');
const path = require('path');

class RAGLearningTools {
  constructor() {
    this.learningDir = './knowledge-base/auto-learned';
  }

  // 📋 Récupérer best practices par topic
  getBestPractices(topic) {
    try {
      if (!fs.existsSync(this.learningDir)) {
        return { success: false, error: 'No learning directory found' };
      }

      const files = fs.readdirSync(this.learningDir)
        .filter(f => f.startsWith('bp_') && f.includes(topic))
        .map(f => {
          const content = JSON.parse(fs.readFileSync(path.join(this.learningDir, f), 'utf8'));
          return content;
        });

      return {
        success: true,
        topic,
        bestPractices: files,
        count: files.length
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ⚠️ Récupérer erreurs communes et solutions
  getCommonErrors(errorType) {
    try {
      const files = fs.readdirSync(this.learningDir)
        .filter(f => f.startsWith('err_') && f.includes(errorType))
        .map(f => {
          const content = JSON.parse(fs.readFileSync(path.join(this.learningDir, f), 'utf8'));
          return content;
        });

      return {
        success: true,
        errorType,
        errors: files,
        count: files.length
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 🔄 Récupérer workflow validé
  getWorkflowGuide(workflowName) {
    try {
      const files = fs.readdirSync(this.learningDir)
        .filter(f => f.startsWith('wf_') && f.includes(workflowName))
        .map(f => {
          const content = JSON.parse(fs.readFileSync(path.join(this.learningDir, f), 'utf8'));
          return content;
        });

      if (files.length === 0) {
        return { success: false, error: `No workflow found for: ${workflowName}` };
      }

      return {
        success: true,
        workflowName,
        workflows: files,
        latest: files[files.length - 1] // Most recent
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 🎯 Auto-diagnostic d'une nouvelle session
  getSessionStartupGuide() {
    const guide = {
      success: true,
      title: '🚀 Auto-Diagnostic Nouvelle Session Archon',
      steps: [
        {
          step: 1,
          title: 'Vérifier services Archon',
          command: '/mcp archon health_check',
          expected: 'status: healthy',
          onError: 'Démarrer services avec ./docker-start.sh up'
        },
        {
          step: 2,
          title: 'Tester Context7 MCP',
          command: '/mcp context7 resolve-library-id Next.js',
          expected: 'Liste des libraries Next.js',
          onError: 'Vérifier configuration MCP Context7 dans .mcp.json'
        },
        {
          step: 3,
          title: 'Récupérer best practices',
          command: "/mcp archon get_best_practices topic='setup'",
          expected: 'Best practices disponibles',
          onError: 'Pas de best practices - première utilisation OK'
        }
      ],
      commonIssues: [
        'Si MCP non accessible → Vérifier .mcp.json dans projet',
        'Si Context7 timeout → Connexion internet requise',
        'Si hooks non actifs → Exécuter ./activate-context7-hooks.sh'
      ]
    };

    return guide;
  }

  // 📊 Statistiques d'apprentissage
  getLearningStats() {
    try {
      const files = fs.readdirSync(this.learningDir);

      const stats = {
        success: true,
        totalItems: files.length,
        bestPractices: files.filter(f => f.startsWith('bp_')).length,
        errorPatterns: files.filter(f => f.startsWith('err_')).length,
        workflows: files.filter(f => f.startsWith('wf_')).length,
        topics: [...new Set(files.map(f => f.split('_')[1]).filter(Boolean))],
        lastUpdated: this.getLastModified()
      };

      return stats;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  getLastModified() {
    try {
      const files = fs.readdirSync(this.learningDir);
      const dates = files.map(f => {
        const stat = fs.statSync(path.join(this.learningDir, f));
        return stat.mtime;
      });
      return dates.length > 0 ? new Date(Math.max(...dates)).toISOString() : null;
    } catch {
      return null;
    }
  }
}

// Export des outils MCP
const ragTools = new RAGLearningTools();

const mcpTools = [
  {
    name: 'get_best_practices',
    description: 'Récupère les best practices validées par topic',
    inputSchema: {
      type: 'object',
      properties: {
        topic: {
          type: 'string',
          description: 'Topic des best practices (ex: context7-hooks, mcp-setup)'
        }
      },
      required: ['topic']
    },
    handler: (params) => ragTools.getBestPractices(params.topic)
  },
  {
    name: 'get_common_errors',
    description: 'Récupère les erreurs communes et leurs solutions',
    inputSchema: {
      type: 'object',
      properties: {
        errorType: {
          type: 'string',
          description: "Type d'erreur (ex: mcp-setup, context7, hooks)"
        }
      },
      required: ['errorType']
    },
    handler: (params) => ragTools.getCommonErrors(params.errorType)
  },
  {
    name: 'get_workflow_guide',
    description: 'Récupère un guide workflow validé',
    inputSchema: {
      type: 'object',
      properties: {
        workflowName: {
          type: 'string',
          description: 'Nom du workflow (ex: nouveau-projet-setup)'
        }
      },
      required: ['workflowName']
    },
    handler: (params) => ragTools.getWorkflowGuide(params.workflowName)
  },
  {
    name: 'get_session_startup_guide',
    description: 'Guide auto-diagnostic pour nouvelles sessions',
    inputSchema: {
      type: 'object',
      properties: {}
    },
    handler: () => ragTools.getSessionStartupGuide()
  },
  {
    name: 'get_learning_stats',
    description: 'Statistiques de la knowledge base auto-apprise',
    inputSchema: {
      type: 'object',
      properties: {}
    },
    handler: () => ragTools.getLearningStats()
  }
];

module.exports = { RAGLearningTools, mcpTools };
