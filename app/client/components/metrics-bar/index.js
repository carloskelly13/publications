import React from "react"
import styled from "styled-components"
import { connect } from "react-redux"
import { AppColors } from "../../util/constants"
import { ContentContainer } from "../ui/containers"

const MetricsBarContainer = styled.footer`
  height: 30px;
  width: 100%;
  background: ${AppColors.LightGray};
  border-bottom: 1px solid hsla(0, 0%, 0%, 0.25);
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const MetricsBar = () => (
  <MetricsBarContainer>
  </MetricsBarContainer>
)

export default connect(null)(MetricsBar)
