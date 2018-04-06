const { loadTemplates } = require('./load-templates')

const processTemplate = (search, context, options) =>
  loadTemplates(search, options)
    .then((templates) => templates.write(context))

processTemplate.sync = (search, context, options) =>
  loadTemplates.sync(search, options).write.sync(context)

exports.processTemplate = processTemplate
