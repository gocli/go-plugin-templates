import {
  IProcessTemplate,
  IProcessTemplateIntermediate,
  ISearchOptions,
  ITemplateOptions
} from '../interface'
import { loadTemplates } from './load-templates'

const processTemplate: IProcessTemplate = (() => {
  const process: IProcessTemplateIntermediate =
    (search: string | ISearchOptions, context: any, options?: ITemplateOptions): Promise<void> =>
      loadTemplates(search, options)
        .then((templates) => templates.write(context))

  process.sync =
    (search: string | ISearchOptions, context: any, options?: ITemplateOptions): void =>
      loadTemplates.sync(search, options).write.sync(context)

  return process as IProcessTemplate
})()

export default processTemplate
export { processTemplate }
