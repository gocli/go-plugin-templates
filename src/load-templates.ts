import { dirname } from 'path'
import fs from 'fs-extra'
import globby from 'globby'
import { ILoadTemplates, ISearchOptions, ITemplatesList, ITemplateOptions } from '../interface'
import { normalizeSearch } from './normalize-search'
import stack from 'callsite'

const normalizeCwd = (search: ISearchOptions) => {
  console.log([
    stack()[0].getFileName(),
    stack()[1].getFileName(),
    stack()[2].getFileName(),
    stack()[3].getFileName(),
    stack()[4].getFileName(),
    stack()[5].getFileName(),
    stack()[6].getFileName(),
    stack()[7].getFileName(),
    stack()[8].getFileName(),
    stack()[9].getFileName(),
  ])
  search.cwd = search.cwd || dirname(stack()[1].getFileName())
}

const loadTemplate = (source) => fs.readFile(source)
  .then((template) => ({ source, template }))

const loadTemplates: ILoadTemplates =
  async (search?: string | string[] | ISearchOptions, options?: ITemplateOptions): Promise<ITemplatesList> => {
    search = normalizeSearch(search)
    normalizeCwd(search)
    const templates = await globby(search.patterns, search)
    return Promise.all(templates.map(loadTemplate))
  }

loadTemplates.sync =
  (search?: string | string[] | ISearchOptions, options?: ITemplateOptions): ITemplatesList => {
    search = normalizeSearch(search)
    normalizeCwd(search)
    return globby.sync(search.patterns, search).map((source) => ({
      source, template: ejs.compile(fs.readFileSync(source), options)
    }))
  }

export default loadTemplates
export { loadTemplates }
