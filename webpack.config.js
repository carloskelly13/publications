/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",

  entry: {
    app: ["./src/app.tsx"],
  },

  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
          },
        },
        exclude: path.join(__dirname, "/src/server/*"),
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|otf)$/,
        use: "url-loader?limit=64",
      },
      { test: /\.json$/, use: "json-loader" },
    ],
  },

  devtool: "inline-source-map",

  resolve: {
    extensions: [".mjs", ".js", ".ts", ".tsx"],
    modules: [path.join(__dirname, "node_modules")],
  },

  devServer: {
    historyApiFallback: true,
    host: "localhost",
    inline: true,
    port: 4000,
    proxy: {
      "/graphql": "http://localhost:4004",
      "/documents/*/pdf": "http://localhost:4004",
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: "body",
    }),
  ],
};
