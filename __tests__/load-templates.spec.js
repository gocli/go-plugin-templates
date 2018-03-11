const fs = require('fs-extra')
const { loadTemplates } = require('../src/load-templates')

const tempDir = `temp-loadTemplates-files`

describe('Load Templates', () => {
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
    expect(typeof loadTemplates).toBe('function')
    expect(typeof loadTemplates.sync).toBe('function')
  })

  it('loads a list of files using glob patterns', async () => {
    const templates = (await loadTemplates('**'))
      .map((template) => template.getSource())
      .sort()
    expect(templates).toEqual([
      'd1/template-1',
      'd1/template-2'
    ])
  })
})
