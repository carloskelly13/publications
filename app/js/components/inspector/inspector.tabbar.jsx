import React, {Component} from 'react'

export default class InspectorTabBar extends Component {
  render() {
    return (
      <div className="inspector-tab-bar">
        <div
          className="tab-button"
          onClick={this.props.switchTab.bind(this, 'document')}>
          Doc
        </div>
        <div
          className="tab-button"
          onClick={this.props.switchTab.bind(this, 'shape')}>
          Shape
        </div>
      </div>
    )
  }
}
