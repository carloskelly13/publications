const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const webpack = require("webpack")

module.exports = env => {
  const addPlugin = (add, plugin) => add ? plugin : undefined
  const ifProd = plugin => addPlugin(env.prod, plugin)
  const ifDev = plugin => addPlugin(env.dev, plugin)
  const removeEmpty = array => array.filter(el => !!el)

  return {
    devtool: env.prod ? false : "cheap-module-eval-source-map",

    entry: {
      app: removeEmpty(
        [
          ...(env.dev ? [
            "webpack-dev-server/client?http://localhost:4040",
          ] : []),
          "./app/client/index.js"
        ]
      ),
      vendor: [ "./app/client/vendor.js" ]
    },

    output: {
      path: `${__dirname}/dist`,
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
            "^/api": ""
          }
        }
      },
      historyApiFallback: true,
      hot: false
    },

    module: {
      loaders: [
        { test: /\.js$/,
          include: [
            path.resolve(__dirname, "app/client")
          ],
          loader: "babel-loader"
        },
        { test: /\.css$/, loader: "css-loader" },
        { test: /\.(eot|woff|ttf|svg|png|otf)$/, loader: "url-loader?limit=64" },
        { test: /\.json$/, loader: "json-loader" }
      ]
    },

    resolve: {
      extensions: [".js"],
      modules: [
        path.join(__dirname, "node_modules")
      ]
    },

    plugins: removeEmpty([
      new webpack.optimize.CommonsChunkPlugin({
        name: [ "vendor" ]
      }),

      ifProd(new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
        quiet: true
      })),

      new webpack.NoEmitOnErrorsPlugin(),

      new webpack.DefinePlugin({
        "process.env": { NODE_ENV: `${env.prod ? "\"production\"" : "\"development\""}` }
      }),

      ifProd(new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false }
      })),

      new HtmlWebpackPlugin({
        template: "app/client/index.html",
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
