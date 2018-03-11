import { ISearchOptions } from '../interface'

const defaultIgnore = [
  '.git/**',
  '**/.git/**',
  './**/.git/**',
  'node_modules/**',
  '**/node_modules/**',
  './**/node_modules/**'
]

const defaultPattern = '**'

const isDefined = (value: any) => typeof value !== 'undefined'

const normalizeSearch = (search?: string | string[] | ISearchOptions) => {
  if (typeof search === 'string') {
    search = { pattern: search }
  }

  if (search instanceof Array) {
    search = { patterns: search }
  }

  if (!search) {
    search = { pattern: defaultPattern }
  }

  if (typeof search !== 'object') {
    throw new Error('seach should be a string, an array or an object')
  }

  const opts: ISearchOptions = {}

  if (isDefined(search.brace)) { opts.brace = search.brace }
  if (isDefined(search.case)) { opts.case = search.case }
  if (isDefined(search.cwd)) { opts.cwd = search.cwd }
  if (isDefined(search.deep)) { opts.deep = search.deep }
  if (isDefined(search.dot)) { opts.dot = search.dot }
  if (isDefined(search.expandDirectories)) { opts.expandDirectories = search.expandDirectories }
  if (isDefined(search.extension)) { opts.extension = search.extension }
  if (isDefined(search.followSymlinkedDirectories)) {
    opts.followSymlinkedDirectories = search.followSymlinkedDirectories
  }
  if (isDefined(search.globstar)) { opts.globstar = search.globstar }
  if (isDefined(search.matchBase)) { opts.matchBase = search.matchBase }
  if (isDefined(search.nobrace)) { opts.nobrace = search.nobrace }
  if (isDefined(search.nocase)) { opts.nocase = search.nocase }
  if (isDefined(search.noext)) { opts.noext = search.noext }
  if (isDefined(search.noglobstar)) { opts.noglobstar = search.noglobstar }
  if (isDefined(search.resolve)) { opts.resolve = search.resolve }
  if (isDefined(search.transform)) { opts.transform = search.transform }
  if (isDefined(search.unique)) { opts.unique = search.unique }

  opts.gitignore = typeof search.gitignore === 'undefined' ? true : search.gitignore
  opts.ignore = typeof search.ignore === 'undefined' ? defaultIgnore : search.ignore

  opts.patterns = (search.patterns || []).concat(search.pattern ? search.pattern : [])
  if (!opts.patterns.length) {
    opts.patterns.push(defaultPattern)
  }

  return opts
}

export default normalizeSearch
export { normalizeSearch }