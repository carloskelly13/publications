const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

const nodeEnv = process.env.NODE_ENV || 'development'
const isProd = nodeEnv === 'production'

const prodPlugins = isProd ? [
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      drop_console: true,
      unused: true
    },
    sourceMap: false,
    minimize: true,
    comments: false,
    mangle: true
  })
] : []

module.exports = {
  watch: true,

  devtool: isProd ? undefined : 'source-map',

  entry: {
    js: './app/js/app.js',
    vendor: [
      'react', 'react-dom', 'redux', 'redux-thunk',
      'react-router', 'react-addons-css-transition-group',
      'redux-simple-router', 'lodash', 'core-decorators',
      'isomorphic-fetch', 'object-assign'
    ]
  },

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
        loader: 'babel'
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
        loader: 'style!css!less'
      },
      {
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.(eot|woff|ttf|svg|png|otf)$/,
        loader: 'url?limit=1000'
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
    root: [
      path.join(__dirname, 'node_modules'),
      path.join(__dirname, 'app/js')
    ],
    alias: {
      'components': 'components',
      'containers': 'containers',
      'core': 'core',
      'actions': 'actions',
      'reducers': 'reducers',
      'stores': 'stores',
      'services': 'services'
    }
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(nodeEnv) }
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
      filename: 'vendor.bundle.js'
    }),

    new webpack.NoErrorsPlugin(),

    new HtmlWebpackPlugin({
      template: 'app/index.html',
      inject: 'body'
    }),

    ...prodPlugins
  ]
};
