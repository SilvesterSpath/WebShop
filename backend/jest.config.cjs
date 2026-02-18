/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.test.js', '**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/', '/frontend/'],
  moduleFileExtensions: ['js', 'mjs'],
  transform: {},
  testTimeout: 30000,
};
