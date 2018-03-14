import globby from 'globby'
import { IMatchFiles, IMatchFilesIntermediate, ISearchOptions } from '../interface'
import { normalizeSearch } from './normalize-search'

const matchFiles = ((): IMatchFiles => {
  const match: IMatchFilesIntermediate = (search?: string | string[] | ISearchOptions) => {
    search = normalizeSearch(search)
    return globby(search.patterns as string[], search)
  }

  match.sync = (search?: string | string[] | ISearchOptions) => {
    search = normalizeSearch(search)
    return globby.sync(search.patterns as string[], search)
  }

  return match as IMatchFiles
})()

export default matchFiles
export { matchFiles }
