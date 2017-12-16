const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = env => {
  const addPlugin = (add, plugin) => (add ? plugin : undefined);
  const ifProd = plugin => addPlugin(env.prod, plugin);
  const removeEmpty = array => array.filter(el => !!el);

  return {
    devtool: env.prod ? false : "cheap-module-eval-source-map",

    entry: {
      app: removeEmpty([
        ...(env.dev ? ["webpack-dev-server/client?http://localhost:4040"] : []),
        "babel-polyfill",
        "./app/client/index.js",
      ]),
    },

    output: {
      path: `${__dirname}/dist`,
      sourceMapFilename: "[name].map",
      filename: "[hash].[name].js",
      publicPath: "/",
      pathinfo: true,
    },

    devServer: {
      proxy: {
        "/api": {
          target: "http://localhost:8080",
          changeOrigin: true,
          pathRewrite: {
            "^/api": "",
          },
        },
      },
      historyApiFallback: true,
      hot: false,
    },

    module: {
      loaders: [
        {
          test: /\.js$/,
          include: [path.resolve(__dirname, "app/client")],
          loader: "babel-loader",
        },
        { test: /\.css$/, loader: "css-loader" },
        {
          test: /\.(eot|woff|ttf|svg|png|otf)$/,
          loader: "url-loader?limit=64",
        },
        { test: /\.json$/, loader: "json-loader" },
      ],
    },

    resolve: {
      extensions: [".js"],
      modules: [path.join(__dirname, "node_modules")],
    },

    plugins: removeEmpty([
      ifProd(
        new webpack.LoaderOptionsPlugin({
          minimize: true,
          debug: false,
          quiet: true,
        })
      ),

      new webpack.NoEmitOnErrorsPlugin(),

      ifProd(
        new webpack.DefinePlugin({
          "process.env": {
            NODE_ENV: JSON.stringify("production"),
          },
        })
      ),

      ifProd(
        new webpack.optimize.UglifyJsPlugin({
          compress: { warnings: false },
        })
      ),

      new HtmlWebpackPlugin({
        template: "app/client/index.html",
        inject: "body",
      }),
    ]),

    node: {
      global: true,
      crypto: "empty",
      module: false,
      clearImmediate: false,
      setImmediate: false,
    },
  };
};
