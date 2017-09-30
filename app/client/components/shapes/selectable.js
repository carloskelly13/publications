import React, { Component } from "react"
import { connect } from "react-redux"
import { selectedShapeSelector } from "../../state/selectors"
import ResizeMoveFrame from "./frame"
import get from "lodash.get"
import {
  updateSelectedShape as updateSelectedShapeAction,
  setEditingTextBox as setEditingTextBoxAction
} from "../../state/actions/document"

export default function asSelectable(WrappedComponent) {
  class InjectSelectable extends Component {
    static WrappedComponent = WrappedComponent

    handleShapeSelected = () => {
      const { shape, updateSelectedShape } = this.props
      updateSelectedShape(shape)
    }

    get isShapeSelected() {
      return this.props.selectable &&
        get(this.props, "selectedShape.id", -1) === this.props.shape.id
    }

    render() {
      const { zoom, dpi, shape, selectable } = this.props
      const wrappedProps = { zoom, dpi, shape }

      /**
       * Since text boxes can have input we need extra props
       * to handle their state and change events.
       */
      if (shape.type === "text") {
        wrappedProps.onChange = this.props.onChange
        wrappedProps.isEditing = this.props.isEditing
      }

      return (
        <g
          onClick={selectable ? this.handleShapeSelected : null}
        >
          <WrappedComponent {...wrappedProps} />
          {this.isShapeSelected && <ResizeMoveFrame {...this.props} />}
        </g>
      )
    }
  }

  const mapStateToProps = state => ({
    selectedShape: selectedShapeSelector(state)
  })

  const mapDispatchToProps = {
    updateSelectedShape: updateSelectedShapeAction,
    setEditingTextBox: setEditingTextBoxAction
  }

  return connect(mapStateToProps, mapDispatchToProps)(InjectSelectable)
}
