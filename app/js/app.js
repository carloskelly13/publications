import React from 'react'
import { startAppRouter } from './router'
import NProgress from 'nprogress'

import '../../node_modules/nprogress/nprogress.css'
import '../css/_style.less'

startAppRouter()

NProgress.configure({ showSpinner: false })

console.debug(`Starting Publications with React ${React.version}.`)
