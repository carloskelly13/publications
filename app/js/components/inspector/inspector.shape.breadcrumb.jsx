import React, {Component} from 'react'

export default class InspectorShapeBreadcrumbBar extends Component {
  render() {
    return (
      <div className="breadcrumb-bar">
        <span onClick={this.props.updateSelectedCanvasObject.bind(this, null)}>
          Document
        </span>
        <span>&nbsp;/&nbsp;</span>
        <span>Shape</span>
      </div>
    )
  }
}
