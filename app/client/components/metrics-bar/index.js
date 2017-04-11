import React from "react"
import styled from "styled-components"
import { connect } from "react-redux"
import { AppColors } from "../../util/constants"
import { ContentContainer } from "../ui/containers"
import { selectedShapeSelector } from "../../state/selectors"
import {
  updateSelectedShape as updateSelectedShapeAction
} from "../../state/actions/document"
import get from "lodash.get"
import MetricInput from "./metric-input"

const MetricsBarContainer = styled.footer`
  height: 30px;
  width: calc(100% - 2em);
  padding: 0 1em;
  background: ${AppColors.LightGray};
  border-bottom: 1px solid hsla(0, 0%, 0%, 0.25);
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const supportsBorder = shape => !!shape && [ "rect", "ellipse" ].includes(shape.type)
const supportsRadius = shape => !!shape && shape.type === "rect"

export const MetricsBar = ({ shape, updateSelectedShape }) => {

  return (
    <MetricsBarContainer>
      <ContentContainer verticalAlign>
        <MetricInput
          property="x"
          value={get(shape, "x")}
          label="X"
          unit="in"
          onChange={updateSelectedShape}
          enabled={!!shape}
        />
        <MetricInput
          property="y"
          value={get(shape, "y")}
          label="Y"
          unit="in"
          onChange={updateSelectedShape}
          enabled={!!shape}
        />
        <MetricInput
          property="width"
          value={get(shape, "width")}
          label="Width"
          unit="in"
          onChange={updateSelectedShape}
          enabled={!!shape}
        />
        <MetricInput
          property="height"
          value={get(shape, "height")}
          label="Height"
          unit="in"
          onChange={updateSelectedShape}
          enabled={!!shape}
        />
        <MetricInput
          property="strokeWidth"
          value={get(shape, "strokeWidth")}
          label="Border"
          unit="pt"
          onChange={updateSelectedShape}
          enabled={supportsBorder(shape)}
        />
        <MetricInput
          property="r"
          value={get(shape, "r")}
          label="Radius"
          unit="pt"
          onChange={updateSelectedShape}
          enabled={supportsRadius(shape)}
        />
      </ContentContainer>
    </MetricsBarContainer>
  )
}

const mapStateToProps = state => ({
  shape: selectedShapeSelector(state)
})

const mapDispatchToProps = {
  updateSelectedShape: updateSelectedShapeAction
}

export default connect(mapStateToProps, mapDispatchToProps)(MetricsBar)
