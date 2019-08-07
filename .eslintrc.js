const path = require('path');

module.exports = {
  extends: ['@titelmedia/eslint-config-es6', 'plugin:react/recommended', 'plugin:jest/recommended'],
  plugins: ['jest'],
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true,
    'jest/globals': true,
  },
  rules: {
    'react/display-name': 'off', // TODO: fix once hs-lint supports react config
  },
  overrides: [
    {
      files: ['**/*.test.js*', '**/*.spec.js*'],
      rules: {
        'react/prop-types': 'off',
      },
    },
  ],
  settings: {
    react: {
      version: 'detect'
    },
    'import/resolver': {
      'babel-module': {
        extensions: ['.js', '.jsx'],
      },
    },
  },
};
