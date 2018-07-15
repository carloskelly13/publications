const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer");

module.exports = {
  entry: {
    app: ["./src/index.js"],
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
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, "src")],
        use: "babel-loader",
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "babel-loader",
          },
          {
            loader: "ts-loader",
          },
        ],
      },
      { test: /\.css$/, use: "css-loader" },
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
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: "body",
    }),
    // new BundleAnalyzerPlugin.BundleAnalyzerPlugin(),
  ],

  node: {
    global: true,
    crypto: "empty",
    module: false,
    clearImmediate: false,
    setImmediate: false,
  },
};
