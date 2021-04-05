module.exports = {  
  preset: "jest-puppeteer",
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  verbose: true,
  rootDir: '../source-code/automated-scenarios/.',
  setupFilesAfterEnv: ['<rootDir>/jest-timeout.js']
}