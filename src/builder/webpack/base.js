export default class WebpackBaseConfig {
  constructor(builder, options) {
    this.name = options.name
    this.isServer = options.isServer
    this.builder = builder
    this.nuxt = this.builder.nuxt
    this.isStatic = builder.isStatic
    this.spinner = builder.spinner
  }
}
