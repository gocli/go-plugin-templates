const { createTemplate } = require('../src/create-template')
const fs = require('fs-extra')

const tempDir = 'temp-createTemplate-files'

let cwd

beforeAll(() => {
  fs.ensureDirSync(`${__dirname}/${tempDir}`)
  cwd = process.cwd()
  process.chdir(`${__dirname}/${tempDir}`)
})

afterAll(() => {
  process.chdir(cwd)
  fs.removeSync(`${__dirname}/${tempDir}`)
})

describe('Create Template', () => {
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
    expect(() => createTemplate('').write()).toThrowError(/path/i)
    expect(() => createTemplate('').write.sync()).toThrowError(/path/i)

    const filename = `${tempDir}/tempalte-rendering`
    const customFilename = `${filename}-custom`
    const template = createTemplate('hello', { filename })

    await template.write({})
    expect(fs.readFileSync(filename).toString()).toBe('hello')

    template.write.sync({})
    expect(fs.readFileSync(filename).toString()).toBe('hello')

    await template.write({}, customFilename)
    expect(fs.readFileSync(customFilename).toString()).toBe('hello')

    template.write.sync({}, customFilename)
    expect(fs.readFileSync(customFilename).toString()).toBe('hello')
  })

  it('write file with a given name', async () => {
    await createTemplate('halo', { filename: 'given-name-test-1' }).write({})
    expect(fs.readFileSync('given-name-test-1').toString()).toBe('halo')

    createTemplate('halo', { filename: 'given-name-test-2' }).write.sync({})
    expect(fs.readFileSync('given-name-test-2').toString()).toBe('halo')

    await createTemplate('halo', { filename: 'd/given-name-test-3' }).write({}, 'given-name-custom-dir/')
    expect(fs.readFileSync('given-name-custom-dir/d/given-name-test-3').toString()).toBe('halo')

    createTemplate('halo', { filename: 'd/given-name-test-4' }).write.sync({}, 'given-name-custom-dir/')
    expect(fs.readFileSync('given-name-custom-dir/d/given-name-test-4').toString()).toBe('halo')
  })

  it('fails if destination is a folder', async () => {
    fs.ensureDirSync('predefined-folder')

    await expect(
      createTemplate('halo', { filename: 'd/given-name-test-3' }).write({}, 'predefined-folder')
    ).rejects.toThrowError(/folder/i)

    expect(
      () => createTemplate('halo', { filename: 'd/given-name-test-4' }).write.sync({}, 'predefined-folder')
    ).toThrowError(/folder/i)
  })

  it('fails if destination can not be computed', () => {
    expect(() => createTemplate('').write({}, '<%=')).toThrow()
    expect(() => createTemplate('').write.sync({}, '<%=')).toThrow()
    expect(() => createTemplate('', { filename: '' }).write()).toThrow()
    expect(() => createTemplate('', { filename: '' }).write.sync()).toThrow()
  })
})
