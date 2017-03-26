import React, { PropTypes, Component } from "react"
import { connect } from "react-redux"
import { selectedShapeSelector } from "../../state/selectors"
import ResizeMoveFrame from "./frame"
import get from "lodash.get"
import {
  updateSelectedShape as updateSelectedShapeAction
} from "../../state/actions/document"

export default function selectable(WrappedComponent) {
  class InjectSelectable extends Component {
    static WrappedComponent = WrappedComponent

    static propTypes = {
      zoom: PropTypes.number.isRequired,
      dpi: PropTypes.number.isRequired,
      shape: PropTypes.object.isRequired
    }

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
      const { selectedShape, zoom, dpi, shape } = this.props
      return (
        <g
          onClick={this.handleShapeSelected}
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
