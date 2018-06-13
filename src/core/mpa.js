import enableDestroy from 'server-destroy'
import connect from 'connect'
import consola from 'consola'
import chalk from 'chalk'

import Options from '../common/options'

export default class Mpa {
  constructor (options = {}) {
    this.options = Options.from(options)
  }
  async ready () {

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
}