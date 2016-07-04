import React, { Component } from 'react'
import { autobind } from 'core-decorators'

export default class InspectorShapeLayer extends Component {

  @autobind
  adjustShape(event) {
    const adjustDirection = event
      .nativeEvent
      .target
      .attributes
      .getNamedItem('data-adjust-direction')
      .value

    const { shapes } = this.props.doc
    const { id, z } = this.props.shape

    const adjustedShapes = shapes.map(shape => {
      switch (adjustDirection) {
      case 'front':
        if (shape.id === id) {
          shape.z = shapes.length
        } else if (shape.z > z) {
          shape.z = shape.z - 1
        }
        return shape

      case 'back':
        if (shape.id === id) {
          shape.z = 1
        } else if (shape.z < z) {
          shape.z = shape.z + 1
        }
        return shape

      case 'forwards':
        if (shape.id === id) {
          shape.z = Math.min(shape.z + 1, shapes.length)
        } else if (shape.z === z + 1) {
          shape.z = shape.z - 1
        }
        return shape

      case 'backwards':
        if (shape.id === id) {
          shape.z = Math.max(shape.z - 1, 1)
        } else if (shape.z === z - 1) {
          shape.z = shape.z + 1
        }
        return shape

      default: return shape
      }
    })

    const adjustedShape = shapes.find(s => s.id === id)

    this.props.updateDocument({ shapes: adjustedShapes })
    this.props.updateShape(adjustedShape)
  }

  render() {
    return (
      <div className="inspector-content-section">
        <h1>Move</h1>
        <button
          className="btn half left"
          data-adjust-direction="front"
          onClick={this.adjustShape}>Front</button>
        <button
          className="btn half right"
          data-adjust-direction="back"
          onClick={this.adjustShape}>Back</button>
        <button
          className="btn half left"
          data-adjust-direction="forwards"
          onClick={this.adjustShape}>Forwards</button>
        <button
          className="btn half right"
          data-adjust-direction="backwards"
          onClick={this.adjustShape}>Backwards</button>
      </div>
    )
  }
}
