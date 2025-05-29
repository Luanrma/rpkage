// // jest.config.js
// const nextJest = require('next/jest');

// const createJestConfig = nextJest({
//   dir: './',
// });

// const customJestConfig = {
//   setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
//   testEnvironment: 'jest-environment-jsdom',
// };

// export default {
//   preset: 'ts-jest',
//   testEnvironment: 'jsdom',
//   transform: {
//     '^.+\\.(ts|tsx)$': 'ts-jest',
//   },
//   moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
//   setupFilesAfterEnv: ['./src/jest.setup.ts'],
// };

// module.exports = createJestConfig(customJestConfig);

import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/src/app/components/$1',
    '^@/app/(.*)$': '<rootDir>/src/app/$1',
    '^@/contexts/(.*)$': '<rootDir>/src/app/contexts/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/app/hooks/$1',
  },
};

export default createJestConfig(customJestConfig);
