import ejs from 'ejs'
import { parse, sep } from 'path'
import { IResolver } from '../interface'

const resolveDestination = (resolver?: string | IResolver, filename?: string) => {
  if (!resolver) {
    return filename
  }

  const meta = filename ? Object.assign(parse(filename), { filename }) : {}

  if (typeof resolver === 'function') {
    return resolver(meta)
  }

  // tslint:disable-next-line: strict-type-predicates
  if (typeof resolver !== 'string') {
    throw new Error('resolver argument should be a string or a function')
  }

  if (resolver.endsWith(sep)) {
    if (!filename) {
      throw new Error('filename argument should be specified when resolvePath is a folder')
    }

    resolver = ejs.compile(resolver + filename)
  } else {
    resolver = ejs.compile(resolver)
  }

  return resolver(meta)
}

export default resolveDestination
export { resolveDestination }
