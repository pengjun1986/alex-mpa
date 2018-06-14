import path from 'path'
import _ from 'lodash'

export const getPages = (files, srcDir, pagesDir) => {
  let pages = {}
  files.forEach(f => {
    f = path.normalize(f)
    const basePath = path.join(srcDir + pagesDir)
    const extPath = f.replace(basePath, '')
    const pageName = extPath.split(path.sep)[1]
    if (!pages[pageName]) {
      pages[pageName] = {
        routes: []
      }
    }
    pages[pageName].routes.push(extPath.replace('.vue', ''))
  })
  return pages
}

export const isWindows = /^win/.test(process.platform)

export const wp = function wp(p = '') {
  /* istanbul ignore if */
  if (isWindows) {
    return p.replace(/\\/g, '\\\\')
  }
  return p
}

const reqSep = /\//g
const sysSep = _.escapeRegExp(path.sep)
const normalize = string => string.replace(reqSep, sysSep)

export const r = function r() {
  let args = Array.prototype.slice.apply(arguments)
  let lastArg = _.last(args)

  if (lastArg.indexOf('@') === 0 || lastArg.indexOf('~') === 0) {
    return wp(lastArg)
  }
  return wp(path.resolve(...args.map(normalize)))
}