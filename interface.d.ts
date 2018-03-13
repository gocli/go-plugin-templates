import { Options as EjsOptions } from 'ejs'

interface IEscape {
  (template: string): string
}

interface ITemplateOptions extends EjsOptions {
  escape?: boolean | IEscape
}

interface ITemplateRender {
  (context: any): string
}

interface ICreateTemplate {
  (template: string, options: ITemplateOptions): ITemplate
}

interface IFileMeta extends Object {
  name: string
}

interface IResolver {
  (meta: IFileMeta): string
}

interface IGlobbyOptions {
  brace?: boolean
  case?: boolean
  cwd?: string
  deep?: number | boolean
  dot?: boolean
  expandDirectories?: any
  extension?: boolean
  followSymlinkedDirectories?: boolean
  gitignore?: boolean
  globstar?: boolean
  ignore?: string[]
  matchBase?: boolean
  nobrace?: boolean
  nocase?: boolean
  noext?: boolean
  noglobstar?: boolean
  transform?: boolean
  unique?: boolean
}

interface ISearchOptions extends IGlobbyOptions {
  pattern?: string
  patterns?: string[]
  resolve?: string | IResolver
}

interface ITemplateWriteSync {
  (context: any, path?: string): void
}

interface ITemplateWrite {
  (context: any, path?: string): Promise
  sync?: ITemplateWriteSync // TODO: shouldn't be optional
}

interface ITemplate {
  getSource (): string | undefined
  render (context: any): string
  write: ITemplateWrite
}

interface ITemplates {
  [index: number]: ITemplate
  write: ITemplateWrite
}

interface ILoadTemplatesSync {
  (search?: string | IGlobbyOptions, options?: ITemplateOptions): ITemplate[]
}

interface ILoadTemplates {
  (search?: string | IGlobbyOptions, options?: ITemplateOptions): Promise<ITemplate[]>
  sync?: ILoadTemplatesSync // TODO: shouldn't be optional
}

interface IProcessTemplateSync {
  (): void
}

interface IProcessTemplate {
  (): void
}

interface ITemplatesPlugined extends Object {
  createTemplate?: ICreateTemplate,
  loadTemplates?: ILoadTemplates,
  processTemplate?: IProcessTemplate
}

export default ITemplatesPlugined

export {
  IEscape,
  ITemplateOptions,
  ITemplateRender,
  ICreateTemplate,
  IFileMeta,
  IResolver,
  IGlobbyOptions,
  ISearchOptions,
  ITemplateWriteSync,
  ITemplateWrite,
  ITemplate,
  ILoadTemplatesSync,
  ILoadTemplates,
  IProcessTemplateSync,
  IProcessTemplate,
  ITemplatesPlugined
}
