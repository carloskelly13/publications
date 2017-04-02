import React from "react"
import styled from "styled-components"
import { connect } from "react-redux"
import { AppColors } from "../../util/constants"
import { ContentContainer } from "../ui/containers"
import { TextInput } from "../ui/inputs"
import { selectedShapeSelector } from "../../state/selectors"
import {
  updateSelectedShape as updateSelectedShapeAction
} from "../../state/actions/document"
import { Text } from "../ui/text"
import get from "lodash.get"
import MetricInput from "./metric-input"

const MetricsBarContainer = styled.footer`
  height: 30px;
  width: calc(100% - 2em);
  padding: 0 1em;
  background: ${AppColors.LightGray};
  border-bottom: 1px solid hsla(0, 0%, 0%, 0.25);
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const MetricsBar = ({ shape, updateSelectedShape }) => (
  <MetricsBarContainer>
    <ContentContainer verticalAlign>
      <MetricInput
        property="x"
        value={get(shape, "x")}
        label="X:"
        unit="“"
        onChange={updateSelectedShape}
        enabled={!!shape}
      />
      <MetricInput
        property="y"
        value={get(shape, "y")}
        label="Y:"
        unit="“"
        onChange={updateSelectedShape}
        enabled={!!shape}
      />
      <MetricInput
        property="width"
        value={get(shape, "width")}
        label="Width:"
        unit="“"
        onChange={updateSelectedShape}
        enabled={!!shape}
      />
      <MetricInput
        property="height"
        value={get(shape, "height")}
        label="Height:"
        unit="“"
        onChange={updateSelectedShape}
        enabled={!!shape}
      />
    </ContentContainer>
  </MetricsBarContainer>
)

const mapStateToProps = state => ({
  shape: selectedShapeSelector(state)
})

const mapDispatchToProps = {
  updateSelectedShape: updateSelectedShapeAction
}

export default connect(mapStateToProps, mapDispatchToProps)(MetricsBar)
