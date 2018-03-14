import {
  IResolver,
  ITemplates,
  ITemplateWrite,
  ITemplateWriteIntermediate,
  ITemplateWriteSync
} from '../interface'

const write: ITemplateWriteIntermediate =
  async function(this: Templates, context: any, resolvePath?: string |  IResolver): Promise<void> {
    await Promise.all(this.map((t) => t.write(context, resolvePath)))
  }

const writeSync: ITemplateWriteSync =
  function(this: Templates, context: any, resolvePath?: string | IResolver): void {
    this.map((t) => t.write.sync(context, resolvePath))
  }

class Templates extends Array implements ITemplates {
  public write: ITemplateWrite

  constructor() {
    super()
    const w = write.bind(this)
    w.sync = writeSync.bind(this)
    this.write = w as ITemplateWrite
  }
}

export default Templates
export { Templates }
