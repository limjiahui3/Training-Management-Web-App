export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", {
      tsconfig: "tsconfig.json", // Point to your root tsconfig
      useESM: true,
      jsx: "react-jsx"
    }],
    "^.+\\.jsx?$": "babel-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  transformIgnorePatterns: [
    "/node_modules/(?!(@testing-library|axios)/)"
  ],
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      useESM: true,
    },
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
};