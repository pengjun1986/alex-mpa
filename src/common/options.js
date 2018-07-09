import path from 'path'
import fs from 'fs'
import _ from 'lodash'

import defaults from './mpa.config'

const Options = {}

export default Options

Options.from = function (_options) {
  const options = Object.assign({}, _options)
  _.defaultsDeep(options, defaults)

  options.appDir = path.resolve(options.rootDir, 'node_modules/alex-mpa/src/app')
  options.buildDir = path.resolve(options.rootDir, options.buildDir)

  // If app.html is defined, set the template path to the user template
  options.appTemplatePath = path.resolve(options.appDir, 'views/app.template.html')
  if (fs.existsSync(path.join(options.rootDir, 'app.html'))) {
    options.appTemplatePath = path.join(options.rootDir, 'app.html')
  }
  return options
}
