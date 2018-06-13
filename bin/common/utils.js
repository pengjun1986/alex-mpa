const { resolve } = require('path')
const { existsSync } = require('fs')
const esm = require('esm')(module, {
  cache: false,
  cjs: {
    cache: true,
    vars: true,
    namedExports: true
  }
})

const getRootDir = argv => resolve(argv._[0] || '.')

const getMpaConfigFile = argv => resolve(getRootDir(argv), argv['config-file'])

exports.loadMpaConfig = argv => {
  const rootDir = getRootDir(argv)
  const mpaConfigFile = getMpaConfigFile(argv)

  let options = {}

  if (existsSync(mpaConfigFile)) {
    options = esm(mpaConfigFile)
    if (!options) {
      options = {}
    }
    if (options.default) {
      options = options.default
    }
  } else if (argv['config-file'] !== 'mpa.config.js') {
    consola.fatal('Could not load config file: ' + argv['config-file'])
  }

  options.rootDir = rootDir

  return options
}

exports.getLatestHost = argv => {
  const port = argv.port || process.env.PORT || process.env.npm_package_config_mpa_port
  const host = argv.hostname || process.env.HOST || process.env.npm_package_config_mpa_host
  return { port, host }
}
