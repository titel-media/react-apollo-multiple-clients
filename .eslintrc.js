const path = require('path');

module.exports = {
  extends: ['airbnb', 'plugin:jest/recommended'],
  plugins: ['jest'],
  parser: 'babel-eslint',
  env: {
    browser: true,
  },
  rules: {
    'function-paren-newline': ['error', 'consistent'],
    'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/*.test.js*', 'config/**', 'tests/**'] }],
    'import/extensions': false,
    'import/no-extraneous-dependencies': 'off',
    'jest/prefer-to-have-length': 'error',
    'jest/prefer-to-be-null': 'error',
    'jest/prefer-to-be-undefined': 'error',
    'max-len': ['error', { code: 120, ignoreStrings: true, ignoreTemplateLiterals: true }],
    'no-unused-expressions': ['error', { allowTernary: true }],    
    'react/no-array-index-key': 'off',
    'curly': ['error', 'all'],
  },
  settings: {
    'import/resolver': {
      'babel-module': {
        extensions: ['.js', '.jsx'],
      },
    },
  },
};
