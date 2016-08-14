import React, { Component } from 'react'
import NProgress from 'nprogress'

export default class DocumentLoadingNavbar extends Component {

  componentDidMount() {
    NProgress.start()
  }

  componentWillUnmount() {
    NProgress.done()
  }

  render() {
    return <div className="toolbar"></div>
  }
}
