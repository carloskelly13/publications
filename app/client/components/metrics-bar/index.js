import React from "react"
import styled from "styled-components"
import { connect } from "react-redux"
import { RichUtils } from "draft-js"
import ColorPicker from "./../color-picker"
import { AppColors } from "../../util/constants"
import { ContentContainer } from "../ui/containers"
import {
  selectedShapeSelector, currentDocumentSelector, updateSelectedShape
} from "../../modules/document"
import MetricInput from "./metric-input"

const MetricsBarContainer = styled.footer`
  height: 25px;
  width: calc(100% - 2em);
  padding: 0 1em;
  background: ${AppColors.MediumGray};
  border-bottom: 1px solid hsla(0, 0%, 0%, 0.25);
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const supportsBorder = shape => !!shape && [ "rect", "ellipse" ].includes(shape.type)
const supportsRadius = shape => !!shape && shape.type === "rect"
const isText = shape => !!shape && shape.type === "text"

export const MetricsBar = ({
  shape,
  updateSelectedShape
}) => {
  if (!shape) {
    return (
      <MetricsBarContainer />
    )
  }
  return (
    <MetricsBarContainer>
      <ContentContainer verticalAlign>
        <MetricInput
          small
          property="x"
          value={shape.x}
          label="X"
          unit="in"
          onChange={updateSelectedShape}
        />
        <MetricInput
          small
          property="y"
          value={shape.y}
          label="Y"
          unit="in"
          onChange={updateSelectedShape}
        />
        <MetricInput
          small
          property="width"
          value={shape.width}
          label="Width"
          unit="in"
          onChange={updateSelectedShape}
        />
        <MetricInput
          small
          property="height"
          value={shape.height}
          label="Height"
          unit="in"
          onChange={updateSelectedShape}
        />
        <ColorPicker
          property={isText(shape) ? "color" : "fill"}
          onChange={updateSelectedShape}
          shape={shape}
        />
        { supportsBorder(shape) && [
          <ColorPicker
            key="stroke-color-picker"
            property="stroke"
            onChange={updateSelectedShape}
            shape={shape}
          />,
          <MetricInput
            mini
            property="strokeWidth"
            key="stroke-metric-input"
            value={shape.strokeWidth}
            label="Border"
            unit="pt"
            onChange={updateSelectedShape}
          />
        ] }
        { supportsRadius(shape) && (
          <MetricInput
            mini
            property="r"
            value={shape.r}
            label="Radius"
            unit="pt"
            onChange={updateSelectedShape}
          />
        ) }
        {isText && (
          <div>
            <button
              onClick={() => updateSelectedShape({
                editorState: RichUtils.toggleInlineStyle(shape.editorState, "BOLD")
              })}
            >
              B
            </button>
            <button
              onClick={() => updateSelectedShape({
                editorState: RichUtils.toggleInlineStyle(shape.editorState, "ITALIC")
              })}
            >
              I
            </button>
          </div>
        )}
      </ContentContainer>
    </MetricsBarContainer>
  )
}

export default connect(
  state => ({
    shape: selectedShapeSelector(state),
    doc: currentDocumentSelector(state)
  }), {
    updateSelectedShape
  })(MetricsBar)
