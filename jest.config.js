export default {
  transform: {
    '.ts': 'ts-jest',
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  testRegex: '(/test/.*|\\.(test|spec))\\.(ts)$',
  moduleFileExtensions: ['ts', 'js'],
};
