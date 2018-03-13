const fs = require('fs-extra')
const { matchFiles } = require('../src/match-files')

const tempDir = 'temp-matchFiles-files'

describe('Match Files', () => {
  let cwd

  beforeAll(() => {
    fs.outputFileSync(`${__dirname}/${tempDir}/d1/template-1`, 'hello')
    fs.outputFileSync(`${__dirname}/${tempDir}/d1/template-2`, 'hi')

    cwd = process.cwd()
    process.chdir(`${__dirname}/${tempDir}`)
  })

  afterAll(() => {
    process.chdir(cwd)
    fs.removeSync(`${__dirname}/${tempDir}`)
  })

  it('is a function that has synchronous version', () => {
    expect(typeof matchFiles).toBe('function')
    expect(typeof matchFiles.sync).toBe('function')
  })

  it('loads a list of files using glob patterns', async () => {
    const search = '**'
    const expected = ['d1/template-1', 'd1/template-2']

    expect((await matchFiles(search)).sort()).toEqual(expected)
    expect(matchFiles.sync(search).sort()).toEqual(expected)
  })

  it('take the whole file search path', async () => {
    const search = 'd1/**'
    const expected = ['d1/template-1', 'd1/template-2']

    expect((await matchFiles(search)).sort()).toEqual(expected)
    expect(matchFiles.sync(search).sort()).toEqual(expected)
  })

  it('search under the given folder', async () => {
    const search = { pattern: '**', cwd: 'd1' }
    const expected = ['template-1', 'template-2']

    expect((await matchFiles(search)).sort()).toEqual(expected)
    expect(matchFiles.sync(search).sort()).toEqual(expected)
  })
})
