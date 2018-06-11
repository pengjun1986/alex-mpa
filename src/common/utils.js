export const getPages = (files, srcDir, pagesDir) => {
  let pages = {}
  files.forEach(f => {
    const path = f.replace(srcDir + pagesDir + '/', '').replace('.vue', '')
    const paths = path.split('/')
    const pageName = paths[0]
    if (!pages[pageName]) {
      pages[pageName] = {
        routes: []
      }
    }
    pages[pageName].routes.push(paths[1])
  })
  return pages
}