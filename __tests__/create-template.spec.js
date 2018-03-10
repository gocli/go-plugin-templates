const { createTemplate } = require('../src/create-template')
const fs = require('fs')

const tempDir = `${__dirname}/temp-createTemplate-files`

describe('Create Template', () => {
  afterAll(() => {
    fs.removeSync(tempDir)
  })

  it('generates function with one string argument required', () => {
    expect(() => createTemplate()).toThrowError(/required/i, 'should contain "required"')
    expect(() => createTemplate(1)).toThrowError(/string/i, 'should contain "string"')
    const render = createTemplate('')
    expect(typeof render).toBe('function')
    expect(render()).toBe('')
  })

  it('process embeded JS', () => {
    const render = createTemplate('<%= "hel" + "lo" %>')
    expect(render()).toBe('hello')
  })

  it('exposes context to template while rendering', () => {
    const context = { name: 'User' }
    const render = createTemplate('Name: <%= name %>')
    expect(render(context)).toBe('Name: User')
  })

  it('escapes when needed', () => {
    expect(createTemplate('<%= "<i></i>" %>')())
      .toBe('<i></i>', 'does not escape by default')

    expect(createTemplate('<%= "<i></i>" %>', { escape: true })())
      .toBe('&lt;i&gt;&lt;/i&gt;', 'escape XML if option is true')

    expect(createTemplate('<%= "AC & DC" %>', {
      escape: (str) => str.replace('&', '&amp;')
    })()).toBe('AC &amp; DC', 'uses a function to escape')
  })

  it('write file if second argument is given', async () => {
    const filename = `${tempDir}/async-tempalte-rendering`
    const render = createTemplate('hello')

    expect(() => render({}, [])).toThrowError(/string/)

    const result = render({}, filename)
    expect(result).toBeInstanceOf(Promise)

    await result
    expect(fs.readFileSync(filename).toString()).toBe('hello')
  })

  it('write file synchonously', () => {
    const filename = `${tempDir}/sync-template-rendering`
    const render = createTemplate('halo')

    expect(() => render({}, [])).toThrowError(/string/)

    render.sync({}, filename)
    expect(fs.readFileSync(filename).toString()).toBe('halo')
  })
})
