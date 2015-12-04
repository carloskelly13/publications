import React, {Component} from 'react'

export default class InspectorBreadcrumbBar extends Component {
  render() {
    const shapeSelected = this.props.shape !== null
    const shapeBreadcrumb = shapeSelected ? (<span>
      <span>&nbsp;/&nbsp;</span>
      <span>Shape</span>
    </span>) : <div></div>

    return (
      <div className="breadcrumb-bar">
        <span
          className={`breadcrumb-bar-root-element ${shapeSelected ? 'active' : ''}`}
          onClick={this.props.updateSelectedCanvasObject.bind(this, null)}>
          Document
        </span>
        {shapeBreadcrumb}
      </div>
    )
  }
}
