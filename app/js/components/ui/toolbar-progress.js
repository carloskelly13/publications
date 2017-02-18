import React, { Component } from "react"
import { Toolbar } from "./toolbar"
import { AboutButton } from "./about.button"

class ToolbarProgress extends Component {
  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <Toolbar>
        <AboutButton />
      </Toolbar>
    )
  }
}

export { ToolbarProgress }
