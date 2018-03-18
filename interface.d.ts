import { Options as EjsOptions } from 'ejs'

interface IEscape {
  (template: string): string
}

interface IResolver {
  (meta: IFileMeta): string
}

interface ITemplateOptions extends EjsOptions {
  resolve?: string | IResolver
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
}

interface ITemplateWriteSync {
  (context: any, resolvePath?: string | IResolver): void
}

interface ITemplateWriteIntermediate {
  (context: any, resolvePath?: string | IResolver): Promise<void>
  sync?: ITemplateWriteSync
}

interface ITemplateWrite {
  (context: any, resolvePath?: string | IResolver): Promise<void>
  sync: ITemplateWriteSync
}

interface ITemplate {
  getSource (): string | undefined
  render (context: any): string
  write: ITemplateWrite
}

interface ITemplates extends Array<ITemplate> {
  write: ITemplateWrite
}

interface ILoadTemplatesSync {
  (search?: string | ISearchOptions, options?: ITemplateOptions): ITemplates
}

interface ILoadTemplatesIntermediate {
  (search?: string | ISearchOptions, options?: ITemplateOptions): Promise<ITemplates>
  sync?: ILoadTemplatesSync
}

interface ILoadTemplates {
  (search?: string | ISearchOptions, options?: ITemplateOptions): Promise<ITemplates>
  sync: ILoadTemplatesSync
}

interface IProcessTemplateSync {
  (search: string | ISearchOptions, context: any, options?: ITemplateOptions): void
}

interface IProcessTemplateIntermediate {
  (search: string | ISearchOptions, context: any, options?: ITemplateOptions): Promise<void>
  sync?: IProcessTemplateSync
}

interface IProcessTemplate {
  (search: string | ISearchOptions, context: any, options?: ITemplateOptions): Promise<void>
  sync: IProcessTemplateSync
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
  ILoadTemplatesIntermediate,
  ILoadTemplates,
  IProcessTemplateSync,
  IProcessTemplateIntermediate,
  IProcessTemplate,
  ITemplatesPlugined,
  IMatchFilesSync,
  IMatchFilesIntermediate,
  IMatchFiles
}
