const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",

  entry: {
    app: ["webpack-hot-middleware/client?reload=true", "./src/index.tsx"],
  },

  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "dist/public"),
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
    rules: [
      {
        test: /\.tsx?$/,
        use: ["ts-loader"],
        exclude: path.join(__dirname, "/src/server/*"),
      },
      {
        test: /\.(eot|woff|ttf|svg|png|otf)$/,
        use: "url-loader?limit=64",
      },
      { test: /\.json$/, use: "json-loader" },
    ],
  },

  resolve: {
    extensions: [".js", ".ts", ".tsx"],
    modules: [path.join(__dirname, "node_modules")],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: "body",
    }),
  ],

  node: {
    global: true,
    crypto: "empty",
    module: false,
    clearImmediate: false,
    setImmediate: false,
  },
};
