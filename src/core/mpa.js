import enableDestroy from 'server-destroy'
import connect from 'connect'
import consola from 'consola'
import chalk from 'chalk'
import _ from 'lodash'

import Options from '../common/options'

export default class Mpa {
  constructor (options = {}) {
    this.options = Options.from(options)

    // Hooks
    this._hooks = {}
    // console.log('this.hook =', this.hook)
    // this.hook = this.hook.bind(this)
    this._ready = this.ready().catch(err => {
      consola.fatal(err)
    })
  }
  async ready () {
    if (this._ready) {
      return this._ready
    }

    // Add hooks
    if (_.isPlainObject(this.options.hooks)) {
      this.addObjectHooks(this.options.hooks)
    } else if (typeof this.options.hooks === 'function') {
      this.options.hooks(this.hook)
    }

    // Call ready hook
    await this.callHook('ready', this)

    return this
  }
  listen(port = 3000, host = 'localhost') {
    return this.ready().then(() => new Promise((resolve, reject) => {
      const server = connect().listen(
        { port, host, exclusive: false },
        err => {
          /* istanbul ignore if */
          if (err) {
            return reject(err)
          }

          const listenURL = chalk.underline.blue(`http://${host}:${port}`)
          console.log(
            '\n' +
            chalk.bgGreen.black(' OPEN ') +
            chalk.green(` ${listenURL}\n`)
          )

          // Close server on nuxt close
          // this.hook(
          //   'close',
          //   () =>
          //     new Promise((resolve, reject) => {
          //       // Destroy server by forcing every connection to be closed
          //       server.destroy(err => {
          //         consola.debug('server closed')
          //         /* istanbul ignore if */
          //         if (err) {
          //           return reject(err)
          //         }
          //         resolve()
          //       })
          //     })
          // )
          //
          // this.callHook('listen', server, { port, host }).then(resolve)
        }
      )

      // Add server.destroy(cb) method
      enableDestroy(server)
    }))
  }

  async callHook(name, ...args) {
    if (!this._hooks[name]) {
      return
    }
    consola.debug(`Call ${name} hooks (${this._hooks[name].length})`)
    try {
      await sequence(this._hooks[name], fn => fn(...args))
    } catch (err) {
      consola.error(err)
      this.callHook('error', err)
    }
  }

  addObjectHooks(hooksObj) {
    Object.keys(hooksObj).forEach(name => {
      let hooks = hooksObj[name]
      hooks = Array.isArray(hooks) ? hooks : [hooks]

      hooks.forEach(hook => {
        this.hook(name, hook)
      })
    })
  }
}