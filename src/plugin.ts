import { ITemplatesPlugined } from '../interface'
import { createTemplate } from './create-template'
import { loadTemplates } from './load-templates'
import { processTemplate } from './process-template'

const TemplatesPlugin = (proto: ITemplatesPlugined = {}): ITemplatesPlugined => {
  proto.createTemplate = createTemplate
  proto.loadTemplates = loadTemplates
  proto.processTemplate = processTemplate
  return proto
}

const install = TemplatesPlugin
export { install, TemplatesPlugin }
export default TemplatesPlugin
