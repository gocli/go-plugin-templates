const { normalizeSearch } = require('../lib/normalize-search')

const allPossibleOptions = [
  'brace',
  'case',
  'cwd',
  'deep',
  'dot',
  'expandDirectories',
  'extension',
  'followSymlinkedDirectories',
  'gitignore',
  'globstar',
  'ignore',
  'matchBase',
  'nobrace',
  'nocase',
  'noext',
  'noglobstar',
  'patterns',
  'transform',
  'unique'
]

describe('Normalize Search', () => {
  const defaultSearch = {
    cwd: process.cwd(),
    dot: true,
    patterns: ['**'],
    ignore: [
      '.git/**',
      '**/.git/**',
      './**/.git/**',
      'node_modules/**',
      '**/node_modules/**',
      './**/node_modules/**'
    ]
  }

  const createExpectedSearch = (search = {}) => Object.assign({}, defaultSearch, search)

  it('set default options', () => {
    expect(normalizeSearch()).toEqual(createExpectedSearch({}))
  })

  it('process different forms of search with pattern', () => {
    expect(normalizeSearch('hello'))
      .toEqual(createExpectedSearch({ patterns: ['hello'] }))
    expect(normalizeSearch(['hello']))
      .toEqual(createExpectedSearch({ patterns: ['hello'] }))
    expect(normalizeSearch(['hello', 'hi']))
      .toEqual(createExpectedSearch({ patterns: ['hello', 'hi'] }))
    expect(normalizeSearch({}))
      .toEqual(createExpectedSearch())
    expect(normalizeSearch({ pattern: 'hello' }))
      .toEqual(createExpectedSearch({ patterns: ['hello'] }))
    expect(normalizeSearch({ patterns: ['hello', 'hi'] }))
      .toEqual(createExpectedSearch({ patterns: ['hello', 'hi'] }))
    expect(() => normalizeSearch(42)).toThrow()
  })

  it('can completly replace default ignore', () => {
    expect(normalizeSearch({ ignore: ['foo'] }))
      .toEqual(createExpectedSearch({ ignore: ['foo'] }))
  })

  it('can redefine gitignore option', () => {
    expect(normalizeSearch({ gitignore: false }))
      .toEqual(createExpectedSearch({ gitignore: false }))
  })

  it('drops unknown properties', () => {
    expect(normalizeSearch({ unknownProperty: true })).not.toHaveProperty('unknownProperty')

    const search = allPossibleOptions
      .reduce((search, prop) => Object.assign({}, search, { [prop]: 'val' }), {})
    const normalized = normalizeSearch(search)
    allPossibleOptions.forEach(prop => expect(normalized).toHaveProperty(prop))
    expect(Object.keys(search).sort()).toEqual(allPossibleOptions)
  })
})
