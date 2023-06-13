module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
    jest: true,
  },
  extends: 'airbnb-base',
  overrides: [
    {
      files: ['**/*.test.js', '**/*.spec.js'], // Add file patterns for test files
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 2021,
  },
  rules: {
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  },
};
