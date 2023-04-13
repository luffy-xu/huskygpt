import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  preset: 'ts-jest',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  // only src files are tested
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  maxWorkers: 1,
  rootDir: './',
};

export default config;
