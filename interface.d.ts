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
  root?: string
  dir?: string
  base?: string
  ext?: string
  name?: string
  filename?: string
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
  (context: any, resolvePath?: string | IResolver): void
}

interface ITemplateWriteIntermediate {
  (context: any, resolvePath?: string | IResolver): Promise
  sync?: ITemplateWriteSync
}

interface ITemplateWrite {
  (context: any, resolvePath?: string | IResolver): Promise
  sync: ITemplateWriteSync
}

interface ITemplate {
  getSource (): string | undefined
  render (context: any): string
  write: ITemplateWrite
}

interface ITemplates extends Array {
  [index: number]: ITemplate
  write: ITemplateWrite
}

interface ILoadTemplatesSync {
  (search?: string | IGlobbyOptions, options?: ITemplateOptions): ITemplates
}

interface ILoadTemplates {
  (search?: string | IGlobbyOptions, options?: ITemplateOptions): Promise<ITemplates>
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

interface IMatchFilesSync {
  (search?: string | string[] | ISearchOptions): string[]
}

interface IMatchFilesIntermediate {
  (search?: string | string[] | ISearchOptions): Promise<string[]>
  sync?: IMatchFilesSync
}

interface IMatchFiles {
  (search?: string | string[] | ISearchOptions): Promise<string[]>
  sync: IMatchFilesSync
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
  ITemplateWriteIntermediate,
  ITemplateWrite,
  ITemplate,
  ITemplates,
  ILoadTemplatesSync,
  ILoadTemplates,
  IProcessTemplateSync,
  IProcessTemplate,
  ITemplatesPlugined,
  IMatchFilesSync,
  IMatchFilesIntermediate,
  IMatchFiles
}
