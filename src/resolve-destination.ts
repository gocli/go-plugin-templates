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

  if (typeof resolver !== 'string') {
    throw new Error('resolver should be a string or a function')
  }

  if (resolver.endsWith(sep)) {
    if (!filename) {
      throw new Error('filename should be specified when resolvePath is a folder')
    }

    resolver = ejs.compile(resolver + filename)
  } else {
    resolver = ejs.compile(resolver)
  }

  return resolver(meta)
}

export default resolveDestination
export { resolveDestination }
