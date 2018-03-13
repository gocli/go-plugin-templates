import fs from 'fs-extra'
import { ILoadTemplates, ISearchOptions, ITemplate, ITemplateOptions, ITemplates } from '../interface'
import { createTemplate } from './create-template'
import { matchFiles } from './match-files'

const wrapTemplatesList = (templates: ITemplate[]): ITemplates => {
  const wrapped = templates.slice(0)

  wrapped.write = (context: any, path?: string): Promise<void> =>
    Promise.all(wrapped.map((t) => t.write(context, path)))
    .then(() => Promise.resolve())

  wrapped.write.sync = (context: any, path?: string): void => {
    wrapped.map((t) => t.write.sync(context, path))
  }

  return wrapped
}

const loadTemplates: ILoadTemplates =
  async (search?: string | string[] | ISearchOptions, options?: ITemplateOptions): Promise<ITemplate[]> => {
    const loadingTemplates = (await matchFiles(search))
      .map(async (filename: string) => ({ filename, template: await fs.readFile(filename) }))

    const templates = (await Promise.all(loadingTemplates))
      .map(({ template, filename }) => createTemplate(template.toString(), { ...options, filename }))

    return wrapTemplatesList(templates)
  }

loadTemplates.sync =
  (search?: string | string[] | ISearchOptions, options?: ITemplateOptions): ITemplate[] => {
    const templates = matchFiles(search)
      .map((filename) => ({ filename, template: fs.readFileSync(filename) }))
      .map(({ template, filename }) => createTemplate(template.toString(), { ...options, filename }))

    return wrapTemplatesList(templates)
  }

export default loadTemplates
export { loadTemplates }
