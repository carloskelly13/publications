
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

    webpack: {
      module: {
        loaders: [
          { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel' }
        ]
      },
      watch: true
    },

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
