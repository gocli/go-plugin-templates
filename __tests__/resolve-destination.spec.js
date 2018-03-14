const { resolveDestination } = require('../src/resolve-destination')

const filename = '/var/src/file.md'
const fileMeta = {
  root: '/',
  dir: '/var/src',
  base: 'file.md',
  ext: '.md',
  name: 'file',
  filename
}

describe('Resolve Destination', () => {
  it('returns filename if resolver is not given', () => {
    expect(resolveDestination()).not.toBeDefined()
    expect(resolveDestination(null, 'filename')).toBe('filename')
  })

  it('calls the resolver and returns its result', () => {
    const resolver = jest.fn()

    resolveDestination(resolver)
    resolveDestination(resolver, filename)
    expect(resolver.mock.calls.length).toBe(2)
    expect(resolver.mock.calls[0]).toEqual([{}])
    expect(resolver.mock.calls[1]).toEqual([fileMeta])

    expect(resolveDestination(() => 'file')).toBe('file')
  })

  it('returns a path when resolver is string', () => {
    expect(resolveDestination('dir/', 'file')).toBe('dir/file')
    expect(resolveDestination('dir/file')).toBe('dir/file')
    expect(resolveDestination('dir/file', 'ignored')).toBe('dir/file')
  })

  it('renders the stringed resolver using parsed filename', () => {
    expect(resolveDestination('<%= root + dir + base + ext + name + filename %>', filename))
      .toBe(`${fileMeta.root}${fileMeta.dir}${fileMeta.base}${fileMeta.ext}${fileMeta.name}${fileMeta.filename}`)
  })

  it('fails if resolver ends with slash and filename is not provided', () => {
    expect(() => resolveDestination('dir/')).toThrowError(/folder/)
  })

  it('fails if resolver is nor function nor string', () => {
    expect(() => resolveDestination(1)).toThrowError(/string|function/)
  })
})
