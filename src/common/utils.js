import path from 'path'
import _ from 'lodash'

export const getPages = (files, rootDir, pagesDir) => {
  let pages = new Map()
  files.forEach(f => {
    let paths = f
      .replace(RegExp(`^${pagesDir}`), '')
      .replace(/\.vue$/, '')
      .replace(/\/{2,}/g, '/')
      .split('/')
    const pageName = paths[1]
    if (!pages.has(pageName)) {
      pages.set(pageName, {
        files: []
      })
    }
    pages.get(pageName).files.push(paths.slice(2))
    // pages.get(pageName).routes.push(extPath.replace(path.sep + pageName + path.sep, '').replace('.vue', ''))
  })
  pages.forEach(value => {
    value.routes = this.createRoutes(value.files, rootDir, 'pages')
  })
  console.log(pages)
  // Object.values(pages).forEach(val => {
  //   pages.test = this.createRoutes(val.routes)
  // })
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

function cleanChildrenRoutes(routes, isChild = false) {
  let start = -1
  let routesIndex = []
  routes.forEach(route => {
    if (/-index$/.test(route.name) || route.name === 'index') {
      // Save indexOf 'index' key in name
      let res = route.name.split('-')
      let s = res.indexOf('index')
      start = start === -1 || s < start ? s : start
      routesIndex.push(res)
    }
  })
  routes.forEach(route => {
    route.path = isChild ? route.path.replace('/', '') : route.path
    if (route.path.indexOf('?') > -1) {
      let names = route.name.split('-')
      let paths = route.path.split('/')
      if (!isChild) {
        paths.shift()
      } // clean first / for parents
      routesIndex.forEach(r => {
        let i = r.indexOf('index') - start //  children names
        if (i < paths.length) {
          for (let a = 0; a <= i; a++) {
            if (a === i) {
              paths[a] = paths[a].replace('?', '')
            }
            if (a < i && names[a] !== r[a]) {
              break
            }
          }
        }
      })
      route.path = (isChild ? '' : '/') + paths.join('/')
    }
    route.name = route.name.replace(/-index$/, '')
    if (route.children) {
      if (route.children.find(child => child.path === '')) {
        delete route.name
      }
      route.children = cleanChildrenRoutes(route.children, true)
    }
  })
  return routes
}

exports.createRoutes = function createRoutes(files, srcDir) {
  console.log('files =', files)
  let routes = []
  files.forEach(file => {
    let keys = file
    let route = { name: '', path: '', component: r(srcDir, file) }
    console.log('route =', route)
    let parent = routes
    keys.forEach((key, i) => {
      route.name = route.name
        ? route.name + '-' + key.replace('_', '')
        : key.replace('_', '')
      route.name += key === '_' ? 'all' : ''
      route.chunkName = file.replace(/\.(vue|js)$/, '')
      let child = _.find(parent, { name: route.name })
      if (child) {
        child.children = child.children || []
        parent = child.children
        route.path = ''
      } else {
        if (key === 'index' && i + 1 === keys.length) {
          route.path += i > 0 ? '' : '/'
        } else {
          route.path += '/' + (key === '_' ? '*' : key.replace('_', ':'))
          if (key !== '_' && key.indexOf('_') !== -1) {
            route.path += '?'
          }
        }
      }
    })
    // Order Routes path
    parent.push(route)
    parent.sort((a, b) => {
      if (!a.path.length) {
        return -1
      }
      if (!b.path.length) {
        return 1
      }
      // Order: /static, /index, /:dynamic
      // Match exact route before index: /login before /index/_slug
      if (a.path === '/') {
        return /^\/(:|\*)/.test(b.path) ? -1 : 1
      }
      if (b.path === '/') {
        return /^\/(:|\*)/.test(a.path) ? 1 : -1
      }
      let i = 0
      let res = 0
      let y = 0
      let z = 0
      const _a = a.path.split('/')
      const _b = b.path.split('/')
      for (i = 0; i < _a.length; i++) {
        if (res !== 0) {
          break
        }
        y = _a[i] === '*' ? 2 : _a[i].indexOf(':') > -1 ? 1 : 0
        z = _b[i] === '*' ? 2 : _b[i].indexOf(':') > -1 ? 1 : 0
        res = y - z
        // If a.length >= b.length
        if (i === _b.length - 1 && res === 0) {
          // change order if * found
          res = _a[i] === '*' ? -1 : 1
        }
      }
      return res === 0 ? (_a[i - 1] === '*' && _b[i] ? 1 : -1) : res
    })
  })
  return cleanChildrenRoutes(routes)
}
