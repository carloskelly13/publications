var
  path    = require('path'),
  webpack = require('webpack');

module.exports = {
  watch: true,

  entry: [
    './js/src/app.js'
  ],

  output: {
    path: __dirname + '/js',
    filename: 'app.js'
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'js/src')
        ],
        loader: 'babel-loader'
      }
    ]
  },

  resolve: {
    root: [
      path.join(__dirname, 'node_modules')
    ],
    extensions: ['', '.js', '.jsx']
  },

  plugins: [
    new webpack.NoErrorsPlugin()
  ]
};
