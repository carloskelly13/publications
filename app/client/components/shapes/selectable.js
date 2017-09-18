import React, { Component } from "react"
import { connect } from "react-redux"
import { selectedShapeSelector } from "../../state/selectors"
import ResizeMoveFrame from "./frame"
import get from "lodash.get"
import {
  updateSelectedShape as updateSelectedShapeAction
} from "../../state/actions/document"

export default function asSelectable(WrappedComponent) {
  class InjectSelectable extends Component {
    static WrappedComponent = WrappedComponent

    constructor() {
      super(...arguments)
      this.handleShapeSelected = this.handleShapeSelected.bind(this)
    }

    handleShapeSelected() {
      const { shape, updateSelectedShape } = this.props
      updateSelectedShape(shape)
    }

    get isShapeSelected() {
      return this.props.selectable &&
        get(this.props, "selectedShape.id", -1) === this.props.shape.id
    }

    render() {
      const { zoom, dpi, shape, selectable } = this.props
      return (
        <g
          onClick={selectable ? this.handleShapeSelected : null}
        >
          <WrappedComponent
            zoom={zoom}
            dpi={dpi}
            shape={shape}
          />
          { this.isShapeSelected && <ResizeMoveFrame {...this.props} /> }
        </g>
      )
    }
  }

  const mapStateToProps = state => ({
    selectedShape: selectedShapeSelector(state)
  })

  const mapDispatchToProps = {
    updateSelectedShape: updateSelectedShapeAction
  }

  return connect(mapStateToProps, mapDispatchToProps)(InjectSelectable)
}
