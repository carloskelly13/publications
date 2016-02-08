const webpack = require('webpack'),
  webpackDevConfig = require('./webpack.config.js'),
  WebpackDevServer = require('webpack-dev-server')

const compile = webpack(webpackDevConfig)

const server = new WebpackDevServer(compile, {
  contentBase: '/dist',
  stats: {colors: true},
  proxy: {
    '*' : {
      target: 'http://localhost:8080',
      secure: false
    }
  }
})

server.listen(4040, 'localhost', () => {})
