const { createTemplate } = require('./create-template')
const { loadTemplates } = require('./load-templates')
const { processTemplate } = require('./process-template')

const TemplatesPlugin = (proto = {}) => {
  proto.createTemplate = createTemplate
  proto.loadTemplates = loadTemplates
  proto.processTemplate = processTemplate

  return proto
}

exports.TemplatesPlugin = TemplatesPlugin
exports.install = TemplatesPlugin
