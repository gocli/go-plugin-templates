const { createTemplate } = require('../src/create-template')

describe('Create Template', () => {
  it('generates function with one string argument required', () => {
    expect(() => createTemplate()).toThrowError(/required/i, 'should contain "required"')
    expect(() => createTemplate(1)).toThrowError(/string/i, 'should contain "string"')
    const template = createTemplate('')
    expect(typeof template).toBe('function')
    expect(template()).toBe('')
  })
})
