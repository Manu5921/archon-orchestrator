#!/usr/bin/env node

/**
 * 🛡️ ZERO TRUST VALIDATOR
 * 
 * Script de validation automatique pour Claude Code
 * Applique la philosophie "Confiance Zéro" - toute affirmation doit être prouvée
 * 
 * Usage:
 *   node zero-trust-validator.js              # Validation complète
 *   node zero-trust-validator.js --build      # Build uniquement
 *   node zero-trust-validator.js --tests      # Tests uniquement
 *   node zero-trust-validator.js --quick      # Validation rapide
 *   node zero-trust-validator.js --strict     # Mode strict (échec si score < 8/10)
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync, readFileSync } from 'fs';
import chalk from 'chalk';
import ora from 'ora';

const execAsync = promisify(exec);

class ZeroTrustValidator {
  constructor(options = {}) {
    this.options = {
      strict: options.strict || process.argv.includes('--strict'),
      buildOnly: process.argv.includes('--build'),
      testsOnly: process.argv.includes('--tests'),
      quick: process.argv.includes('--quick'),
      verbose: process.argv.includes('--verbose'),
    };
    
    this.results = {
      build: null,
      tests: null,
      lint: null,
      typecheck: null,
      files: [],
      qualityScore: 0,
      timestamp: new Date().toISOString()
    };
    
    this.redFlags = [];
  }

  /**
   * Exécuter une commande et capturer la sortie complète
   */
  async executeCommand(command, description) {
    const spinner = ora(description).start();
    
    try {
      const startTime = Date.now();
      const { stdout, stderr } = await execAsync(command, { 
        maxBuffer: 1024 * 1024 * 10 // 10MB buffer
      });
      const duration = Date.now() - startTime;
      
      spinner.succeed(`${description} (${duration}ms)`);
      
      if (this.options.verbose) {
        console.log(chalk.gray('Output:'), stdout.substring(0, 500));
      }
      
      return {
        success: true,
        stdout,
        stderr,
        duration,
        command
      };
    } catch (error) {
      spinner.fail(`${description} FAILED`);
      
      this.redFlags.push({
        type: 'command_failure',
        command,
        error: error.message
      });
      
      return {
        success: false,
        stdout: error.stdout || '',
        stderr: error.stderr || error.message,
        error: error.message,
        command
      };
    }
  }

  /**
   * Valider la construction du projet
   */
  async validateBuild() {
    console.log(chalk.blue('\n📦 Validation Build...'));
    
    // Vérifier package.json
    if (!existsSync('./package.json')) {
      this.redFlags.push({
        type: 'missing_file',
        file: 'package.json',
        severity: 'critical'
      });
      return false;
    }
    
    // Essayer pnpm d'abord, puis npm
    let buildCommand = 'pnpm run build';
    if (!existsSync('./pnpm-lock.yaml')) {
      buildCommand = 'npm run build';
    }
    
    const result = await this.executeCommand(
      buildCommand,
      'Building project'
    );
    
    this.results.build = result;
    
    // Vérifier les patterns suspects
    if (result.stdout && result.stdout.includes('warning')) {
      this.redFlags.push({
        type: 'build_warnings',
        count: (result.stdout.match(/warning/gi) || []).length
      });
    }
    
    return result.success;
  }

  /**
   * Valider les tests
   */
  async validateTests() {
    console.log(chalk.blue('\n🧪 Validation Tests...'));
    
    const testCommand = existsSync('./pnpm-lock.yaml') 
      ? 'pnpm run test --passWithNoTests'
      : 'npm run test --passWithNoTests';
    
    const result = await this.executeCommand(
      testCommand,
      'Running tests'
    );
    
    this.results.tests = result;
    
    // Analyser les résultats de test
    if (result.stdout) {
      const passMatch = result.stdout.match(/(\d+) passed/);
      const failMatch = result.stdout.match(/(\d+) failed/);
      
      if (failMatch && parseInt(failMatch[1]) > 0) {
        this.redFlags.push({
          type: 'failing_tests',
          count: parseInt(failMatch[1]),
          severity: 'critical'
        });
      }
    }
    
    return result.success;
  }

  /**
   * Valider le linting
   */
  async validateLinting() {
    console.log(chalk.blue('\n🔍 Validation Linting...'));
    
    const lintCommand = existsSync('./pnpm-lock.yaml')
      ? 'pnpm run lint'
      : 'npm run lint';
    
    const result = await this.executeCommand(
      lintCommand,
      'Checking code style'
    );
    
    this.results.lint = result;
    
    // Vérifier les erreurs de lint
    if (result.stderr && result.stderr.includes('error')) {
      const errorCount = (result.stderr.match(/error/gi) || []).length;
      this.redFlags.push({
        type: 'lint_errors',
        count: errorCount,
        severity: 'high'
      });
    }
    
    return result.success;
  }

  /**
   * Valider le type checking (TypeScript)
   */
  async validateTypeCheck() {
    console.log(chalk.blue('\n📐 Validation Types...'));
    
    // Vérifier si c'est un projet TypeScript
    if (!existsSync('./tsconfig.json')) {
      console.log(chalk.gray('Pas de tsconfig.json, skip type checking'));
      return true;
    }
    
    const typeCommand = existsSync('./pnpm-lock.yaml')
      ? 'pnpm run typecheck || pnpm tsc --noEmit'
      : 'npm run typecheck || npx tsc --noEmit';
    
    const result = await this.executeCommand(
      typeCommand,
      'Type checking'
    );
    
    this.results.typecheck = result;
    
    if (!result.success) {
      const errorMatch = result.stderr.match(/Found (\d+) error/);
      if (errorMatch) {
        this.redFlags.push({
          type: 'type_errors',
          count: parseInt(errorMatch[1]),
          severity: 'critical'
        });
      }
    }
    
    return result.success;
  }

  /**
   * Vérifier les fichiers récemment modifiés
   */
  async validateFiles() {
    console.log(chalk.blue('\n📁 Validation Fichiers...'));
    
    const result = await this.executeCommand(
      'git status --porcelain || ls -la',
      'Checking modified files'
    );
    
    if (result.stdout) {
      const lines = result.stdout.split('\n').filter(l => l.trim());
      this.results.files = lines.map(line => {
        const match = line.match(/^\s*[AM]\s+(.+)$/);
        return match ? match[1] : line;
      }).filter(Boolean);
      
      console.log(chalk.green(`✓ ${this.results.files.length} fichiers modifiés détectés`));
    }
    
    return true;
  }

  /**
   * Calculer le score de qualité
   */
  calculateQualityScore() {
    let score = 10;
    
    // Déductions basées sur les résultats
    if (!this.results.build?.success) score -= 3;
    if (!this.results.tests?.success) score -= 2;
    if (!this.results.lint?.success) score -= 1.5;
    if (!this.results.typecheck?.success) score -= 1.5;
    
    // Déductions pour red flags
    this.redFlags.forEach(flag => {
      switch (flag.severity) {
        case 'critical': score -= 1; break;
        case 'high': score -= 0.5; break;
        case 'medium': score -= 0.25; break;
      }
    });
    
    // Bonus pour performance
    if (this.results.build?.duration < 5000) score += 0.5;
    if (this.results.tests?.duration < 10000) score += 0.5;
    
    this.results.qualityScore = Math.max(0, Math.min(10, score));
  }

  /**
   * Générer le rapport final
   */
  generateReport() {
    console.log(chalk.yellow('\n' + '='.repeat(60)));
    console.log(chalk.yellow.bold('📊 RAPPORT DE VALIDATION ZERO TRUST'));
    console.log(chalk.yellow('='.repeat(60)));
    
    // Résumé des validations
    console.log(chalk.white('\n📋 Résultats:'));
    console.log(this.results.build?.success 
      ? chalk.green('✅ Build: SUCCESS') 
      : chalk.red('❌ Build: FAILED'));
    console.log(this.results.tests?.success 
      ? chalk.green('✅ Tests: SUCCESS') 
      : chalk.red('❌ Tests: FAILED'));
    console.log(this.results.lint?.success 
      ? chalk.green('✅ Linting: SUCCESS') 
      : chalk.red('❌ Linting: FAILED'));
    console.log(this.results.typecheck !== null 
      ? (this.results.typecheck.success 
        ? chalk.green('✅ TypeCheck: SUCCESS') 
        : chalk.red('❌ TypeCheck: FAILED'))
      : chalk.gray('⏭️  TypeCheck: SKIPPED'));
    
    // Score de qualité
    console.log(chalk.white('\n🎯 Score de Qualité:'));
    const scoreColor = this.results.qualityScore >= 8 ? 'green' 
      : this.results.qualityScore >= 6 ? 'yellow' 
      : 'red';
    console.log(chalk[scoreColor].bold(`   ${this.results.qualityScore.toFixed(1)}/10`));
    
    // Red Flags
    if (this.redFlags.length > 0) {
      console.log(chalk.red('\n🚩 Signaux d\'Alarme Détectés:'));
      this.redFlags.forEach(flag => {
        const icon = flag.severity === 'critical' ? '🔴' 
          : flag.severity === 'high' ? '🟠' 
          : '🟡';
        console.log(`  ${icon} ${flag.type}: ${JSON.stringify(flag)}`);
      });
    }
    
    // Recommandations
    console.log(chalk.cyan('\n💡 Recommandations:'));
    if (!this.results.build?.success) {
      console.log('  • Corriger les erreurs de build en priorité');
    }
    if (!this.results.tests?.success) {
      console.log('  • Faire passer tous les tests avant de continuer');
    }
    if (this.results.qualityScore < 7) {
      console.log('  • Le score de qualité est trop bas, révision nécessaire');
    }
    
    // Verdict final
    console.log(chalk.yellow('\n' + '='.repeat(60)));
    const passed = this.options.strict 
      ? this.results.qualityScore >= 8 
      : this.results.qualityScore >= 6;
    
    if (passed) {
      console.log(chalk.green.bold('✅ VALIDATION RÉUSSIE - Preuves fournies'));
    } else {
      console.log(chalk.red.bold('❌ VALIDATION ÉCHOUÉE - Corrections requises'));
      console.log(chalk.red('Ne PAS affirmer que "tout fonctionne" !'));
    }
    console.log(chalk.yellow('='.repeat(60) + '\n'));
    
    // Sauvegarder le rapport
    this.saveReport();
    
    return passed;
  }

  /**
   * Sauvegarder le rapport dans un fichier JSON
   */
  saveReport() {
    const reportFile = `validation-report-${Date.now()}.json`;
    const report = {
      ...this.results,
      redFlags: this.redFlags,
      options: this.options,
      passed: this.results.qualityScore >= (this.options.strict ? 8 : 6)
    };
    
    try {
      require('fs').writeFileSync(
        reportFile,
        JSON.stringify(report, null, 2)
      );
      console.log(chalk.gray(`Rapport sauvegardé: ${reportFile}`));
    } catch (error) {
      console.log(chalk.gray('Impossible de sauvegarder le rapport'));
    }
  }

  /**
   * Exécuter la validation complète
   */
  async run() {
    console.log(chalk.cyan.bold('\n🛡️  ZERO TRUST VALIDATOR'));
    console.log(chalk.cyan('Validation avec philosophie Confiance Zéro\n'));
    
    try {
      // Validations selon les options
      if (!this.options.testsOnly) {
        await this.validateBuild();
      }
      
      if (!this.options.buildOnly) {
        await this.validateTests();
      }
      
      if (!this.options.quick && !this.options.buildOnly && !this.options.testsOnly) {
        await this.validateLinting();
        await this.validateTypeCheck();
        await this.validateFiles();
      }
      
      // Calculer le score et générer le rapport
      this.calculateQualityScore();
      const passed = this.generateReport();
      
      // Exit code approprié
      process.exit(passed ? 0 : 1);
      
    } catch (error) {
      console.error(chalk.red('Erreur fatale:'), error);
      process.exit(1);
    }
  }
}

// Lancer si exécuté directement
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new ZeroTrustValidator();
  validator.run();
}

export default ZeroTrustValidator;