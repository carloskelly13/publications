import React, { Component } from "react"
import range from "lodash.range"
import { connect } from "react-redux"
import { GridLine } from "./grid-line"
import { editModeActiveSelector } from "../../state/selectors"
import {
  updateSelectedShape as updateSelectedShapeAction
} from "../../state/actions/document"

const renderGridlines = ({ width, height, dpi, zoom }) => {
  const x = range(0, width * dpi * zoom, 0.25 * dpi * zoom)
  const y = range(0, height * dpi * zoom, 0.25 * dpi * zoom)
  return [
    ...x.map((mark, index) => (
      <GridLine
        key={`v-grid-${index}`}
        major={(index % 4 === 0) && (index > 0)}
        mX={mark - 0.5}
        mY="0"
        dX={mark - 0.5}
        dY={height * dpi * zoom}
        direction={"V"}
      />
    )),
    ...y.map((mark, index) => (
      <GridLine
        key={`h-grid-${index}`}
        major={(index % 4 === 0) && (index > 0)}
        mX="0"
        mY={mark - 0.5}
        dX={width * dpi * zoom}
        dY={mark - 0.5}
        direction={"H"}
      />
    ))
  ]
}

class CanvasBackground extends Component {
  shouldComponentUpdate(nextProps) {
    const widthChanged = this.props.doc.width !== nextProps.doc.width
    const heightChanged = this.props.doc.height !== nextProps.doc.height
    const zoomChanged = this.props.zoom !== nextProps.zoom
    const editModeChanged = this.props.editModeActive !== nextProps.editModeActive
    return (widthChanged || heightChanged || zoomChanged || editModeChanged)
  }

  render() {
    const {
      doc: { width, height },
      dpi,
      zoom,
      updateSelectedShape,
      editModeActive
    } = this.props
    return (
      <g
        onClick={event => {
          event.preventDefault()
          updateSelectedShape(null)
        }}
      >
        <rect
          y="0"
          x="0"
          fill="#fff"
          stroke="0"
          strokeWidth="0"
          width={width * dpi * zoom}
          height={height * dpi * zoom}
        />
        { editModeActive && renderGridlines({ width, height, dpi, zoom }) }
      </g>
    )
  }
}

const mapStateToProps = state => ({
  editModeActive: editModeActiveSelector(state)
})

const mapDispatchToProps = {
  updateSelectedShape: updateSelectedShapeAction
}

export default connect(mapStateToProps, mapDispatchToProps)(CanvasBackground)
