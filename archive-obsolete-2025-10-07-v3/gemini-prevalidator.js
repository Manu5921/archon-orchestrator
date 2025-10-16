#!/usr/bin/env node

/**
 * 🤖 GEMINI PRE-VALIDATOR
 *
 * Utilise Gemini pour détecter les problèmes AVANT le build
 * Prévient les erreurs de compilation en analysant le code en amont
 *
 * Usage:
 *   node gemini-prevalidator.js                    # Validation complète
 *   node gemini-prevalidator.js --file src/auth.js # Fichier spécifique
 *   node gemini-prevalidator.js --feature auth     # Feature complète
 *   node gemini-prevalidator.js --quick            # Validation rapide
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import chalk from 'chalk';
import ora from 'ora';

const execAsync = promisify(exec);

class GeminiPreValidator {
  constructor(options = {}) {
    this.options = {
      file: options.file || process.argv.find(arg => arg.startsWith('--file='))?.split('=')[1],
      feature: options.feature || process.argv.find(arg => arg.startsWith('--feature='))?.split('=')[1],
      quick: process.argv.includes('--quick'),
      verbose: process.argv.includes('--verbose'),
      autoFix: process.argv.includes('--autofix')
    };

    this.issues = [];
    this.suggestions = [];
    this.criticalErrors = [];

    // Configuration Gemini Bridge
    this.geminiUrl = process.env.GEMINI_API_URL || 'http://127.0.0.1:7777';
  }

  /**
   * Collecter tous les fichiers à valider
   */
  collectFiles() {
    const files = [];

    if (this.options.file) {
      // Un fichier spécifique
      if (existsSync(this.options.file)) {
        files.push(this.options.file);
      }
    } else if (this.options.feature) {
      // Tous les fichiers d'une feature
      const searchPaths = ['src', 'components', 'pages', 'app'];
      searchPaths.forEach(dir => {
        if (existsSync(dir)) {
          this.findFeatureFiles(dir, this.options.feature, files);
        }
      });
    } else {
      // Tous les fichiers modifiés récemment (10 minutes)
      const recentFiles = this.getRecentlyModifiedFiles();
      files.push(...recentFiles);
    }

    return files.filter(f =>
      ['.js', '.jsx', '.ts', '.tsx'].includes(extname(f))
    );
  }

  /**
   * Trouver les fichiers liés à une feature
   */
  findFeatureFiles(dir, feature, files) {
    const items = readdirSync(dir);

    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        this.findFeatureFiles(fullPath, feature, files);
      } else if (stat.isFile()) {
        const lowerItem = item.toLowerCase();
        const lowerFeature = feature.toLowerCase();
        if (lowerItem.includes(lowerFeature) || fullPath.includes(lowerFeature)) {
          files.push(fullPath);
        }
      }
    }
  }

  /**
   * Obtenir les fichiers modifiés récemment
   */
  getRecentlyModifiedFiles() {
    try {
      const { stdout } = require('child_process').execSync(
        'find . -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | ' +
        'grep -v node_modules | xargs ls -lt | head -20',
        { encoding: 'utf8' }
      );

      return stdout.split('\n')
        .filter(line => line.trim())
        .map(line => {
          const parts = line.split(/\s+/);
          return parts[parts.length - 1];
        })
        .filter(file => existsSync(file));
    } catch {
      return [];
    }
  }

  /**
   * Valider un fichier avec Gemini
   */
  async validateFile(filePath) {
    const spinner = ora(`Validation de ${filePath}`).start();

    try {
      const content = readFileSync(filePath, 'utf8');

      // Créer le prompt pour Gemini
      const prompt = this.createValidationPrompt(filePath, content);

      // Appeler Gemini via le bridge ou CLI
      const result = await this.callGemini(prompt);

      // Parser la réponse
      const validation = this.parseGeminiResponse(result, filePath);

      if (validation.critical.length > 0) {
        spinner.fail(`${filePath} - ${validation.critical.length} erreurs critiques`);
        this.criticalErrors.push(...validation.critical);
      } else if (validation.issues.length > 0) {
        spinner.warn(`${filePath} - ${validation.issues.length} problèmes détectés`);
        this.issues.push(...validation.issues);
      } else {
        spinner.succeed(`${filePath} - OK`);
      }

      if (validation.suggestions.length > 0) {
        this.suggestions.push(...validation.suggestions);
      }

      return validation;

    } catch (error) {
      spinner.fail(`${filePath} - Erreur de validation`);
      console.error(chalk.red(`Erreur: ${error.message}`));
      return { critical: [], issues: [], suggestions: [] };
    }
  }

  /**
   * Créer le prompt de validation pour Gemini
   */
  createValidationPrompt(filePath, content) {
    return `
    ANALYSE CE CODE POUR DÉTECTER LES PROBLÈMES DE BUILD POTENTIELS.
    
    Fichier: ${filePath}
    
    CODE À ANALYSER:
    \`\`\`
    ${content}
    \`\`\`
    
    VÉRIFIE CES POINTS CRITIQUES:
    1. Imports manquants ou incorrects
    2. Erreurs de syntaxe JavaScript/TypeScript
    3. Variables non définies utilisées
    4. Exports manquants ou incorrects
    5. Dépendances npm non installées
    6. Erreurs de typage TypeScript
    7. Fonctions async sans await
    8. Propriétés d'objets inexistantes
    
    RÉPONDS AU FORMAT JSON STRICT:
    {
      "critical": [
        {
          "line": <numéro>,
          "type": "import|syntax|undefined|type|async",
          "message": "description claire",
          "fix": "correction suggérée"
        }
      ],
      "warnings": [
        {
          "line": <numéro>,
          "type": "style|convention|performance",
          "message": "description",
          "suggestion": "amélioration"
        }
      ],
      "suggestions": [
        {
          "type": "optimization|refactor|security",
          "message": "suggestion d'amélioration"
        }
      ],
      "buildWillFail": true/false,
      "score": <0-10>
    }
    `;
  }

  /**
   * Appeler Gemini (via bridge ou CLI)
   */
  async callGemini(prompt) {
    // Essayer d'abord le bridge HTTP
    try {
      const response = await fetch(this.geminiUrl + '/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
        timeout: 10000
      });

      if (response.ok) {
        const data = await response.json();
        return data.response || data.text || '';
      }
    } catch (error) {
      if (this.options.verbose) {
        console.log(chalk.gray('Bridge non disponible, utilisation du CLI...'));
      }
    }

    // Fallback sur CLI
    const { stdout } = await execAsync(
      `gemini -p "${prompt.replace(/"/g, '\\"')}"`,
      { maxBuffer: 1024 * 1024 * 10 }
    );

    return stdout;
  }

  /**
   * Parser la réponse de Gemini
   */
  parseGeminiResponse(response, filePath) {
    try {
      // Extraire le JSON de la réponse
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        // Fallback: analyse textuelle
        return this.parseTextResponse(response, filePath);
      }

      const data = JSON.parse(jsonMatch[0]);

      return {
        critical: (data.critical || []).map(e => ({
          ...e,
          file: filePath
        })),
        issues: (data.warnings || []).map(w => ({
          ...w,
          file: filePath
        })),
        suggestions: data.suggestions || [],
        buildWillFail: data.buildWillFail || false,
        score: data.score || 5
      };

    } catch (error) {
      // Fallback sur analyse textuelle
      return this.parseTextResponse(response, filePath);
    }
  }

  /**
   * Parser une réponse textuelle (fallback)
   */
  parseTextResponse(response, filePath) {
    const critical = [];
    const issues = [];
    const suggestions = [];

    const lines = response.split('\n');

    lines.forEach(line => {
      const lowerLine = line.toLowerCase();

      if (lowerLine.includes('error') || lowerLine.includes('undefined') ||
          lowerLine.includes('missing') || lowerLine.includes('cannot find')) {
        critical.push({
          file: filePath,
          type: 'detected',
          message: line.trim()
        });
      } else if (lowerLine.includes('warning') || lowerLine.includes('should')) {
        issues.push({
          file: filePath,
          type: 'warning',
          message: line.trim()
        });
      } else if (lowerLine.includes('suggest') || lowerLine.includes('recommend')) {
        suggestions.push({
          type: 'suggestion',
          message: line.trim()
        });
      }
    });

    return {
      critical,
      issues,
      suggestions,
      buildWillFail: critical.length > 0,
      score: critical.length > 0 ? 3 : issues.length > 0 ? 6 : 8
    };
  }

  /**
   * Générer le rapport de validation
   */
  generateReport() {
    console.log(chalk.yellow('\n' + '='.repeat(60)));
    console.log(chalk.yellow.bold('🤖 RAPPORT DE PRÉ-VALIDATION GEMINI'));
    console.log(chalk.yellow('='.repeat(60)));

    // Erreurs critiques
    if (this.criticalErrors.length > 0) {
      console.log(chalk.red.bold('\n❌ ERREURS CRITIQUES (Build va échouer):'));
      this.criticalErrors.forEach((error, i) => {
        console.log(chalk.red(`\n${i + 1}. ${error.file}`));
        console.log(`   Type: ${error.type}`);
        console.log(`   ${error.message}`);
        if (error.fix) {
          console.log(chalk.cyan(`   Fix: ${error.fix}`));
        }
      });
    }

    // Problèmes non critiques
    if (this.issues.length > 0) {
      console.log(chalk.yellow.bold('\n⚠️  PROBLÈMES DÉTECTÉS:'));
      this.issues.forEach((issue, i) => {
        if (i < 5 || this.options.verbose) {
          console.log(chalk.yellow(`${i + 1}. ${issue.file}: ${issue.message}`));
        }
      });
      if (this.issues.length > 5 && !this.options.verbose) {
        console.log(chalk.gray(`... et ${this.issues.length - 5} autres`));
      }
    }

    // Suggestions
    if (this.suggestions.length > 0 && this.options.verbose) {
      console.log(chalk.cyan.bold('\n💡 SUGGESTIONS:'));
      this.suggestions.slice(0, 3).forEach(sugg => {
        console.log(chalk.cyan(`• ${sugg.message}`));
      });
    }

    // Résumé
    console.log(chalk.white.bold('\n📊 RÉSUMÉ:'));
    console.log(`  Fichiers analysés: ${this.filesAnalyzed || 0}`);
    console.log(`  Erreurs critiques: ${this.criticalErrors.length}`);
    console.log(`  Problèmes: ${this.issues.length}`);
    console.log(`  Suggestions: ${this.suggestions.length}`);

    // Verdict
    console.log(chalk.yellow('\n' + '='.repeat(60)));
    if (this.criticalErrors.length > 0) {
      console.log(chalk.red.bold('❌ LE BUILD VA ÉCHOUER - Corrections requises'));
      console.log(chalk.red('Corrigez les erreurs critiques avant de faire pnpm run build'));
    } else if (this.issues.length > 0) {
      console.log(chalk.yellow.bold('⚠️  BUILD POSSIBLE mais avec warnings'));
      console.log(chalk.yellow('Considérez corriger les problèmes détectés'));
    } else {
      console.log(chalk.green.bold('✅ PRÉ-VALIDATION RÉUSSIE'));
      console.log(chalk.green('Le code semble prêt pour le build'));
    }
    console.log(chalk.yellow('='.repeat(60) + '\n'));

    return this.criticalErrors.length === 0;
  }

  /**
   * Sauvegarder les corrections suggérées
   */
  saveSuggestions() {
    if (this.criticalErrors.length === 0) return;

    const fixes = {
      timestamp: new Date().toISOString(),
      critical: this.criticalErrors,
      suggestions: this.suggestions,
      autoFixAvailable: this.criticalErrors.filter(e => e.fix).length
    };

    const filename = `gemini-fixes-${Date.now()}.json`;
    require('fs').writeFileSync(filename, JSON.stringify(fixes, null, 2));

    console.log(chalk.gray(`\nCorrections sauvegardées dans: ${filename}`));

    if (this.options.autoFix && fixes.autoFixAvailable > 0) {
      console.log(chalk.cyan('Pour appliquer les corrections automatiques:'));
      console.log(chalk.cyan(`node apply-gemini-fixes.js ${filename}`));
    }
  }

  /**
   * Exécuter la pré-validation
   */
  async run() {
    console.log(chalk.cyan.bold('\n🤖 GEMINI PRE-VALIDATOR'));
    console.log(chalk.cyan('Détection proactive des erreurs de build\n'));

    // Collecter les fichiers
    const files = this.collectFiles();

    if (files.length === 0) {
      console.log(chalk.yellow('Aucun fichier à valider trouvé'));
      console.log(chalk.gray('Utilisez --file=<path> ou --feature=<name>'));
      return;
    }

    console.log(chalk.blue(`📁 ${files.length} fichier(s) à analyser\n`));
    this.filesAnalyzed = files.length;

    // Valider chaque fichier
    for (const file of files) {
      await this.validateFile(file);

      // En mode quick, arrêter à la première erreur critique
      if (this.options.quick && this.criticalErrors.length > 0) {
        console.log(chalk.red('\n⛔ Arrêt en mode quick - erreur critique détectée'));
        break;
      }
    }

    // Générer le rapport
    const success = this.generateReport();

    // Sauvegarder les suggestions si nécessaire
    if (!success) {
      this.saveSuggestions();
    }

    // Exit code approprié
    process.exit(success ? 0 : 1);
  }
}

// Lancer si exécuté directement
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new GeminiPreValidator();
  validator.run();
}

export default GeminiPreValidator;
