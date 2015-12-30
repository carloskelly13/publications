import React, {Component, PropTypes} from 'react'
import {omit} from 'lodash'

import InspectorShapeBorder from './inspector.shape.border'
import InspectorShapeColor from './inspector.shape.color'
import InspectorShapeMetrics from './inspector.shape.metrics'
import InspectorShapeText from './inspector.shape.text'
import InspectorShapeLayer from './inspector.shape.layer'

export default class InspectorShape extends Component {
  render() {
    let inspectorContent = null

    if (this.props.shape) {
      const {type} = this.props.shape
      const shapeMetricsContent = (
        <InspectorShapeMetrics
          inputValueChanged={::this.inputValueChanged}
          {...this.props} />
      )

      let shapeContentSections = null

      switch (type) {
        case 'text':
        shapeContentSections = (
          <InspectorShapeText
            inputValueChanged={::this.inputValueChanged}
            {...this.props} />
        )
        break

        case 'ellipse':
        case 'rect':
        shapeContentSections = (
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

      inspectorContent = (
        <div>
          {shapeMetricsContent}
          {shapeContentSections}
        </div>
      )
    } else {
      inspectorContent = (
        <div>
          No Shape Selected
        </div>
      )
    }

    return (
      <div className="inspector-pane inspector-pane-document">
        {inspectorContent}
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
