const plugin = require('../src/plugin.ts')

describe('Plugin', () => {
  it('exists', () => {
    expect(typeof plugin.install).toBe('function')
    expect(typeof plugin.TemplatesPlugin).toBe('function')
    expect(plugin.install).toBe(plugin.TemplatesPlugin)
    expect(plugin.install).not.toThrow()
  })
})
