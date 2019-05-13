const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "production",

  entry: {
    app: ["./src/app.tsx"],
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
        use: { loader: "ts-loader", options: { happyPackMode: true } },
        exclude: path.join(__dirname, "/src/server/*"),
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
      },
      {
        test: /\.(eot|woff|ttf|svg|png|otf)$/,
        use: "url-loader?limit=64",
      },
      { test: /\.json$/, use: "json-loader" },
    ],
  },

  resolve: {
    extensions: [".mjs", ".js", ".ts", ".tsx"],
    modules: [path.join(__dirname, "node_modules")],
  },

  devtool: "source-map",

  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": "'production'",
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: "body",
    }),
  ],
};
