const express = require("express")
const path = require("path")
const history = require("connect-history-api-fallback")

const webpack = require("webpack")
const webpackConfig = require("./webpack.config.js")({ dev: true })
const webpackDevMiddleware = require("webpack-dev-middleware")
const webpackHotMiddleware = require("webpack-hot-middleware")
const proxy = require("http-proxy-middleware")

const app = express()
const compiler = webpack(webpackConfig)

app.use(history())

app.use(proxy("/api", {
  target: "http://api.publicationsapp.com",
  changeOrigin: true,
  pathRewrite: {
    "^/api" : ""
  }
}))

app.use(webpackDevMiddleware(compiler, {
  publicPath: "http://localhost:4040/"
}))

app.use(webpackHotMiddleware(compiler))

app.listen(4040, () => console.log("🎉 Publications started on 4040."))
