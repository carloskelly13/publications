import { PropTypes } from "react"
import styled from "styled-components"

export const ContentContainer = styled.div`
  display: flex;
  ${({ verticalAlign }) => verticalAlign ? { alignItems: "center" } : {} };
`

ContentContainer.propTypes = {
  verticalAlign: PropTypes.bool
}
