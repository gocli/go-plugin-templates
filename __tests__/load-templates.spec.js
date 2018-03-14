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

const mockMatchFiles = (() => {
  const matchFiles = jest.fn()
  matchFiles.sync = jest.fn()
  matchFiles.matchFiles = matchFiles
  return matchFiles
})()
jest.mock('../src/match-files', () => mockMatchFiles)

const { loadTemplates } = require('../src/load-templates')

beforeEach(() => {
  mockMatchFiles.mockResolvedValue(['dir/file-0', 'dir/file-1'])
  mockMatchFiles.sync.mockReturnValue(['dir/file-0', 'dir/file-1'])

  let asyncCounter = 0
  let syncCounter = 0
  mockFs.readFile.mockImplementation(() => Buffer.from(`content-${asyncCounter++}`))
  mockFs.readFileSync.mockImplementation(() => Buffer.from(`content-${syncCounter++}`))
})

afterEach(() => {
  mockMatchFiles.mockReset()
  mockMatchFiles.sync.mockReset()
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

  it('loads a list of files using glob patterns and convert them into templates', async () => {
    const templates = (await loadTemplates('**'))
      .sort((t1, t2) => t1.getSource() > t2.getSource() ? 1 : -1)

    expect(Array.from(templates.map(t => t.getSource())))
      .toEqual(['dir/file-0', 'dir/file-1'])
    expect(Array.from(templates.map(t => t.render())))
      .toEqual(['content-0', 'content-1'])

    const templatesSync = (await loadTemplates.sync('**'))
      .sort((t1, t2) => t1.getSource() > t2.getSource() ? 1 : -1)

    expect(Array.from(templatesSync.map(t => t.getSource())))
      .toEqual(['dir/file-0', 'dir/file-1'])
    expect(Array.from(templatesSync.map(t => t.render())))
      .toEqual(['content-0', 'content-1'])
  })

  it('can write a bunch of loaded templates', async () => {
    const distDir = `/destination-dir`
    const templates = (await loadTemplates({ pattern: '**', cwd: distDir }))

    mockFs.outputFile.mockResolvedValue()
    await templates.write({}, `${distDir}/`)
    expect(mockFs.outputFile.mock.calls[0]).toEqual([`${distDir}/dir/file-0`, 'content-0'])
    expect(mockFs.outputFile.mock.calls[1]).toEqual([`${distDir}/dir/file-1`, 'content-1'])

    templates.write.sync({}, `${distDir}/`)
    expect(mockFs.outputFileSync.mock.calls[0]).toEqual([`${distDir}/dir/file-0`, 'content-0'])
    expect(mockFs.outputFileSync.mock.calls[1]).toEqual([`${distDir}/dir/file-1`, 'content-1'])
  })
})
