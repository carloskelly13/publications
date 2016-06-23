import React, { Component } from 'react'
import { autobind } from 'core-decorators'

export default class InspectorShapeLayer extends Component {

  @autobind
  moveToFront() {
    const shape = this.props.shape
    const shapes = this.props.doc.shapes

    const shapesToAdjust = shapes.filter(s => s.z > shape.z)
    shapesToAdjust.forEach(s => s.z -= 1)
    shape.z = shapes.length

    this.updateDocumentForLayerAdjustments({shapes, shape})
  }

  @autobind
  moveToBack() {
    const shape = this.props.shape
    const shapes = this.props.doc.shapes

    const shapesToAdjust = shapes.filter(s => s.z < shape.z)
    shapesToAdjust.forEach(s => s.z += 1)
    shape.z = 1

    this.updateDocumentForLayerAdjustments({shapes, shape})
  }

  @autobind
  moveForwards() {
    const shape = this.props.shape
    const shapes = this.props.doc.shapes

    const shapesToAdjust = shapes.filter(s => s.z === shape.z + 1)
    shapesToAdjust.forEach(s => s.z -= 1)
    shape.z += 1

    this.updateDocumentForLayerAdjustments({shapes, shape})
  }

  @autobind
  moveBackwards() {
    const shape = this.props.shape
    const shapes = this.props.doc.shapes

    const shapesToAdjust = shapes.filter(s => s.z === shape.z - 1)
    shapesToAdjust.forEach(s => s.z += 1)
    shape.z -= 1

    this.updateDocumentForLayerAdjustments({shapes, shape})
  }

  updateDocumentForLayerAdjustments(sender) {
    this.props.updateDocument({shapes: sender.shapes})
    this.props.updateShape(sender.shape)
  }

  render() {
    return (
      <div className="inspector-content-section">
        <h1>Move</h1>
        <button className="btn half left" onClick={this.moveToFront}>Front</button>
        <button className="btn half right" onClick={this.moveToBack}>Back</button>
        <button className="btn half left" onClick={this.moveForwards}>Forwards</button>
        <button className="btn half right" onClick={this.moveBackwards}>Backwards</button>
      </div>
    )
  }
}
