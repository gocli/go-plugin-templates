const mockFs = (() => {
  const fs = {
    outputFile: jest.fn(),
    outputFileSync: jest.fn()
  }
  return fs
})()
jest.mock('fs-extra', () => mockFs)

const { createTemplate } = require('../src/create-template')

beforeEach(() => {
  mockFs.outputFile.mockResolvedValue()
})

afterEach(() => {
  mockFs.outputFile.mockReset()
  mockFs.outputFileSync.mockReset()
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

    const filename = 'dir/file'
    const customFilename = `${filename}-custom`
    const content = 'hello'
    const template = createTemplate(content, { filename })

    await template.write({})
    expect(mockFs.outputFile).toHaveBeenLastCalledWith(filename, content)

    template.write.sync({})
    expect(mockFs.outputFileSync).toHaveBeenLastCalledWith(filename, content)

    await template.write({}, customFilename)
    expect(mockFs.outputFile).toHaveBeenLastCalledWith(customFilename, content)

    template.write.sync({}, customFilename)
    expect(mockFs.outputFileSync).toHaveBeenLastCalledWith(customFilename, content)

    await createTemplate(content).write({}, customFilename)
    expect(mockFs.outputFile).toHaveBeenLastCalledWith(customFilename, content)

    createTemplate(content).write.sync({}, customFilename)
    expect(mockFs.outputFileSync).toHaveBeenLastCalledWith(customFilename, content)
  })

  it('fails if destination can not be computed', () => {
    expect(() => createTemplate('').write({}, '<%=')).toThrow()
    expect(() => createTemplate('').write.sync({}, '<%=')).toThrow()
    expect(() => createTemplate('', { filename: '' }).write()).toThrow()
    expect(() => createTemplate('', { filename: '' }).write.sync()).toThrow()
  })

  it('fails if destination is a folder', async () => {
    const dirName = 'dir'

    const fsEisdirError = new Error(`EISDIR: illegal operation on a directory, open '${dirName}'`)
    mockFs.outputFile.mockRejectedValue(fsEisdirError)
    mockFs.outputFileSync.mockImplementation(() => { throw fsEisdirError })

    await expect(
      createTemplate('halo', { filename: 'd/given-name-test-3' }).write({}, dirName)
    ).rejects.toThrowError(/folder/i)

    expect(
      () => createTemplate('halo', { filename: 'd/given-name-test-4' }).write.sync({}, dirName)
    ).toThrowError(/folder/i)

    const fsError = new Error('some casual error')
    mockFs.outputFile.mockRejectedValue(fsError)
    mockFs.outputFileSync.mockImplementation(() => { throw fsError })

    await expect(
      createTemplate('halo', { filename: 'd/given-name-test-3' }).write({}, dirName)
    ).rejects.toThrow()

    expect(
      () => createTemplate('halo', { filename: 'd/given-name-test-4' }).write.sync({}, dirName)
    ).toThrow()
  })
})
