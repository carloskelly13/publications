const webpackConfig = require('./webpack.config')
const testWebpackConfig = Object.assign({}, webpackConfig, {
  devtool: 'inline-source-map',
  entry: {},
  watch: true
})

module.exports = config => {
  config.set({
    basePath: './test/',

    frameworks: [ 'mocha', 'chai' ],

    files: [
      '**/*.spec.js'
    ],

    preprocessors: {
      '**/*.spec.js' : [ 'webpack' ]
    },

    webpack: testWebpackConfig,

    colors: true,

    browsers: [ 'Chrome' ],

    singleRun: true,

    plugins: [
      'karma-webpack',
      'karma-mocha',
      'karma-chai',
      'karma-chrome-launcher'
    ]
  })
}
