interface ITemplate {
  (context: any): string
}

interface ICreateTemplate {
  (template: string): ITemplate
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

export default ITemplatesPlugined

export {
  ITemplatesPlugined,
  ICreateTemplate,
  ILoadTemplates,
  IProcessTemplate,
  ITemplate
}
