import _ from 'lodash'

import defaults from './mpa.config'

const Options = {}

export default Options

Options.from = function (_options) {
  const options = Object.assign({}, _options)
  _.defaultsDeep(options, defaults)
  return options
}
