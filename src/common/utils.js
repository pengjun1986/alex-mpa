const path = require('path')

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