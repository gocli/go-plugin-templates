const mockFs = (() => {
  const fs = {
    outputFile: jest.fn(),
    outputFileSync: jest.fn()
  }
  return fs
})()
jest.mock('fs-extra', () => mockFs)

const { createTemplate } = require('../lib/create-template')

beforeEach(() => {
  mockFs.outputFile.mockResolvedValue()
})

afterEach(() => {
  mockFs.outputFile.mockReset()
  mockFs.outputFileSync.mockReset()
})

describe('Create Template', () => {
  it('generates object with specific API', () => {
    expect(() => createTemplate()).toThrowError('template argument should be a string')
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

    expect(createTemplate('<%= "AC & DC" %>', {
      escape: (str) => str.replace('&', '&amp;')
    }).render()).toBe('AC &amp; DC', 'uses a function to escape')
  })

  it('can write rendered templates', () => {
    expect(() => createTemplate('').write()).toThrowError(/path/i)
    expect(() => createTemplate('').write.sync()).toThrowError(/path/i)

    const content = 'hello'

    return Promise.all([
      createTemplate(content, { filename: 'file1' }).write({}),
      createTemplate(content, { filename: 'file2' }).write.sync({}),
      createTemplate(content, { filename: 'fileA' }).write({}, 'file3'),
      createTemplate(content, { filename: 'fileB' }).write.sync({}, 'file4'),
      createTemplate(content).write({}, 'file5'),
      createTemplate(content).write.sync({}, 'file6')
    ]).then(() => {
      expect(mockFs.outputFile).toHaveBeenCalledWith('file1', content)
      expect(mockFs.outputFileSync).toHaveBeenCalledWith('file2', content)
      expect(mockFs.outputFile).toHaveBeenCalledWith('file3', content)
      expect(mockFs.outputFileSync).toHaveBeenCalledWith('file4', content)
      expect(mockFs.outputFile).toHaveBeenCalledWith('file5', content)
      expect(mockFs.outputFileSync).toHaveBeenCalledWith('file6', content)
    })
  })

  it('uses predefined resolve option', () => {
    const content = 'hello'

    return Promise.all([
      createTemplate(content, { resolve: 'dir/file1' }).write({}),
      createTemplate(content, { resolve: 'dir/file2' }).write.sync({}),
      createTemplate(content, { resolve: () => 'dir/file3' }).write({}),
      createTemplate(content, { resolve: () => 'dir/file4' }).write.sync({}),
      createTemplate(content, { resolve: 'dir/<%= base %>', filename: 'dir/inner/file5' }).write({}),
      createTemplate(content, { resolve: 'dir/<%= base %>', filename: 'dir/inner/file6' }).write.sync({}),
      createTemplate(content, { resolve: ({ base }) => `dir/${base}`, filename: 'dir/inner/file7' }).write({}),
      createTemplate(content, { resolve: ({ base }) => `dir/${base}`, filename: 'dir/inner/file8' }).write.sync({})
    ]).then(() => {
      expect(mockFs.outputFile).toHaveBeenCalledWith('dir/file1', content)
      expect(mockFs.outputFileSync).toHaveBeenCalledWith('dir/file2', content)
      expect(mockFs.outputFile).toHaveBeenCalledWith('dir/file3', content)
      expect(mockFs.outputFileSync).toHaveBeenCalledWith('dir/file4', content)
      expect(mockFs.outputFile).toHaveBeenCalledWith('dir/file5', content)
      expect(mockFs.outputFileSync).toHaveBeenCalledWith('dir/file6', content)
      expect(mockFs.outputFile).toHaveBeenCalledWith('dir/file7', content)
      expect(mockFs.outputFileSync).toHaveBeenCalledWith('dir/file8', content)
    })
  })

  it('fails if destination can not be computed', () => {
    expect(() => createTemplate('').write({}, '<%=')).toThrow()
    expect(() => createTemplate('').write.sync({}, '<%=')).toThrow()
    expect(() => createTemplate('', { filename: '' }).write()).toThrow()
    expect(() => createTemplate('', { filename: '' }).write.sync()).toThrow()
  })

  it('fails if destination is a folder', () => {
    const destPath = 'dir'

    const fsEisdirError = new Error(`EISDIR: illegal operation on a directory, open '${destPath}'`)
    mockFs.outputFile.mockRejectedValue(fsEisdirError)
    mockFs.outputFileSync.mockImplementation(() => { throw fsEisdirError })

    expect(
      () => createTemplate('halo', { filename: 'd/given-name-test-4' }).write.sync({}, destPath)
    ).toThrowError(/folder/i)

    return expect(
      createTemplate('halo', { filename: 'd/given-name-test-3' }).write({}, destPath)
    ).rejects.toThrowError(/folder/i)
  })

  it('fails if error happens during write operation', () => {
    const destPath = 'dir'

    const fsError = new Error('some casual error')
    mockFs.outputFile.mockRejectedValue(fsError)
    mockFs.outputFileSync.mockImplementation(() => { throw fsError })

    expect(
      () => createTemplate('halo', { filename: 'd/given-name-test-4' }).write.sync({}, destPath)
    ).toThrow()

    return expect(
      createTemplate('halo', { filename: 'd/given-name-test-3' }).write({}, destPath)
    ).rejects.toThrow()
  })
})
