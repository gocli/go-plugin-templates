const plugin = require('../src/plugin')

describe('Plugin', () => {
  it('exists', () => {
    expect(typeof plugin.install).toBe('function')
    expect(typeof plugin.TemplatesPlugin).toBe('function')
    expect(plugin.install).toBe(plugin.TemplatesPlugin)
    expect(plugin.install()).toHaveProperty('createTemplate')
    expect(plugin.install()).toHaveProperty('loadTemplates')
    expect(plugin.install()).toHaveProperty('processTemplate')
    expect(() => plugin.install({})).not.toThrow()
  })

  it('can extend object with API methods', () => {
    const obj = {}
    plugin.install(obj)

    expect(typeof obj.createTemplate).toBe('function')
    expect(typeof obj.loadTemplates).toBe('function')
    expect(typeof obj.processTemplate).toBe('function')
  })
})
