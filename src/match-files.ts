import globby from 'globby'
import { IMatchFiles, ISearchOptions } from '../interface'
import { normalizeSearch } from './normalize-search'

const matchFiles: IMatchFiles = (search?: string | string[] | ISearchOptions) => {
  search = normalizeSearch(search)
  return globby(search.patterns as string[], search)
}

matchFiles.sync = (search?: string | string[] | ISearchOptions) => {
  search = normalizeSearch(search)
  return globby.sync(search.patterns as string[], search)
}

export default matchFiles
export { matchFiles }
