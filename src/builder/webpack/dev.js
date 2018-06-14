import htmlWebpackPlugin from 'html-webpack-plugin'

import WebpackBaseConfig from './base'

export default class WebpackDevConfig extends WebpackBaseConfig {
  constructor (builder) {
    super(builder, { name: 'server', isServer: true })
  }

  env() {
    return Object.assign(super.env(), {
      'process.env.VUE_ENV': JSON.stringify('client'),
      'process.browser': true,
      'process.client': true,
      'process.server': false
    })
  }

  plugins() {
    const plugins = super.plugins()
    plugins.push(
      new HTMLPlugin({
        filename: 'index.ssr.html',
        template: this.options.appTemplatePath,
        minify: true,
        inject: false // Resources will be injected using bundleRenderer
      })
    )

    plugins.push(
      new HTMLPlugin({
        filename: 'index.spa.html',
        template: this.options.appTemplatePath,
        minify: true,
        inject: true,
        chunksSortMode: 'dependency'
      }),
      new VueSSRClientPlugin({
        filename: 'vue-ssr-client-manifest.json'
      }),
      new webpack.DefinePlugin(this.env())
    )

    if (this.options.dev) {
      // TODO: webpackHotUpdate is not defined: https://github.com/webpack/webpack/issues/6693
      plugins.push(new webpack.HotModuleReplacementPlugin())
    }

    // Chunks size limit
    // https://webpack.js.org/plugins/aggressive-splitting-plugin/
    if (!this.options.dev && this.options.build.maxChunkSize) {
      plugins.push(
        new webpack.optimize.AggressiveSplittingPlugin({
          minSize: this.options.build.maxChunkSize,
          maxSize: this.options.build.maxChunkSize
        })
      )
    }

    // Webpack Bundle Analyzer
    // https://github.com/webpack-contrib/webpack-bundle-analyzer
    if (!this.options.dev && this.options.build.analyze) {
      const statsDir = path.resolve(this.options.buildDir, 'stats')

      plugins.push(new BundleAnalyzer.BundleAnalyzerPlugin(Object.assign({
        analyzerMode: 'static',
        defaultSizes: 'gzip',
        generateStatsFile: true,
        openAnalyzer: !(this.options.ci || this.options.test),
        reportFilename: path.resolve(statsDir, 'client.html'),
        statsFilename: path.resolve(statsDir, 'client.json')
      }, this.options.build.analyze)))
    }

    return plugins
  }
}