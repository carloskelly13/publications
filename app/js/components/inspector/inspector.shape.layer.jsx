import React, {Component} from 'react'
import {indexOf, size} from 'lodash'

export default class InspectorShapeLayer extends Component {
  moveToFront() {
    const shapeLayerCount = size(this.props.doc.get('shapes'))
    this.shiftShapeLayer(shapeLayerCount)
  }

  moveToBack() {
    const shapes = this.props.doc.get('shapes')
    const idx = indexOf(shapes, this.props.shape)
    this.shiftShapeLayer(-idx)
  }

  moveForwards() {
    this.shiftShapeLayer(1)
  }

  moveBackwards() {
    this.shiftShapeLayer(-1)
  }

  shiftShapeLayer(offset) {
    let shape = this.props.shape
    let updatedDocument = this.props.doc.update('shapes', shapes => {
      this.shiftObject(shape, shapes, offset)
      return shapes
    })

    this.props.updateDocument(updatedDocument)
  }

  shiftObject(object, objects, offset) {
    const idx = indexOf(objects, object)
    if (idx === -1) return

    let newIdx = idx + offset

    if (newIdx < 0) {
      newIdx = 0
    } else if (newIdx > size(objects)) {
      newIdx = size(objects)
    }

    objects.splice(idx, 1)
    objects.splice(newIdx, 0, object)
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
