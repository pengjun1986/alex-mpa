import path from 'path'
import consola from 'consola'
import fsExtra from 'fs-extra'
import pify from 'pify'
import Glob from 'glob'
import webpack from 'webpack'

import { r, getPages } from '../common/utils'
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
    // Create .mpa/, .mpa/components and .mpa/dist folders
    await fsExtra.remove(r(this.options.buildDir), )
    if (!this.options.dev) {
      await fsExtra.mkdirp(r(this.options.buildDir, 'dist'))
    }

    // get the multi page foldert
    const pages = await this.getAllPages()

    await this.createModules(pages)
    await this.generateHtml()
    await this.generateRouters()
    // const build = await this.webpackBuild()
    return this
  }
  async getFiles () {
    const files = await glob(path.join(this.options.rootDir, 'pages' + '/**/*.vue'))
    return files
  }
  async getAllPages () {
    const files = await this.getFiles()
    const pages = await getPages(files, this.options.rootDir, '/pages')
    return pages
  }
  // generate html through folders in pages directory
  async generateHtml () {
    consola.start('----generate html----')
    /*
    const webpackDevConfig = new WebpackDevConfig(this)
    webpack(webpackDevConfig, (err, stats) => {
      if (err) throw err
      process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
        chunks: false,
        chunkModules: false
      }) + '\n\n')

      if (stats.hasErrors()) {
        console.log(chalk.red('  Build failed with errors.\n'))
        process.exit(1)
      }

      console.log(chalk.cyan('  Build complete.\n'))
      console.log(chalk.yellow(
        '  Tip: built files are meant to be served over an HTTP server.\n' +
        '  Opening index.html over file:// won\'t work.\n'
      ))
    })
    */
    // Ensure parent dir exits
    //await fsExtra.mkdirp(path.dirname(_path))
    consola.success('----generate html----')
  }
  async createModules (pages) {
    for (let page of pages) {
      await fsExtra.mkdirsSync(r(this.options.buildDir, page.name))
    }
  }
  // generate routers through *.vue files in folders under pages directory
  async generateRouters () {
    consola.start('----generate routers----')

    consola.success('----generate routers----')
  }

  async webpackBuild() {
    await this.webpackCompile()
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