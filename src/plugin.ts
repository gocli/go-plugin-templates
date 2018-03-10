import { ITemplatesPlugined } from '../interface'
import { createTemplate } from './create-template'
import { loadTemplates } from './load-templates'
import { processTemplate } from './process-template'

const TemplatesPlugin = (proto: ITemplatesPlugined): void => {
  if (typeof proto !== 'object') {
    throw new Error('prototype is required and it should be an object')
  }

  proto.createTemplate = createTemplate
  proto.loadTemplates = loadTemplates
  proto.processTemplate = processTemplate
}

const install = TemplatesPlugin
export { install, TemplatesPlugin }
