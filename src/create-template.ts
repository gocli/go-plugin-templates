import ejs, { Options as EjsOptions } from 'ejs'
import fs from 'fs-extra'
import {
  ICreateTemplate,
  IEscape,
  ITemplate,
  ITemplateOptions,
  ITemplateRender,
  ITemplateWrite
} from '../interface'

const normalizeOptions = (options: ITemplateOptions = {}) => ({
  ...options,
  escape: typeof options.escape === 'function'
    ? options.escape as IEscape : options.escape ? undefined : (str: string) => str
})

const createTemplate: ICreateTemplate = (template: string, options: ITemplateOptions): ITemplate => {
  if (typeof template !== 'string') {
    throw new Error('template is required and it should be a string')
  }

  options = normalizeOptions(options)

  // TODO: catch error and show it above the method
  const ejsTemplate = ejs.compile(template, options as EjsOptions)

  const getSource = () => options.filename

  const render: ITemplateRender = (context = {}) => ejsTemplate(context)

  const write: ITemplateWrite = (context: any, path?: string): Promise<void> => {
    path = path || getSource()
    if (!path) {
      throw new Error('path is not specified')
    }

    return fs.outputFile(path, render(context))
      .then(() => Promise.resolve())
  }

  write.sync = (context: any, path?: string): void => {
    path = path || getSource()
    if (!path) {
      throw new Error('path is not specified')
    }

    fs.outputFileSync(path, render(context))
  }

  return { getSource, render, write }
}

export default createTemplate
export { createTemplate }
