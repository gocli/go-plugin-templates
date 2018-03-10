const fs = require('fs-extra')
const { loadTemplates } = require('../src/load-templates')

const tempDir = `temp-loadTemplates-files`

describe('Load Templates', () => {
  beforeAll(() => {
    fs.outputFileSync(`${__dirname}/${tempDir}/template-1`, 'hello')
    fs.outputFileSync(`${__dirname}/${tempDir}/template-2`, 'hi')
  })

  afterAll(() => {
    fs.removeSync(tempDir)
  })

  it('is a function that has synchronous version', () => {
    expect(typeof loadTemplates).toBe('function')
    expect(typeof loadTemplates.sync).toBe('function')
  })

  it('loads a list of files using glob patterns', async () => {
    const templates = await loadTemplates('**')
    expect(templates).toEqual([
      `${tempDir}/template-1`,
      `${tempDir}/template-2`
    ])
  })
})
