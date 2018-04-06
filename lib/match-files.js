const globby = require('globby')
const { normalizeSearch } = require('./normalize-search')

const matchFiles = (search) => {
  search = normalizeSearch(search)
  return globby(search.patterns, search)
}

matchFiles.sync = (search) => {
  search = normalizeSearch(search)
  return globby.sync(search.patterns, search)
}

exports.matchFiles = matchFiles
