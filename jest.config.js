module.exports = {
  verbose: true,
  testRegex: '(/__tests__/.*(\\.|/)(test|spec))\\.js$',
  testURL: 'http://localhost',
  collectCoverageFrom: ['lib/**/*'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 0
    }
  }
}
