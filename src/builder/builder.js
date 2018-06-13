import path from 'path'
import consola from 'consola'
import fsExtra from 'fs-extra'
import pify from 'pify'
import Glob from 'glob'

import { getPages } from '../common/utils'
import Options from '../common/options'

import WebpackDevConfig from './webpack/dev'
import WebpackProdConfig from './webpack/prod'

const glob = pify(Glob)

export default class Builder {
  constructor (mpa) {
    this.mpa = mpa
    this.options = mpa.options
  }
  async build () {
    await this.generateHtml()
    await this.generateRouters()
    await this.webpackBuild()
  }
  async getFiles () {
    const files = await glob(path.join(this.options.rootDir, 'pages' + '/**/*.vue'))
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
    //await fsExtra.mkdirp(path.dirname(_path))
    Object.keys(pages).forEach(key => {
      //fsExtra.writeFile(this.options.rootDir + '/' + key, '11111', 'utf8')
    })
    consola.success('----generate html----')
  }
  // generate routers through *.vue files in folders under pages directory
  async generateRouters () {
    consola.start('----generate routers----')
  }

  async webpackBuild() {
    this.webpackCompile()
  }

  webpackCompile(compiler) {
    return new Promise(async (resolve, reject) => {
      if (this.options.dev) {
        // --- Dev Build ---
        return this.webpackDev(compiler)
      } else {
        // --- Production Build ---
      }
    })
  }

  webpackDev(compiler) {

  }
}