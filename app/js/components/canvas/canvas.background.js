import React, { Component } from 'react'
import range from 'lodash.range'
import { autobind } from 'core-decorators'

import { GridLine } from './grid-line'

export default class CanvasBackground extends Component {
  shouldComponentUpdate(nextProps) {
    const widthChanged = this.props.doc.width != nextProps.doc.width
    const heightChanged = this.props.doc.height != nextProps.doc.height
    const zoomChanged = this.props.zoom != nextProps.zoom
    return (widthChanged || heightChanged || zoomChanged)
  }

  @autobind
  canvasSelected(event) {
    event.preventDefault()
    this.props.updateShape(null, null)
  }

  renderGridlines() {
    if (!this.props.selectable) {
      return null
    }
    const { doc, dpi, zoom } = this.props
    const xRange = range(0, doc.width * dpi * zoom, 0.25 * dpi * zoom)
    const yRange = range(0, doc.height * dpi * zoom, 0.25 * dpi * zoom)

    const xGridlines = xRange.map((mark, idx) =>
      <GridLine
        key={ `v-grid-${idx}` }
        major={ (idx % 4 === 0) && (idx > 0) }
        mX={ mark - 0.5 }
        mY="0"
        dX={ mark - 0.5 }
        dY={ doc.height * dpi * zoom }
        direction={ 'V' }
      />
    )

    const yGridlines = yRange.map((mark, idx) =>
      <GridLine
        key={ `h-grid-${idx}` }
        major={ (idx % 4 === 0) && (idx > 0) }
        mX="0"
        mY={ mark - 0.5 }
        dX={ doc.width * dpi * zoom }
        dY={ mark - 0.5 }
        direction={ 'H' }
      />
    )

    return <g>{ [ ...xGridlines, ...yGridlines ] }</g>
  }

  render() {
    const { doc, dpi, selectable, zoom } = this.props

    return (
      <g
        id="canvas-background"
        onClick={selectable ? this.canvasSelected : null}
      >
        <rect
          y="0"
          x="0"
          fill="#fff"
          stroke="0"
          strokeWidth="0"
          width={doc.width * dpi * zoom}
          height={doc.height * dpi * zoom}
        />
        { this.renderGridlines() }
      </g>
    )
  }
}
