const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const webpack = require("webpack")
const ExtractTextPlugin = require("extract-text-webpack-plugin")

const extractLESS = new ExtractTextPlugin("app.css")
const extractCSS = new ExtractTextPlugin("vendor.css")

module.exports = env => {
  const addPlugin = (add, plugin) => add ? plugin : undefined
  const ifProd = plugin => addPlugin(env.prod, plugin)
  const ifDev = plugin => addPlugin(env.dev, plugin)
  const removeEmpty = array => array.filter(el => !!el)

  return {
    devtool: env.prod ? undefined : "inline-source-map",

    entry: {
      app: removeEmpty([
        "./app/js/app.js",
        ifDev("webpack-hot-middleware/client?reload=true")
      ]),
      vendor: [ "./app/js/vendor.js" ]
    },

    output: {
      path: __dirname + "/dist",
      sourceMapFilename: "[name].map",
      filename: "[hash].[name].js",
      publicPath: "/"
    },

    devServer: {
      proxy: {
        "/api": {
          target: "http://api.publicationsapp.com",
          changeOrigin: true,
          pathRewrite: {
            "^/api" : ""
          }
        }
      },
      historyApiFallback: true
    },

    module: {
      loaders: [
        { test: /\.jsx?$/,
          include: [
            path.resolve(__dirname, "app/js")
          ],
          loader: "babel-loader"
        },
        {
          test: /\.jsx?$/,
          include: [
            path.resolve(__dirname, "app/js")
          ],
          loader: "eslint-loader"
        },
        { test: /\.less$/, loader: extractLESS.extract([ "css-loader", "less-loader" ]) },
        { test: /\.css$/, loader: extractCSS.extract([ "css-loader" ]) },
        { test: /\.(eot|woff|ttf|svg|png|otf)$/, loader: "url-loader?limit=64" },
        { test: /\.json$/, loader: "json-loader" }
      ]
    },

    resolve: {
      extensions: [".js", ".jsx"],
      modules: [
        path.join(__dirname, "node_modules"),
        path.join(__dirname, "app/js"),
        path.join(__dirname, "app/css"),
        path.join(__dirname, "app/img")
      ]
    },

    plugins: removeEmpty([
      extractLESS, extractCSS,

      new webpack.optimize.CommonsChunkPlugin({
        name: [ "vendor", "manifest" ]
      }),

      ifProd(new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
        quiet: true,
      })),

      ifDev(new webpack.HotModuleReplacementPlugin()),

      new webpack.DefinePlugin({
        "process.env": { NODE_ENV: `${env.prod ? '"production"' : '"development"'}`, },
      }),

      ifProd(new webpack.optimize.UglifyJsPlugin({
        compress: { screw_ie8: true, warnings: false },
      })),

      new HtmlWebpackPlugin({
        template: "app/index.html",
        inject: "body"
      })
    ]),

    node: {
      global: true,
      crypto: "empty",
      module: false,
      clearImmediate: false,
      setImmediate: false
    }

  }
}
