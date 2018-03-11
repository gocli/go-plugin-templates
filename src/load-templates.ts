import stack from 'callsite'
import fs from 'fs-extra'
import globby from 'globby'
import { dirname } from 'path'
import { ILoadTemplates, ISearchOptions, ITemplate, ITemplateOptions } from '../interface'
import createTemplate from './create-template'
import { normalizeSearch } from './normalize-search'

const normalizeCwd = (search: ISearchOptions) => {
  /*
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
    stack()[9].getFileName()
  ])
   */
  search.cwd = search.cwd || dirname(stack()[1].getFileName())
}

const loadTemplate = (filename: string) => fs.readFile(filename)
  .then((template) => ({ filename, template }))

const loadTemplates: ILoadTemplates =
  async (search?: string | string[] | ISearchOptions, options?: ITemplateOptions): Promise<ITemplate[]> => {
    search = normalizeSearch(search)
    normalizeCwd(search)
    const templates = await globby(search.patterns as string[], search)
    return (await Promise.all(templates.map(loadTemplate)))
      .map(({ template, filename }) => createTemplate(template.toString(), { ...options, filename }))
  }

loadTemplates.sync =
  (search?: string | string[] | ISearchOptions, options?: ITemplateOptions): ITemplate[] => {
    search = normalizeSearch(search)
    normalizeCwd(search)
    return globby.sync(search.patterns as string[], search)
      .map((filename) => ({ filename, template: fs.readFileSync(filename) }))
      .map(({ template, filename }) => createTemplate(template.toString(), { ...options, filename }))
  }

export default loadTemplates
export { loadTemplates }
