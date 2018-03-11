const { createTemplate } = require('../src/create-template')
const fs = require('fs')

const tempDir = `${__dirname}/temp-createTemplate-files`

describe('Create Template', () => {
  afterAll(() => {
    fs.removeSync(tempDir)
  })

  it('generates object with specific API', () => {
    expect(() => createTemplate()).toThrowError(/required/i, 'should contain "required"')
    expect(() => createTemplate(1)).toThrowError(/string/i, 'should contain "string"')
    const template = createTemplate('')
    expect(typeof template.getSource).toBe('function')
    expect(typeof template.render).toBe('function')
    expect(typeof template.write).toBe('function')
    expect(typeof template.write.sync).toBe('function')
  })

  it('renders normal string', () => {
    expect(createTemplate('').render()).toBe('')
    expect(createTemplate('hello').render()).toBe('hello')
    expect(createTemplate('\nhello\n').render()).toBe('\nhello\n')
  })

  it('process embeded JS', () => {
    expect(createTemplate('<%= "hel" + "lo" %>').render()).toBe('hello')
    expect(createTemplate('<% [1,2,3].map(v => { %> <%= v %> <% }) %>').render()).toBe(' 1  2  3 ')
  })

  it('exposes context to template while rendering', () => {
    const context = { name: 'User' }
    expect(createTemplate('Name: <%= name %>').render(context)).toBe('Name: User')
  })

  it('escapes when needed', () => {
    expect(createTemplate('<%= "<i></i>" %>').render())
      .toBe('<i></i>', 'does not escape by default')

    expect(createTemplate('<%= "<i></i>" %>', { escape: true }).render())
      .toBe('&lt;i&gt;&lt;/i&gt;', 'escape XML if option is true')

    expect(createTemplate('<%= "AC & DC" %>', {
      escape: (str) => str.replace('&', '&amp;')
    }).render()).toBe('AC &amp; DC', 'uses a function to escape')
  })

  it('can write rendered templates', async () => {
    expect(() => createTemplate('').write()).toThrowError(/path/)

    const filename = `${tempDir}/async-tempalte-rendering`
    const customFilename = `${filename}-custom`
    const template = createTemplate('hello', { filename })

    await template.write({})
    expect(fs.readFileSync(filename).toString()).toBe('hello')

    await template.write({}, customFilename)
    expect(fs.readFileSync(customFilename).toString()).toBe('hello')
  })

  it('write file synchonously', () => {
    expect(() => createTemplate('').write.sync()).toThrowError(/path/)

    const filename = `${tempDir}/sync-template-rendering`
    const customFilename = `${filename}-custom`
    const template = createTemplate('halo', { filename })

    template.write.sync({})
    expect(fs.readFileSync(filename).toString()).toBe('halo')

    template.write.sync({}, customFilename)
    expect(fs.readFileSync(customFilename).toString()).toBe('halo')
  })
})
