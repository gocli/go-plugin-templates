interface IEscape {
  (template: string): string
}

interface ITemplateOptions {
  _with?: boolean
  cache?: boolean
  client?: boolean
  compileDebug?: boolean
  context?: any
  debug?: boolean
  delimiter?: string
  escape?: boolean | IEscape
  filename?: string
  localsName?: string
  rmWhitespace?: boolean
  root?: string
  strict?: boolean
  views?: string[]
}

interface IRenderSync {
  (context: any, destination: string): void
}

interface IRender {
  (context: any): string
  (context: any, destination: string): Promise<string>
  sync?: IRenderSync
}

interface ICreateTemplate {
  (template: string, options: ITemplateOptions): IRender
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
  pattern?: string // TODO: default = '**'
  patterns?: string[]
  resolve?: string | IResolver
}

interface ITemplatesList {
  [index: number]: {
    template: string
    source: string
  }
}

interface ILoadTemplatesSync {
  (search?: string | IGlobbyOptions, options?: ITemplateOptions): ITemplatesList
}

interface ILoadTemplates {
  (search?: string | IGlobbyOptions, options?: ITemplateOptions): Promise<ITemplatesList>
  sync: ILoadTemplatesSync
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
  ITemplateOptions,
  IRenderSync,
  IRender,
  ICreateTemplate,
  IFileMeta,
  IResolver,
  IGlobbyOptions,
  ISearchOptions,
  ITemplatesList,
  ILoadTemplatesSync,
  ILoadTemplates,
  IProcessTemplateSync,
  IProcessTemplate,
  ITemplatesPlugined
}
