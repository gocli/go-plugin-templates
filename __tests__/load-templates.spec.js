const mockFs = (() => {
  const fs = {
    readFile: jest.fn(),
    readFileSync: jest.fn(),
    outputFile: jest.fn(),
    outputFileSync: jest.fn()
  }
  return fs
})()
jest.mock('fs-extra', () => mockFs)

const mockGlobby = (() => {
  const globby = jest.fn()
  globby.sync = jest.fn()
  return globby
})()
jest.mock('globby', () => mockGlobby)

const { loadTemplates } = require('../lib/load-templates')

beforeEach(() => {
  mockGlobby.mockResolvedValue(['dir/file-0', 'dir/file-1'])
  mockGlobby.sync.mockReturnValue(['dir/file-0', 'dir/file-1'])

  let asyncCounter = 0
  let syncCounter = 0
  mockFs.readFile.mockImplementation(() => Promise.resolve(Buffer.from(`content-${asyncCounter++}`)))
  mockFs.readFileSync.mockImplementation(() => Buffer.from(`content-${syncCounter++}`))
})

afterEach(() => {
  mockGlobby.mockReset()
  mockGlobby.sync.mockReset()
  mockFs.readFile.mockReset()
  mockFs.readFileSync.mockReset()
  mockFs.outputFile.mockReset()
  mockFs.outputFileSync.mockReset()
})

describe('Load Templates', () => {
  it('is a function that has synchronous version', () => {
    expect(typeof loadTemplates).toBe('function')
    expect(typeof loadTemplates.sync).toBe('function')
  })

  it('loads a list of files using glob patterns and convert them into templates', () => {
    const templatesSync = loadTemplates.sync('**')
      .sort((t1, t2) => t1.getSource() > t2.getSource() ? 1 : -1)

    expect(Array.from(templatesSync.map(t => t.getSource())))
      .toEqual(['dir/file-0', 'dir/file-1'])
    expect(Array.from(templatesSync.map(t => t.render())))
      .toEqual(['content-0', 'content-1'])

    return loadTemplates('**')
      .then((templates) => templates.sort((t1, t2) => t1.getSource() > t2.getSource() ? 1 : -1))
      .then((templates) => {
        expect(Array.from(templates.map(t => t.getSource())))
          .toEqual(['dir/file-0', 'dir/file-1'])
        expect(Array.from(templates.map(t => t.render())))
          .toEqual(['content-0', 'content-1'])
      })
  })

  it('can write a bunch of loaded templates', () => {
    const distDir = `/destination-dir`
    loadTemplates({ pattern: '**', cwd: distDir })
      .then((templates) => {
        templates.write.sync({}, `${distDir}/`)
        expect(mockFs.outputFileSync.mock.calls[0]).toEqual([`${distDir}/dir/file-0`, 'content-0'])
        expect(mockFs.outputFileSync.mock.calls[1]).toEqual([`${distDir}/dir/file-1`, 'content-1'])

        return templates
      })
      .then((templates) => {
        mockFs.outputFile.mockResolvedValue()
        return templates.write({}, `${distDir}/`)
          .then(() => {
            expect(mockFs.outputFile.mock.calls[0]).toEqual([`${distDir}/dir/file-0`, 'content-0'])
            expect(mockFs.outputFile.mock.calls[1]).toEqual([`${distDir}/dir/file-1`, 'content-1'])
          })
      })
  })
})
