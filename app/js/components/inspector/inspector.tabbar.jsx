import React, {Component} from 'react'

export default class InspectorTabBar extends Component {
  render() {
    console.log(this.props)

    return (
      <div className="inspector-tab-bar">
        <div
          className="tab-button"
          onClick={this.props.switchTab.bind(this, 'document')}
        >
          Document
        </div>
        <div
          className="tab-button"
          onClick={this.props.switchTab.bind(this, 'shape')}
        >
          Shape
        </div>
      </div>
    )
  }
}
