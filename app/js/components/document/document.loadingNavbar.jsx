import React, { Component } from 'react'
import NProgress from 'nprogress'
import AboutButton from '../ui/about.button'

export default class DocumentLoadingNavbar extends Component {

  componentDidMount() {
    NProgress.start()
  }

  componentWillUnmount() {
    NProgress.done()
  }

  render() {
    return <div className="navbar-container">
      <div className="navbar-controls-left">
        <AboutButton />
      </div>
    </div>
  }
}
