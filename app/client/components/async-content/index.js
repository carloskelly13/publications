import { Component } from "react"

export default class LoadingView extends Component {
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
