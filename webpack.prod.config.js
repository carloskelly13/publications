const path = require('path'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  webpack = require('webpack')

module.exports = {
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
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'app/js')
        ],
        loader: 'eslint-loader'
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
      path.join(__dirname, 'node_modules'),
      path.join(__dirname, 'app/js')
    ],
    extensions: ['', '.js', '.jsx'],
    alias: {
      'components': 'components',
      'actions': 'actions',
      'reducers': 'reducers',
      'stores': 'stores',
      'services': 'services'
    }
  },

  plugins: [
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: 'app/index.html',
      inject: 'body'
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ]
};
