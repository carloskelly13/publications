import React, {Component, PropTypes} from 'react'
import {omit} from 'lodash'

import InspectorShapeBreadcrumbBar from './inspector.shape.breadcrumb'
import InspectorShapeBorder from './inspector.shape.border'
import InspectorShapeColor from './inspector.shape.color'
import InspectorShapeMetrics from './inspector.shape.metrics'
import InspectorShapeText from './inspector.shape.text'
import InspectorShapeLayer from './inspector.shape.layer'

export default class InspectorShape extends Component {
  render() {
    const {type} = this.props.shape
    let inspectorSections = null

    switch (type) {
      case 'text':
      inspectorSections = (
        <InspectorShapeText
          inputValueChanged={::this.inputValueChanged}
          {...this.props} />
      )
      break

      case 'ellipse':
      case 'rect':
      inspectorSections = (
        <div>
          <InspectorShapeColor
            inputValueChanged={::this.inputValueChanged}
            {...omit(this.props, ['updateDocument', 'doc'])} />
          <InspectorShapeBorder
            inputValueChanged={::this.inputValueChanged}
            {...omit(this.props, ['updateDocument', 'doc'])} />
          <InspectorShapeLayer
            inputValueChanged={::this.inputValueChanged}
            {...this.props} />
        </div>
      )
      break
    }

    return (
      <div className="inspector-pane inspector-pane-document">
        <InspectorShapeBreadcrumbBar
          updateSelectedCanvasObject={this.props.updateSelectedCanvasObject}/>
        <InspectorShapeMetrics
          inputValueChanged={::this.inputValueChanged}
          {...this.props} />
        {inspectorSections}
      </div>
    )
  }

  inputValueChanged(event) {
    const {
      shape,
      updateShape
    } = this.props

    let updatedValue = event.target.value

    if (!isNaN(updatedValue)) {
      updatedValue = parseFloat(updatedValue)
    }

    shape[event.target.name] = updatedValue
    updateShape(shape)
  }
}
