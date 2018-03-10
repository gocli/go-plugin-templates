const { processTemplate } = require('../src/process-template')

describe('Process Template', () => {
  it('is a function that returns a promise', () => {
    expect(typeof processTemplate).toBe('function')
    const result = processTemplate()
    expect(result).toBeInstanceOf(Promise)
  })
})
