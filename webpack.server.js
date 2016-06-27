const webpack = require('webpack')
const webpackDevConfig = require('./webpack.config.js')({ dev: true })
const WebpackDevServer = require('webpack-dev-server')

webpackDevConfig.entry.app.unshift('webpack-dev-server/client?http://localhost:4040/', 'webpack/hot/dev-server')
webpackDevConfig.plugins.push(new webpack.HotModuleReplacementPlugin())

const compile = webpack(webpackDevConfig)

const server = new WebpackDevServer(compile, {
  contentBase: '/dist',
  stats: { colors: true, progress: true },
  inline: true,
  hot: true,
  proxy: {
    '*' : {
      target: 'http://localhost:8080',
      secure: false
    }
  }
})

server.listen(4040, 'localhost', () => {})
