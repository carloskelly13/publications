import React, {Component} from 'react'

export default class InspectorTabBar extends Component {
  render() {
    const {selectedTab} = this.props

    return (
      <div className="inspector-tab-bar">
        <div
          className={`tab-button ${selectedTab === 'document' ? 'active' : ''}`}
          onClick={this.props.switchTab.bind(this, 'document')}
        >
          Document
        </div>
        <div
          className={`tab-button ${selectedTab === 'shape' ? 'active' : ''}`}
          onClick={this.props.switchTab.bind(this, 'shape')}
        >
          Shape
        </div>
      </div>
    )
  }
}
