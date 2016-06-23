const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const extractLESS = new ExtractTextPlugin('app.css')
const extractCSS = new ExtractTextPlugin('vendor.css')

const vendor = [
  'react', 'react-dom', 'redux', 'redux-thunk',
  'react-router', 'react-addons-css-transition-group',
  'redux-simple-router', 'lodash', 'core-decorators',
  'isomorphic-fetch', 'object-assign', 'nprogress',
  'validator', 'react-redux', 'history/lib', 'node-uuid'
]

module.exports = {
  // const addPlugin = (add, plugin) => add ? plugin : undefined
  // const ifProd = plugin => addPlugin(options.prod, plugin)
  // const removeEmpty = array => array.filter(el => !!el)

  // return {
    // devtool: isProd ? undefined : 'cheap-module-source-map',

    entry: {
      app: [ './app/js/app.js' ],
      vendor
    },

    output: {
      path: __dirname + '/dist',
      sourceMapFilename: '[name].map',
      filename: '[name].js',
      chunkFilename: '[id].chunk.js'
    },

    module: {
      loaders: [
        { test: /\.jsx?$/,
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
        { test: /\.less$/, loader: extractLESS.extract([ 'css', 'less' ]) },
        { test: /\.css$/, loader: extractCSS.extract([ 'css' ]) },
        { test: /\.(eot|woff|ttf|svg|png|otf)$/, loader: 'url?limit=64' },
        { test: /\.json$/, loader: 'json' }
      ]
    },

    resolve: {
      extensions: ['', '.js', '.jsx'],
      modules: [
        path.join(__dirname, 'node_modules'),
        path.join(__dirname, 'app/js')
      ]
    },

    plugins: [
      extractLESS, extractCSS,

      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor'
      }),

      new webpack.optimize.DedupePlugin(),

      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
        quiet: true,
      }),

      new webpack.DefinePlugin({
        'process.env': { NODE_ENV: '"production"', },
      }),

      new webpack.optimize.UglifyJsPlugin({
        compress: { screw_ie8: true, warnings: false },
      }),

      new HtmlWebpackPlugin({
        template: 'app/index.html',
        inject: 'body'
      })
    ],

    node: {
      global: 'window',
      crypto: 'empty',
      module: false,
      clearImmediate: false,
      setImmediate: false
    }
  // }
}
