import { IResolver, ITemplates, ITemplateWrite } from '../interface'

const write: ITemplateWrite = function(this: Templates, context: any, resolvePath?: string|  IResolver): Promise<void> {
  return Promise.all(this.map((t) => t.write(context, resolvePath)))
    .then(() => Promise.resolve())
}

const writeSync = function(this: Templates, context: any, resolvePath?: string | IResolver): void {
  this.map((t) => t.write.sync(context, resolvePath))
}

class Templates extends Array implements ITemplates {
  public write: ITemplateWrite

  constructor() {
    super()
    this.write = write.bind(this)
    this.write.sync = writeSync.bind(this)
  }
}

export default Templates
export { Templates }
