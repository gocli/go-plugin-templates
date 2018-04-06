const fs = require('fs-extra')
const { createTemplate } = require('./create-template')
const { matchFiles } = require('./match-files')

const wrapTemplates = (templates) => {
  templates.write = (context, resolvePath) =>
    Promise.all(templates.map((t) => t.write(context, resolvePath))).then(() => {})

  templates.write.sync = (context, resolvePath) => {
    templates.map((t) => t.write.sync(context, resolvePath))
  }

  return templates
}

const loadFiles = (files) => {
  const loadingFiles = files.map((name) => {
    return fs.readFile(name)
      .then(content => ({ content, name }))
  })

  return Promise.all(loadingFiles)
}

const createTemplatesFromFiles = (files, options) =>
  files.map(({ content, name }) => {
    return createTemplate(content.toString(), Object.assign({}, options, { filename: name }))
  })

const loadTemplates = (search, options) =>
  matchFiles(search)
    .then(loadFiles)
    .then((files) => createTemplatesFromFiles(files, options))
    .then(wrapTemplates)

loadTemplates.sync =
  (search, options) => {
    const files = matchFiles.sync(search)
      .map((name) => ({ name, content: fs.readFileSync(name) }))
    const templates = createTemplatesFromFiles(files, options)

    return wrapTemplates(templates)
  }

exports.loadTemplates = loadTemplates
