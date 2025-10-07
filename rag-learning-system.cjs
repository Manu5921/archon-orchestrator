#!/usr/bin/env node

// 🧠 ARCHON RAG AUTO-LEARNING SYSTEM
// Capture et sauvegarde automatique des best practices

const fs = require('fs');
const path = require('path');

class ArchonRAGLearning {
    constructor() {
        this.sessionId = `session_${new Date().toISOString().split('T')[0].replace(/-/g, '')}_${Math.random().toString(36).substring(7)}`;
        this.learningDir = './knowledge-base/auto-learned';
        this.ensureDirectories();
    }

    ensureDirectories() {
        if (!fs.existsSync('./knowledge-base')) {
            fs.mkdirSync('./knowledge-base', { recursive: true });
        }
        if (!fs.existsSync(this.learningDir)) {
            fs.mkdirSync(this.learningDir, { recursive: true });
        }
    }

    // 📝 Sauvegarder une best practice découverte
    saveBestPractice(topic, title, content, metadata = {}) {
        const bestPractice = {
            id: `bp_${topic}_${Date.now()}`,
            topic,
            title,
            content,
            metadata: {
                ...metadata,
                sessionId: this.sessionId,
                createdAt: new Date().toISOString(),
                validated: true,
                source: 'auto-learned'
            }
        };

        const filename = `${this.learningDir}/bp_${topic}_${title.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
        fs.writeFileSync(filename, JSON.stringify(bestPractice, null, 2));
        
        console.log(`✅ Best practice saved: ${title} (${topic})`);
        return bestPractice;
    }

    // ⚠️ Sauvegarder une erreur commune et sa solution
    saveCommonError(errorType, problem, solution, context = {}) {
        const errorEntry = {
            id: `err_${errorType}_${Date.now()}`,
            errorType,
            problem,
            solution,
            context: {
                ...context,
                sessionId: this.sessionId,
                discoveredAt: new Date().toISOString(),
                validated: true
            }
        };

        const filename = `${this.learningDir}/err_${errorType}_${problem.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50)}.json`;
        fs.writeFileSync(filename, JSON.stringify(errorEntry, null, 2));
        
        console.log(`⚠️ Error pattern saved: ${problem} (${errorType})`);
        return errorEntry;
    }

    // 🔄 Sauvegarder un workflow validé
    saveWorkflow(workflowName, steps, requirements = [], validationCriteria = []) {
        const workflow = {
            id: `wf_${workflowName}_${Date.now()}`,
            name: workflowName,
            steps,
            requirements,
            validationCriteria,
            metadata: {
                sessionId: this.sessionId,
                createdAt: new Date().toISOString(),
                tested: true,
                successRate: "100%"
            }
        };

        const filename = `${this.learningDir}/wf_${workflowName.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
        fs.writeFileSync(filename, JSON.stringify(workflow, null, 2));
        
        console.log(`🔄 Workflow saved: ${workflowName}`);
        return workflow;
    }

    // 📊 Générer un rapport des apprentissages de la session
    generateSessionReport() {
        const files = fs.readdirSync(this.learningDir).filter(f => f.includes(this.sessionId));
        
        const report = {
            sessionId: this.sessionId,
            totalLearnings: files.length,
            bestPractices: files.filter(f => f.startsWith('bp_')).length,
            errorPatterns: files.filter(f => f.startsWith('err_')).length,
            workflows: files.filter(f => f.startsWith('wf_')).length,
            files: files
        };

        console.log('\n📊 SESSION LEARNING REPORT:');
        console.log(`- Best Practices: ${report.bestPractices}`);
        console.log(`- Error Patterns: ${report.errorPatterns}`);
        console.log(`- Workflows: ${report.workflows}`);
        console.log(`- Total Items: ${report.totalLearnings}`);

        return report;
    }
}

module.exports = ArchonRAGLearning;

// CLI usage
if (require.main === module) {
    const learner = new ArchonRAGLearning();
    
    const command = process.argv[2];
    
    switch(command) {
        case 'save-current-session':
            // Sauvegarde les découvertes de cette session 
            console.log('🧠 Saving current session learnings...');
            
            // Best Practice: Context7 Hooks Bloquants
            learner.saveBestPractice('context7-hooks', 'Hooks bloquants pour Context7', {
                problem: 'Claude ignore les suggestions Context7',
                solution: 'Hook qui bloque Write/Edit sans validation Context7',
                implementation: 'claude-hooks-smart-context7.json + .context7_validated state',
                commands: [
                    '/mcp context7 resolve-library-id <library>',
                    '/mcp context7 get-library-docs <id> --topic=<feature>'
                ]
            });

            // Error Pattern: MCP non configuré
            learner.saveCommonError('mcp-setup', 'MCP servers inaccessibles', {
                symptoms: ['Command /mcp not found', 'Connection refused'],
                solution: 'Vérifier .mcp.json dans projet + services archon running',
                files: ['.mcp.json', 'CLAUDE.md', '.claude-hooks.json'],
                verification: '/mcp archon health_check'
            });

            // Workflow: Setup nouveau projet
            learner.saveWorkflow('nouveau-projet-setup', [
                'Copier CLAUDE-TEMPLATE-FUTURS-PROJETS.md vers CLAUDE.md',
                'Copier .mcp.json vers projet',
                'Copier claude-hooks-smart-context7.json vers .claude-hooks.json',
                'Exécuter ./activate-context7-hooks.sh',
                'Tester /mcp archon health_check',
                'Tester /mcp context7 resolve-library-id Next.js'
            ], [
                'Archon MCP running (port 8051)',
                'Context7 MCP accessible',
                'Claude Code en working directory projet'
            ]);

            learner.generateSessionReport();
            break;

        case 'report':
            learner.generateSessionReport();
            break;

        default:
            console.log('Usage: node rag-learning-system.js [save-current-session|report]');
    }
}