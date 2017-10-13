// @flow
import React, { Component } from "react"

type Props = {
  waitFor?: Object | bool,
  renderLoading: React.Node,
  renderContent: React.Node
}
export default class LoadingView extends Component<Props> {
  state = { isLoading: true }

  componentWillReceiveProps(nextProps) {
    if (nextProps.waitFor) {
      this.setState(() => ({ isLoading: false }))
    }
  }

  render() {
    return this.state.isLoading ? this.props.renderLoading : this.props.renderContent
  }
}
