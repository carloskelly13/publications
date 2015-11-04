var
  path = require('path'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  webpack = require('webpack');

module.exports = {
  watch: true,

  entry: [
    './app/js/app.js'
  ],

  output: {
    path: __dirname + '/dist',
    filename: 'app.js'
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'app/js')
        ],
        loader: 'babel-loader?optional[]=runtime&stage=0'
      },
      {
        test: /\.less$/,
        loader: "style!css!less"
      },
      {
        test: /\.(eot|woff|ttf|svg|png|otf)$/,
        loader: 'url?limit=1000'
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
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: 'app/index.html',
      inject: 'body'
    })
  ]
};
