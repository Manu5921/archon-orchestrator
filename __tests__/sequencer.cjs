/**
 * Custom Jest Test Sequencer
 * Ensures deterministic test execution order for consistent results
 */

const Sequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends Sequencer {
  sort(tests) {
    // Sort tests by:
    // 1. Unit tests first (utils, then core components)
    // 2. Integration tests last
    // 3. Alphabetical order within each category

    const priorities = {
      'utils': 1,
      'orchestrator': 2,
      'agents': 3,
      'mcp': 4,
      'integration': 5
    };

    return tests.sort((testA, testB) => {
      // Extract category from path
      const getCategoryPriority = (path) => {
        for (const [category, priority] of Object.entries(priorities)) {
          if (path.includes(category)) {
            return priority;
          }
        }
        return 999; // Unknown category goes last
      };

      const priorityA = getCategoryPriority(testA.path);
      const priorityB = getCategoryPriority(testB.path);

      // First sort by priority
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      // Then sort alphabetically
      return testA.path.localeCompare(testB.path);
    });
  }
}

module.exports = CustomSequencer;
