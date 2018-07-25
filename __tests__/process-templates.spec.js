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

const { processTemplates } = require('../lib/process-templates')

beforeEach(() => {
  mockGlobby.mockResolvedValue(['dir/file-0', 'dir/file-1'])
  mockGlobby.sync.mockReturnValue(['dir/file-0', 'dir/file-1'])

  let asyncCounter = 0
  let syncCounter = 0
  mockFs.readFile.mockImplementation(() => Promise.resolve(Buffer.from(`content-${asyncCounter++}-<%= flag %>`)))
  mockFs.readFileSync.mockImplementation(() => Buffer.from(`content-${syncCounter++}-<%= flag %>`))
  mockFs.outputFile.mockResolvedValue()
})

afterEach(() => {
  mockGlobby.mockReset()
  mockGlobby.sync.mockReset()
  mockFs.readFile.mockReset()
  mockFs.readFileSync.mockReset()
  mockFs.outputFile.mockReset()
  mockFs.outputFileSync.mockReset()
})

describe('Process Template', () => {
  it('is a function that has synchronous version', () => {
    expect(typeof processTemplates).toBe('function')
    expect(typeof processTemplates.sync).toBe('function')
  })

  it('reads, process, and write files', () => {
    return Promise.all([
      processTemplates({ flag: 'ASYNC' }),
      processTemplates.sync({ flag: 'SYNC' })
    ]).then(() => {
      expect(mockFs.outputFile).toHaveBeenCalledWith('dir/file-0', 'content-0-ASYNC')
      expect(mockFs.outputFile).toHaveBeenCalledWith('dir/file-1', 'content-1-ASYNC')
      expect(mockFs.outputFileSync).toHaveBeenCalledWith('dir/file-0', 'content-0-SYNC')
      expect(mockFs.outputFileSync).toHaveBeenCalledWith('dir/file-1', 'content-1-SYNC')
    })
  })
})
