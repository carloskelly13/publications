import React, {Component} from 'react'
import {cloneDeep, filter} from 'lodash'

export default class InspectorShapeLayer extends Component {
  moveToFront() {
    const shape = this.props.shape
    const shapes = this.props.doc.get('shapes')

    const shapesToAdjust = filter(shapes, s => s.z > shape.z)
    shapesToAdjust.forEach(s => s.z -= 1)
    shape.z = shapes.length

    this.updateDocumentForLayerAdjustments({shapes, shape})
  }

  moveToBack() {
    const shape = this.props.shape
    const shapes = this.props.doc.get('shapes')

    const shapesToAdjust = filter(shapes, s => s.z < shape.z)
    shapesToAdjust.forEach(s => s.z += 1)
    shape.z = 1

    this.updateDocumentForLayerAdjustments({shapes, shape})
  }

  moveForwards() {
    const shape = this.props.shape
    const shapes = this.props.doc.get('shapes')

    const shapesToAdjust = filter(shapes, s => s.z === shape.z + 1)
    shapesToAdjust.forEach(s => s.z -= 1)
    shape.z += 1

    this.updateDocumentForLayerAdjustments({shapes, shape})
  }

  moveBackwards() {
    const shape = this.props.shape
    const shapes = this.props.doc.get('shapes')

    const shapesToAdjust = filter(shapes, s => s.z === shape.z - 1)
    shapesToAdjust.forEach(s => s.z += 1)
    shape.z -= 1

    this.updateDocumentForLayerAdjustments({shapes, shape})
  }

  updateDocumentForLayerAdjustments(sender) {
    const updatedDocument = this.props.doc.set('shapes', sender.shapes)
    this.props.updateSelectedCanvasObject(sender.shape)
    this.props.updateDocument(updatedDocument)
  }

  render() {
    return (
      <div className="inspector-content-section">
        <h1>Move</h1>
        <div>
          <button className="button button-full" onClick={::this.moveToFront}>Front</button>
          <button className="button button-full" onClick={::this.moveToBack}>Back</button>
          <button className="button button-full" onClick={::this.moveForwards}>Forwards</button>
          <button className="button button-full" onClick={::this.moveBackwards}>Backwards</button>
        </div>
      </div>
    )
  }
}
