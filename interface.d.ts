interface IRenderSync {
  (context: any, destination: string): void
}

interface IRender {
  (context: any): string
  (context: any, destination: string): Promise
  sync: IRenderSync
}

interface ICreateTemplate {
  (template: string): IRender
}

interface ILoadTemplates {
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

interface ITemplateOptions {
  _with?: boolean
  cache?: boolean
  client?: boolean
  compileDebug?: boolean
  context?: any
  debug?: boolean
  delimiter?: string
  escape?: boolean | (template: string): string
  filename?: string
  localsName?: string
  rmWhitespace?: boolean
  root?: string
  strict?: boolean
  views?: string[]
}

export default ITemplatesPlugined

export {
  ITemplatesPlugined,
  ICreateTemplate,
  ILoadTemplates,
  IProcessTemplate,
  IRender
}
