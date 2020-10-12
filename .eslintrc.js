module.exports = {
  parser:  '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends:  [
    'plugin:prettier/recommended',
  ],
  parserOptions:  {
    ecmaVersion:  2018,
    sourceType:  'module',
  },
};
