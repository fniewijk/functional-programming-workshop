module.exports = {
  clearMocks: true,
  coverageDirectory: "coverage",
  preset: 'jest-preset-typescript',
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/", "/dist/"]
};
