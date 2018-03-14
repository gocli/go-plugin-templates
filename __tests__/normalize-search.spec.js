const { normalizeSearch } = require('../src/normalize-search')

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
  'resolve',
  'transform',
  'unique'
]

describe('Normalize Search', () => {
  const defaultSearch = {
    gitignore: true,
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

  it('set default options', () => {
    expect(normalizeSearch()).toEqual(defaultSearch)
  })

  it('process different forms of search with pattern', () => {
    expect(normalizeSearch('hello')).toEqual({ ...defaultSearch, patterns: ['hello'] })
    expect(normalizeSearch(['hello'])).toEqual({ ...defaultSearch, patterns: ['hello'] })
    expect(normalizeSearch(['hello', 'hi'])).toEqual({ ...defaultSearch, patterns: ['hello', 'hi'] })
    expect(normalizeSearch({})).toEqual({ ...defaultSearch })
    expect(normalizeSearch({ pattern: 'hello' })).toEqual({ ...defaultSearch, patterns: ['hello'] })
    expect(normalizeSearch({ patterns: ['hello', 'hi'] })).toEqual({ ...defaultSearch, patterns: ['hello', 'hi'] })
    expect(() => normalizeSearch(42)).toThrow()
  })

  it('can completly replace default ignore', () => {
    expect(normalizeSearch({ ignore: ['foo'] })).toEqual({ ...defaultSearch, ignore: ['foo'] })
  })

  it('can redefine gitignore option', () => {
    expect(normalizeSearch({ gitignore: false })).toEqual({ ...defaultSearch, gitignore: false })
  })

  it('drops unknown properties', () => {
    expect(normalizeSearch({ unknownProperty: true })).not.toHaveProperty('unknownProperty')

    const search = allPossibleOptions.reduce((search, prop) => ({ ...search, [prop]: 'val' }), {})
    const normalized = normalizeSearch(search)
    allPossibleOptions.forEach(prop => expect(normalized).toHaveProperty(prop))
    expect(Object.keys(search).sort()).toEqual(allPossibleOptions)
  })
})
