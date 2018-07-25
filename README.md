# go-plugin-templates [![npm](https://img.shields.io/npm/v/go-plugin-templates.svg?style=flat-square)](https://www.npmjs.com/package/go-plugin-templates) [![Travis](https://img.shields.io/travis/gocli/go-plugin-cli.svg?style=flat-square)](https://travis-ci.org/gocli/go-plugin-templates) [![Coveralls](https://img.shields.io/coveralls/github/gocli/go-plugin-templates.svg?style=flat-square)](https://coveralls.io/github/gocli/go-plugin-templates) [![Known Vulnerabilities](https://snyk.io/test/github/gocli/go-plugin-templates/badge.svg?style=flat-square)](https://snyk.io/test/github/gocli/go-plugin-templates) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-green.svg?style=flat-square)](https://github.com/gocli/go-plugin-templates)

[Go](https://www.npmjs.com/package/go) plugin to use templates

## API

### createTemplate

`crateTemplate(template, options)`

  - `template` {string} - a string containing text and ejs placeholders
  - `options` {object} - ejs options + filename + resolve
    - `filename` {string} - a path to the file (used in getSource() and to write rendered template)
    - `resolve` {string|function} - will be used for `write` if it is called without `resolve` argument
    - default ejs option `escape` is replaced with `str => str` so ejs won't affect templates

### loadTemplates

`loadTemplates(search, options)`

  - `search` {string|array|object} - globby options to search files
    - string, becomes a pattern to search
    - array, becomes patterns to search
    - object, is globby options object
    - for each of above cases there are several default options (redefined from globby defaults) will be assigned:
      - `cwd: process.cwd()`
      - `dot: true`
      - `ignore: ['.git', 'node_modules']`
      - `pattern: '**'`
  - `options` {object} - this will be given as it is (but `filename` will be changed) to `createTemplate` as options

`loadTemplates.sync(search, options)`

### processTemplates

`processTemplates(context, search, options)`

  - `search` {string|array|object} - as it is goes to `loadTemplates`
  - `context` {object} - as it is goes to `render`
  - `options` {object} - this will be given as it is (but `filename` will be changed) to `createTemplate` as options


`processTemplates.sync(context, search, options)`

## Templates API

### render

`template.render(context)`

  - `context` {object} - a scope for ejs template

`templates.render(context)`

### write

`template.write(context, resolve)`

  - `context` {object} - as it is goes to `render`
  - `resolve` {string|function} - a path to save the file
    - string, if it ends with directory separator (/) will put files in that directory with their names from `filename`, otherwise it will be an exact path to save file; it also can contain ejs placeholders to use file meta information
    - function, receives meta information about the file and should return a string that is exact path to save the file

`template.write.sync(context, resolve)`
`templates.write(context, resolve)`
`templates.write.sync(context, resolve)`

### getSource

## License

MIT © [Stanislav Termosa](https://github.com/termosa)
