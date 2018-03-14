import fs from 'fs-extra'
import {
  ILoadTemplates,
  IMatchFilesSync,
  ISearchOptions,
  ITemplateOptions,
  ITemplates
} from '../interface'
import { createTemplate } from './create-template'
import { matchFiles } from './match-files'
import { Templates } from './templates.class'

const loadTemplates: ILoadTemplates =
  async (search?: string | string[] | ISearchOptions, options?: ITemplateOptions): Promise<ITemplates> => {
    const loadingTemplates = (await matchFiles(search))
      .map(async (filename: string) => ({ filename, template: await fs.readFile(filename) }))

    const templates = (await Promise.all(loadingTemplates))
      .map(({ template, filename }) => createTemplate(template.toString(), { ...options, filename }))

    return Templates.from(templates)
  }

loadTemplates.sync =
  (search?: string | string[] | ISearchOptions, options?: ITemplateOptions): ITemplates => {
    const templates = (matchFiles.sync as IMatchFilesSync)(search)
      .map((filename) => ({ filename, template: fs.readFileSync(filename) }))
      .map(({ template, filename }) => createTemplate(template.toString(), { ...options, filename }))

    return Templates.from(templates)
  }

export default loadTemplates
export { loadTemplates }
