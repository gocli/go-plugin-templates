import ejs from 'ejs'
import fs from 'fs-extra'
import { ICreateTemplate, IRender, ITemplateOptions } from '../interface'

const normalizeOptions = (options: ITemplateOptions = {}) => ({
  ...options,
  escape: typeof options.escape === 'function'
    ? options.escape : options.escape ? undefined : (str: string) => str
})

const createTemplate: ICreateTemplate = (template: string, options: ITemplateOptions): IRender => {
  if (typeof template !== 'string') {
    throw new Error('template is required and it should be a string')
  }

  const ejsTemplate = ejs.compile(template, normalizeOptions(options))

  const renderer = (context = {}, path?: string, sync?: boolean) => {
    if (path && typeof path !== 'string') {
      throw new Error('path should be a string')
    }

    const content = ejsTemplate(context)

    if (!path) {
      return content
    }

    if (!sync) {
      return fs.outputFile(path, content)
        .then(() => content)
    } else {
      fs.outputFileSync(path, content)
      return content
    }
  }

  const render: IRender = (context: any, path?: string): string | Promise<string> => renderer(context, path, false)
  render.sync = (context: any, path: string): string => renderer(context, path, true)

  return render
}

export default createTemplate
export { createTemplate }
