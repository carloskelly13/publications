var
  webpack = require('webpack'),
  webpackDevConfig = require('./webpack.config.js'),
  WebpackDevServer = require('webpack-dev-server');

var compile = webpack(webpackDevConfig);

var server = new WebpackDevServer(compile, {
  contentBase: '/dist',
  stats: {colors: true}
});

server.listen(8080, 'localhost', function() {});
