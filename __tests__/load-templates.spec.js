const fs = require('fs-extra')
const { loadTemplates } = require('../src/load-templates')

const tempDir = 'temp-loadTemplates-files'

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

describe('Load Templates', () => {
  it('is a function that has synchronous version', () => {
    expect(typeof loadTemplates).toBe('function')
    expect(typeof loadTemplates.sync).toBe('function')
  })

  it('loads a list of files using glob patterns and convert them into templates', async () => {
    const templates = (await loadTemplates('**'))
      .sort((t1, t2) => t1.getSource() > t2.getSource() ? 1 : -1)

    expect(Array.from(templates.map(t => t.getSource())))
      .toEqual(['d1/template-1', 'd1/template-2'])
    expect(Array.from(templates.map(t => t.render())))
      .toEqual(['hello', 'hi'])
  })

  it('can write a bunch of loaded templates', async () => {
    const distDir = `${__dirname}/${tempDir}`
    const templates = (await loadTemplates({ pattern: '**', cwd: distDir }))

    const load = async (file) => (await fs.readFile(`${distDir}/${file}`)).toString()

    await templates.write({}, `${distDir}/async/`)
    expect(await load('async/d1/template-1')).toBe('hello')
    expect(await load('async/d1/template-2')).toBe('hi')

    templates.write.sync({}, `${distDir}/sync/`)
    expect(await load('sync/d1/template-1')).toBe('hello')
    expect(await load('sync/d1/template-2')).toBe('hi')
  })
})
