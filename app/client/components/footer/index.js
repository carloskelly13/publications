import React from "react"
import styled from "styled-components"
import { connect } from "react-redux"
import { AppColors } from "../../util/constants"

const FooterContainer = styled.footer`
  height: 30px;
  width: 100%;
  background: ${AppColors.LightGray};
  border-top: 1px solid hsla(0, 0%, 0%, 0.25);
  z-index: 5;
`

export const Footer = () => (
  <FooterContainer>
    Hi
  </FooterContainer>
)

export default connect(null)(Footer)
