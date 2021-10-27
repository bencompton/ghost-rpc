module.exports = {
  "moduleFileExtensions": [
    "js",
    "ts",
    "tsx"
  ],
  "moduleNameMapper": {    
    "^.+\\.(css|less)$": "<rootDir>/test-run-utils/ReactComponentMock",
    "^.+\\.(gif|ttf|eot|svg|png)$": "<rootDir>/test-run-utils/ReactComponentMock"
  },
  "setupFiles": [
    "./test-run-utils/MockBrowserEnvironment"
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
