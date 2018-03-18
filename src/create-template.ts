import ejs, { Options as EjsOptions } from 'ejs'
import fs from 'fs-extra'
import { sep } from 'path'
import {
  ICreateTemplate,
  IResolver,
  ITemplate,
  ITemplateOptions,
  ITemplateRender,
  ITemplateWrite,
  ITemplateWriteIntermediate
} from '../interface'
import { resolveDestination } from './resolve-destination'

const normalizeOptions = (options: ITemplateOptions = {}) => ({
  ...options,
  escape: typeof options.escape === 'function' ? options.escape : (str: string) => str
})

const createTemplate: ICreateTemplate = (template: string, options: ITemplateOptions): ITemplate => {
  // tslint:disable-next-line: strict-type-predicates
  if (typeof template !== 'string') {
    throw new Error('template argument should be a string')
  }

  options = normalizeOptions(options)

  // TODO: catch error and show it above the method
  const ejsTemplate = ejs.compile(template, options as EjsOptions)

  const getSource = () => options.filename

  const render: ITemplateRender = (context = {}) => ejsTemplate(context)

  const write: ITemplateWriteIntermediate = (context: any, resolvePath?: string | IResolver): Promise<void> => {
    const dest = resolveDestination(resolvePath || options.resolve, getSource())

    if (!dest) {
      throw new Error('resolvePath and/or filename should be specified')
    }

    return fs.outputFile(dest, render(context))
      .then(() => Promise.resolve())
      .catch((error) => {
        if (/EISDIR/.test(error)) {
          throw new Error(
            `'${dest}' is a folder and it can not be rewritten\n` +
            `Tip: if you mean to write template into this directory add ${sep} at the end of the destination path`
          )
        } else {
          throw error
        }
      })
  }

  write.sync = (context: any, resolvePath?: string | IResolver): void => {
    const dest = resolveDestination(resolvePath || options.resolve, getSource())

    if (!dest) {
      throw new Error('resolvePath and/or filename should be specified')
    }

    try {
      fs.outputFileSync(dest, render(context))
    } catch (error) {
      if (/EISDIR/.test(error)) {
        throw new Error(
          `'${dest}' is a folder and it can not be rewritten\n` +
          `Tip: if you mean to write template into this directory add ${sep} at the end of the destination path`
        )
      } else {
        throw error
      }
    }
  }

  return { getSource, render, write: write as ITemplateWrite }
}

export default createTemplate
export { createTemplate }
