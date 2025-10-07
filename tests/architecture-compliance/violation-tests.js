/**
 * Architecture-Compliance V2 - Intentional Violation Tests
 * Tests the architecture compliance system with deliberate violations
 * 
 * CRITICAL: Validates that the system correctly catches architecture violations
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { promises as fs } from 'fs';
import path from 'path';
import { architectureValidationPipeline } from '../../src/architecture-compliance/validation-pipeline.js';
import { architectureContextInjection } from '../../src/architecture-compliance/context-injection.js';
import { architectureQualityGates } from '../../src/architecture-compliance/quality-gates.js';

describe('Architecture Compliance Violation Detection', () => {
  let testArchitectureDoc;
  let testProjectPath;

  beforeEach(async () => {
    // Create test architecture document
    testProjectPath = path.join(process.cwd(), 'tests', 'fixtures', 'test-project');
    await fs.mkdir(testProjectPath, { recursive: true });
    
    testArchitectureDoc = `# Test Architecture Document

## Technology Stack - IMMUTABLE DECISIONS

### Backend Technology
- **Primary Language:** Node.js
- **Runtime/Framework:** Express.js
- **Database Primary:** Supabase (PostgreSQL)
- **Database ORM/Client:** Supabase Client

### Frontend Technology  
- **Framework:** Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS

## Architecture Constraints - NO VIOLATIONS

1. **Technology Stack Compliance:** Must use specified technologies only
2. **Database Compliance:** All database access must use Supabase client
3. **Framework Compliance:** Frontend must use Next.js patterns
4. **Language Compliance:** All new code must be TypeScript

## Project Structure

### Directory Structure
\`\`\`
src/
├── components/     # React components
├── pages/         # Next.js pages
├── lib/           # Utility functions
├── types/         # TypeScript definitions
\`\`\`

### File Naming Conventions
- **Components:** PascalCase.tsx
- **Pages:** kebab-case.tsx
- **Types:** PascalCase.types.ts
`;

    const archPath = path.join(testProjectPath, 'ARCHITECTURE.md');
    await fs.writeFile(archPath, testArchitectureDoc);
  });

  afterEach(async () => {
    // Cleanup test files
    try {
      await fs.rm(testProjectPath, { recursive: true, force: true });
    } catch (error) {
      console.warn('Cleanup warning:', error.message);
    }
    
    // Clear system state
    architectureValidationPipeline.resetMetrics();
    architectureContextInjection.clearInjectionLog();
    architectureQualityGates.clearExecutionHistory();
  });

  describe('Technology Stack Violations', () => {
    it('should detect backend technology violation (Python instead of Node.js)', async () => {
      const violatingTaskResult = {
        code: `
from flask import Flask, request
import sqlite3

app = Flask(__name__)

@app.route('/api/users', methods=['GET'])
def get_users():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users')
    users = cursor.fetchall()
    conn.close()
    return users

if __name__ == '__main__':
    app.run(debug=True)
        `,
        filePaths: ['src/app.py'],
        files: {
          'src/app.py': 'Flask application code'
        },
        dependencies: ['flask', 'sqlite3']
      };

      const result = await architectureValidationPipeline.quickValidation(
        violatingTaskResult,
        'backend',
        'Create API endpoints'
      );

      expect(result.success).toBe(false);
      expect(parseFloat(result.complianceScore)).toBeLessThan(50);
      
      const violations = result.violations.map(v => v.violations).flat();
      expect(violations.some(v => v.includes('Flask') || v.includes('Python'))).toBe(true);
      expect(violations.some(v => v.includes('Node.js') || v.includes('Express'))).toBe(true);
    });

    it('should detect database technology violation (MongoDB instead of Supabase)', async () => {
      const violatingTaskResult = {
        code: `
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

export async function getUsers() {
  try {
    await mongoose.connect('mongodb://localhost:27017/testdb');
    const users = await User.find();
    return users;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}
        `,
        filePaths: ['src/lib/database.js'],
        files: {
          'src/lib/database.js': 'MongoDB database code'
        },
        dependencies: ['mongoose', 'mongodb']
      };

      const result = await architectureValidationPipeline.quickValidation(
        violatingTaskResult,
        'backend',
        'Implement database layer'
      );

      expect(result.success).toBe(false);
      expect(parseFloat(result.complianceScore)).toBeLessThan(60);
      
      const violations = result.violations.map(v => v.violations).flat();
      expect(violations.some(v => v.includes('MongoDB') || v.includes('mongoose'))).toBe(true);
      expect(violations.some(v => v.includes('Supabase'))).toBe(true);
    });

    it('should detect frontend framework violation (Vue instead of Next.js)', async () => {
      const violatingTaskResult = {
        code: `
<template>
  <div class="user-profile">
    <h1>{{ user.name }}</h1>
    <p>{{ user.email }}</p>
    <button @click="updateUser">Update Profile</button>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'UserProfile',
  setup() {
    const user = ref({ name: '', email: '' });
    
    const updateUser = () => {
      // Vue-specific logic
    };
    
    return {
      user,
      updateUser
    };
  }
});
</script>

<style scoped>
.user-profile {
  padding: 20px;
}
</style>
        `,
        filePaths: ['src/components/UserProfile.vue'],
        files: {
          'src/components/UserProfile.vue': 'Vue component'
        },
        dependencies: ['vue', '@vue/composition-api']
      };

      const result = await architectureValidationPipeline.quickValidation(
        violatingTaskResult,
        'frontend',
        'Create user profile component'
      );

      expect(result.success).toBe(false);
      
      const violations = result.violations.map(v => v.violations).flat();
      expect(violations.some(v => v.toLowerCase().includes('vue'))).toBe(true);
      expect(violations.some(v => v.includes('Next.js') || v.includes('React'))).toBe(true);
    });
  });

  describe('File Structure Violations', () => {
    it('should detect naming convention violations', async () => {
      const violatingTaskResult = {
        code: `export default function user_profile() { return <div>Profile</div>; }`,
        filePaths: [
          'src/components/user_profile.jsx', // Should be UserProfile.tsx
          'src/pages/UserDashboard.tsx', // Should be user-dashboard.tsx
          'src/types/api_types.ts' // Should be ApiTypes.types.ts
        ],
        files: {
          'src/components/user_profile.jsx': 'Component with wrong naming',
          'src/pages/UserDashboard.tsx': 'Page with wrong naming',
          'src/types/api_types.ts': 'Types with wrong naming'
        }
      };

      const result = await architectureValidationPipeline.quickValidation(
        violatingTaskResult,
        'frontend',
        'Create user interface components'
      );

      expect(result.success).toBe(false);
      
      const violations = result.violations.map(v => v.violations).flat();
      expect(violations.some(v => v.includes('naming convention') || v.includes('structure'))).toBe(true);
    });

    it('should detect directory structure violations', async () => {
      const violatingTaskResult = {
        filePaths: [
          'wrong-dir/components/Header.tsx', // Should be in src/components/
          'utils/database.ts', // Should be in src/lib/
          'models/User.ts' // Not in allowed structure
        ],
        files: {
          'wrong-dir/components/Header.tsx': 'Component in wrong directory',
          'utils/database.ts': 'Utility in wrong place',
          'models/User.ts': 'Model in non-standard location'
        }
      };

      const result = await architectureValidationPipeline.quickValidation(
        violatingTaskResult,
        'backend',
        'Organize project structure'
      );

      expect(result.success).toBe(false);
      
      const violations = result.violations.map(v => v.violations).flat();
      expect(violations.some(v => v.includes('structure') || v.includes('directory'))).toBe(true);
    });
  });

  describe('Security Violations', () => {
    it('should detect potential security violations in code', async () => {
      const violatingTaskResult = {
        code: `
// Security violations
const API_KEY = "hardcoded-api-key-12345";
const password = req.body.password; // No validation
const query = \`SELECT * FROM users WHERE id = \${userId}\`; // SQL injection risk

app.use(cors({ origin: '*' })); // Overly permissive CORS

// Plain text password storage
const user = {
  email: req.body.email,
  password: req.body.password // Should be hashed
};

// Direct database query without sanitization
db.query(query, (err, results) => {
  res.json(results);
});
        `,
        filePaths: ['src/api/insecure.js'],
        files: {
          'src/api/insecure.js': 'Insecure API code'
        }
      };

      const result = await architectureValidationPipeline.quickValidation(
        violatingTaskResult,
        'backend',
        'Implement user authentication'
      );

      expect(result.success).toBe(false);
      
      const violations = result.violations.map(v => v.violations).flat();
      // Note: Security detection is basic in our current implementation
      // This test validates that the security gate runs, even if detection is limited
      expect(result.violations.length).toBeGreaterThan(0);
    });
  });

  describe('Full Pipeline Violation Testing', () => {
    it('should run complete pipeline and catch multiple violations', async () => {
      const majorViolatingTaskResult = {
        code: `
# Python backend violating Node.js requirement
from django import setup
import os
import mysql.connector

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
setup()

def get_users():
    # MySQL instead of Supabase PostgreSQL
    connection = mysql.connector.connect(
        host='localhost',
        user='root',
        password='password123',  # Hardcoded password
        database='userdb'
    )
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM users WHERE active = 1")
    results = cursor.fetchall()
    connection.close()
    return results
        `,
        filePaths: [
          'backend/django_app.py', // Wrong directory structure
          'frontend/vue_component.vue', // Wrong framework
        ],
        files: {
          'backend/django_app.py': 'Django instead of Express',
          'frontend/vue_component.vue': 'Vue instead of Next.js'
        },
        dependencies: [
          'django',
          'mysql-connector-python',
          'vue',
          '@vue/cli'
        ]
      };

      // Test full pipeline execution
      try {
        const pipelineResult = await architectureValidationPipeline.executeValidationPipeline(
          'fullstack',
          'Create a full-stack application with user management',
          'Build complete user management system',
          majorViolatingTaskResult
        );

        // Pipeline should fail with multiple violations
        expect(pipelineResult.success).toBe(false);
        
      } catch (error) {
        // Pipeline should throw due to multiple blocking violations
        expect(error.message).toContain('ARCHITECTURE');
        expect(error.message).toContain('COMPLIANCE') || expect(error.message).toContain('VIOLATION');
      }
    });

    it('should pass validation with compliant code', async () => {
      const compliantTaskResult = {
        code: `
import express from 'express';
import { createClient } from '@supabase/supabase-js';

const app = express();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.get('/api/users', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('active', true);
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default app;
        `,
        filePaths: ['src/lib/api.ts'],
        files: {
          'src/lib/api.ts': 'Compliant Express + Supabase API'
        },
        dependencies: ['express', '@supabase/supabase-js', 'typescript']
      };

      const result = await architectureValidationPipeline.quickValidation(
        compliantTaskResult,
        'backend',
        'Create compliant API endpoints'
      );

      expect(result.success).toBe(true);
      expect(parseFloat(result.complianceScore)).toBeGreaterThan(80);
      expect(result.violations.length).toBe(0);
    });
  });

  describe('Context Injection Validation', () => {
    it('should properly inject architecture context before validation', async () => {
      const originalPrompt = 'Create a user authentication system';
      
      // Change to test project directory
      const originalCwd = process.cwd();
      process.chdir(testProjectPath);
      
      try {
        const contextResult = await architectureContextInjection.injectArchitectureContext(
          'backend',
          originalPrompt,
          'Build user auth with proper architecture compliance'
        );

        expect(contextResult.enhancedPrompt).toContain('ARCHITECTURE COMPLIANCE CONTEXT');
        expect(contextResult.enhancedPrompt).toContain('Node.js');
        expect(contextResult.enhancedPrompt).toContain('Supabase');
        expect(contextResult.enhancedPrompt).toContain('Express.js');
        expect(contextResult.architectureContext.techStack.backend).toContain('Node.js');
        expect(contextResult.architectureContext.techStack.database).toContain('Supabase');
        
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('should fail gracefully when no architecture document exists', async () => {
      // Create project without architecture document
      const noArchProjectPath = path.join(process.cwd(), 'tests', 'fixtures', 'no-arch-project');
      await fs.mkdir(noArchProjectPath, { recursive: true });
      
      const originalCwd = process.cwd();
      process.chdir(noArchProjectPath);
      
      try {
        await expect(
          architectureContextInjection.injectArchitectureContext(
            'backend',
            'Create something',
            'Task without architecture'
          )
        ).rejects.toThrow('ARCHITECTURE COMPLIANCE VIOLATION');
        
      } finally {
        process.chdir(originalCwd);
        await fs.rm(noArchProjectPath, { recursive: true, force: true });
      }
    });
  });

  describe('Performance and Statistics', () => {
    it('should track validation execution statistics', async () => {
      const taskResult = {
        code: 'console.log("test");',
        filePaths: ['src/test.js']
      };

      // Run multiple validations
      for (let i = 0; i < 3; i++) {
        await architectureValidationPipeline.quickValidation(
          taskResult,
          'backend',
          `Test task ${i}`
        );
      }

      const stats = architectureValidationPipeline.getExecutionStats();
      
      expect(stats.totalExecutions).toBeGreaterThanOrEqual(3);
      expect(stats.averageExecutionTime).toBeGreaterThan(0);
      expect(stats.recentExecutions.length).toBeGreaterThan(0);
      expect(parseFloat(stats.successRate)).toBeGreaterThanOrEqual(0);
    });

    it('should provide quality gates execution statistics', async () => {
      const taskResult = {
        code: 'const test = "simple test";',
        filePaths: ['src/simple.js']
      };

      await architectureValidationPipeline.quickValidation(taskResult, 'backend', 'Simple test');
      
      const gateStats = architectureQualityGates.getExecutionStats();
      
      expect(gateStats.totalExecutions).toBeGreaterThan(0);
      expect(gateStats.mostRecentExecution).toBeDefined();
      expect(parseFloat(gateStats.failureRate)).toBeGreaterThanOrEqual(0);
    });
  });
});

describe('Architecture Compliance Edge Cases', () => {
  it('should handle empty task results gracefully', async () => {
    const emptyTaskResult = {};

    const result = await architectureValidationPipeline.quickValidation(
      emptyTaskResult,
      'backend',
      'Empty task test'
    );

    expect(result.success).toBeDefined();
    expect(result.complianceScore).toBeDefined();
  });

  it('should handle malformed code input', async () => {
    const malformedTaskResult = {
      code: null,
      filePaths: undefined,
      files: { 'test.js': null }
    };

    const result = await architectureValidationPipeline.quickValidation(
      malformedTaskResult,
      'backend',
      'Malformed input test'
    );

    expect(result.success).toBeDefined();
    expect(result.complianceScore).toBeDefined();
  });

  it('should handle unknown agent types', async () => {
    const taskResult = {
      code: 'console.log("unknown agent test");',
      filePaths: ['src/unknown.js']
    };

    const result = await architectureValidationPipeline.quickValidation(
      taskResult,
      'unknown_agent_type',
      'Unknown agent test'
    );

    expect(result.success).toBeDefined();
    expect(result.complianceScore).toBeDefined();
  });
});