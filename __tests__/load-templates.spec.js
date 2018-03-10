const { loadTemplates } = require('../src/load-templates')

describe('Load Templates', () => {
  it('is a function that returns a promise', () => {
    expect(typeof loadTemplates).toBe('function')
    const result = loadTemplates()
    expect(result).toBeInstanceOf(Promise)
  })
})
