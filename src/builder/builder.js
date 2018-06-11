import path from 'path'
import consola from 'consola'
import fsExtra from 'fs-extra'
import pify from 'pify'
import Glob from 'glob'

import { getPages } from '../common/utils'
import Options from '../common/options'

const glob = pify(Glob)

export default class Builder {
  constructor (mpa) {
    this.mpa = mpa
    this.options = mpa.options
  }
  async getFiles () {
    const files = await glob(this.options.rootDir + '/pages/*/*.vue')
    return files
  }
  // generate html through folders in pages directory
  async generateHtml () {
    consola.start('----generate html----')
    const files = await this.getFiles()
    const pages = await getPages(files, this.options.rootDir, '/pages')
    console.log('pages =', pages)
    const _path = this.options.rootDir + '/.mpa'
    // Ensure parent dir exits
    console.log(_path)
    console.log(path.dirname(_path))
    //await fsExtra.mkdirp(path.dirname(_path))
    Object.keys(pages).forEach(key => {
      //fsExtra.writeFile(this.options.rootDir + '/' + key, '11111', 'utf8')
    })
  }
  // generate routers through *.vue files in folders under pages directory
  async generateRouters () {
    consola.start('----generate routers----')
    const files = await this.getFiles()
    const pages = await getPages(files, this.options.rootDir, '/pages')
    console.log('pages222 =', pages)
  }
}