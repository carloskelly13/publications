import React from 'react'
import ShapeFrame from 'components/canvas/shape.frame'

export default function shapeFrame(target, key, descriptor) {
  const originalFunc = descriptor.value

  descriptor.value = function shapeFrameInjector() {
    const ret = originalFunc.call(this)
    const selected = !!this.isShapeSelected()
    const shapeFrame = () => selected ? <ShapeFrame {...this.props} /> : undefined

    return <g>
      { ret }
      { shapeFrame() }
    </g>
  }
}
