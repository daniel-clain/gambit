module.exports = {  
  preset: "jest-puppeteer",
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  verbose: true,
  rootDir: '../source-code/tests/gui-tests/.',
}