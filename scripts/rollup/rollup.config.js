import defaultsDeep from 'lodash/defaultsDeep'

export default ({name, input, options}) => defaultsDeep({}, options, {
  input,
  output: {
    file: 'dist/mpa.js',
    format: 'cjs'
  }
})