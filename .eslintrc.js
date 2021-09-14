module.exports = {
  root: true,
  extends: ['@luozhu/eslint-config-typescript'],
  rules: {
    'no-useless-constructor': 0,
    'no-param-reassign': 0,
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
  ignorePatterns: ['out'],
};
