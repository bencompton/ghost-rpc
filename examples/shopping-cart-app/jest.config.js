module.exports = {
  "moduleFileExtensions": [
    "js",
    "ts",
    "tsx"
  ],
  "moduleNameMapper": {
    "^.+\\.(css|less)$": "<rootDir>/specs/test-run-utils/ReactComponentMock",
    "^.+\\.(gif|ttf|eot|svg|png)$": "<rootDir>/specs/test-run-utils/ReactComponentMock"
  },
  "setupFiles": [
    "./specs/test-run-utils/MockBrowserEnvironment"
  ],
  "testMatch": [
    "**/*.spec.ts",
    "**/*.steps.ts"
  ],
  "testURL": "http://localhost/",    
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  }    
};
