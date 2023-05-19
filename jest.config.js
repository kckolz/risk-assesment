// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: false,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: ["/node_modules/"],

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: ["json", "text", "lcov", "clover"],

  // Use this configuration option to add custom reporters to Jest
  reporters: [
    "default",
    // -- USE basic reporter
    [
      "./node_modules/jest-html-reporter",
      {
        pageTitle: "Whetstone API Tests Report",
        statusIgnoreFilter: "passed", // Will not render passing tests on the report--will only show failed tests.
        includeFailureMsg: true, // When a failed test is shown, it will also include the failure message in the report
      },
    ],
  ],

  // The test environment that will be used for testing
  testEnvironment: "node",

  // The glob patterns Jest uses to detect test files
  testMatch: [
    // "**/dist/tests/districts.test.js",
    "**/dist/tests/*.test.js",
  ],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: ["/node_modules/"],

  setupFilesAfterEnv: ["./jest.setup.js"],
};
