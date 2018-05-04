export const jestConfig = {
  moduleFileExtensions: ['ts', 'tsx'],
  moduleNameMapper: {
    ['Src(.*)']: '<rootDir>/src$1',
  },
  rootDir: '../../',
  testPathIgnorePatterns: ['<rootDir>/etc/', '<rootDir>/node_modules/'],
  transform: {
    ['^.+\\.(ts|tsx)$']: '<rootDir>/etc/jest/transformer.ts',
  },
};
