import fs from 'fs-extra'
import globby from 'globby'
import { ILoadTemplates, ISearchOptions, ITemplate, ITemplateOptions } from '../interface'
import createTemplate from './create-template'
import { normalizeSearch } from './normalize-search'

const loadTemplate = (filename: string) => fs.readFile(filename)
  .then((template) => ({ filename, template }))

const loadTemplates: ILoadTemplates =
  async (search?: string | string[] | ISearchOptions, options?: ITemplateOptions): Promise<ITemplate[]> => {
    search = normalizeSearch(search)
    const templates = await globby(search.patterns as string[], search)
    return (await Promise.all(templates.map(loadTemplate)))
      .map(({ template, filename }) => createTemplate(template.toString(), { ...options, filename }))
  }

loadTemplates.sync =
  (search?: string | string[] | ISearchOptions, options?: ITemplateOptions): ITemplate[] => {
    search = normalizeSearch(search)
    return globby.sync(search.patterns as string[], search)
      .map((filename) => ({ filename, template: fs.readFileSync(filename) }))
      .map(({ template, filename }) => createTemplate(template.toString(), { ...options, filename }))
  }

export default loadTemplates
export { loadTemplates }
