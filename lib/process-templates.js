const { loadTemplates } = require('./load-templates')

const processTemplates = (search, context, options) =>
  loadTemplates(search, options)
    .then((templates) => templates.write(context))

processTemplates.sync = (search, context, options) =>
  loadTemplates.sync(search, options).write.sync(context)

exports.processTemplates = processTemplates
