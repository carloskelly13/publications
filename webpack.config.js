const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",

  entry: {
    app: ["./src/index.tsx"],
  },

  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "dist/public"),
    pathinfo: true,
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
