import React from 'react'
import AppRouter from './router'
import NProgress from 'nprogress'

// import '../../node_modules/nprogress/nprogress.css'
import '../css/_style.less'

new AppRouter().run()

NProgress.configure({
  showSpinner: false
})

console.debug(`Starting Publications with React ${React.version}.`)
