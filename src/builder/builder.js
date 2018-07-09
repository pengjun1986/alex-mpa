import path from 'path'
import consola from 'consola'
import hash from 'hash-sum'
import fsExtra from 'fs-extra'
import pify from 'pify'
import _ from 'lodash'
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
    await this.generateHtml(pages)
    await this.generateRouters(pages)
    // const build = await this.webpackBuild()
    return this
  }
  async getAllPages () {
    const allVueFiles = await glob('pages/**/*.vue', {
      cwd: this.options.rootDir
    })
    const pages = await getPages(allVueFiles, this.options.rootDir, 'pages')
    return pages
  }

  async createModules (pages) {
    consola.start('----generate modules----')
    for (let page of pages) {
      await fsExtra.mkdirsSync(r(this.options.buildDir, page.name))
    }
    consola.success('----generate modules----')
  }
  // generate html through folders in pages directory
  async generateHtml (pages) {
    consola.start('----generate html----')
    const fileContent = await fsExtra.readFile(this.options.appTemplatePath, 'utf8')
    for (let page of pages) {
      await fsExtra.writeFile(path.join(this.options.buildDir, page.name + '.html'), fileContent, 'utf8')
    }
    consola.success('----generate html----')
  }

  // generate routers through *.vue files in folders under pages directory
  async generateRouters (pages) {
    consola.start('----generate routers----')
    const fileContent = await fsExtra.readFile(path.resolve(this.options.appDir, 'router.js'), 'utf8')
    for (let page of pages) {
      let content
      try {
        const compiled = _.template(fileContent, {
          imports: {
            hash
          }
        })
        content = compiled(
          Object.assign({}, {
            router: page.router
          }, {
            user: 'test'
          })
        )
      } catch (err) {
        /* istanbul ignore next */
        throw new Error(`Could not compile template ${page.name}: ${err.message}`)
      }
      // Write file
      await fsExtra.writeFile(path.join(this.options.buildDir, page.name, 'router.js'), content, 'utf8')
    }
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