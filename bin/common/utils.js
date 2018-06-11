const { resolve } = require('path')
const { existsSync } = require('fs')

const getRootDir = argv => resolve(argv._[0] || '.')

const getMpaConfigFile = argv => resolve(getRootDir(argv), argv['config-file'])

exports.loadMpaConfig = argv => {
  const rootDir = getRootDir(argv)
  const mpaConfigFile = getMpaConfigFile(argv)

  let options = {}

  if (existsSync(mpaConfigFile)) {
    console.log('existsSync')
  }
  options.rootDir = rootDir

  return options
}
