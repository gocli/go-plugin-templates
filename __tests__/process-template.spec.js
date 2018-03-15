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

const { processTemplate } = require('../src/process-template')

beforeEach(() => {
  mockMatchFiles.mockResolvedValue(['dir/file-0', 'dir/file-1'])
  mockMatchFiles.sync.mockReturnValue(['dir/file-0', 'dir/file-1'])

  let asyncCounter = 0
  let syncCounter = 0
  mockFs.readFile.mockImplementation(() => Buffer.from(`content-${asyncCounter++}-<%= flag %>`))
  mockFs.readFileSync.mockImplementation(() => Buffer.from(`content-${syncCounter++}-<%= flag %>`))
  mockFs.outputFile.mockResolvedValue()
})

afterEach(() => {
  mockMatchFiles.mockReset()
  mockMatchFiles.sync.mockReset()
  mockFs.readFile.mockReset()
  mockFs.readFileSync.mockReset()
  mockFs.outputFile.mockReset()
  mockFs.outputFileSync.mockReset()
})

describe('Process Template', () => {
  it('is a function that has synchronous version', () => {
    expect(typeof processTemplate).toBe('function')
    expect(typeof processTemplate.sync).toBe('function')
  })

  it('reads, process, and write files', async () => {
    await processTemplate('**', { flag: 'FLAG' })
    expect(mockFs.outputFile).toHaveBeenCalledWith('dir/file-0', 'content-0-FLAG')
    expect(mockFs.outputFile).toHaveBeenCalledWith('dir/file-1', 'content-1-FLAG')

    processTemplate.sync('**', { flag: 'FLAG' })
    expect(mockFs.outputFileSync).toHaveBeenCalledWith('dir/file-0', 'content-0-FLAG')
    expect(mockFs.outputFileSync).toHaveBeenCalledWith('dir/file-1', 'content-1-FLAG')
  })
})
