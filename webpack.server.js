var
  webpack = require('webpack'),
  webpackDevConfig = require('./webpack.config.js'),
  WebpackDevServer = require('webpack-dev-server');

var compile = webpack(webpackDevConfig);

var server = new WebpackDevServer(compile, {
  contentBase: '/dist',
  stats: {colors: true},
  proxy: {
    '*' : {
      target: 'http://localhost:8080',
      secure: false
    }
  }
});

server.listen(8000, 'localhost', function() {});
