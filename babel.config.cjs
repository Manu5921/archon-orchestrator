/**
 * Babel Configuration for Jest Tests
 * Enables ES6 modules transpilation for Jest while preserving ESM in development
 */
module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: { node: 'current' },
      modules: 'auto' // Let Jest handle module transformation
    }]
  ],
  env: {
    test: {
      presets: [
        ['@babel/preset-env', {
          targets: { node: 'current' },
          modules: 'commonjs' // Transform to CommonJS for Jest
        }]
      ]
    }
  }
};