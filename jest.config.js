export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Use ts-jest to transpile TypeScript files
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS imports
  },
  transformIgnorePatterns: ['node_modules/(?!(module-to-transform)/)'], // Adjust if specific node_modules need transformation
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json', // Ensure ts-jest uses the correct TypeScript config
    }
  },
};