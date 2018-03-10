import ejs from 'ejs'
import fs from 'fs-extra'
import { IRender, ITemplateOptions } from '../interface'

const normalizeOptions = (options: ITemplateOptions = {}) => ({
  ...options,
  escape: typeof options.escape === 'function'
    ? options.escape : options.escape ? undefined : (str) => str
})

const createTemplate = (template: string, options: ITemplateOptions): IRender => {
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

    if (sync) {
      return fs.outputFileSync(path, content)
    } else {
      return fs.outputFile(path, content)
    }
  }

  const render = (context: any, path?: string) => renderer(context, path, false)
  render.sync = (context: any, path: string) => renderer(context, path, true)

  return render
}

export default createTemplate
export { createTemplate }
