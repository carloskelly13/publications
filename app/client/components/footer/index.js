import React from "react"
import styled from "styled-components"
import { connect } from "react-redux"
import { AppColors } from "../../util/constants"
import { Logo } from "../ui/logo"
import { ContentContainer } from "../ui/containers"
import { StrongText } from "../ui/text"
import { TextButton } from "../ui/text-button"

const FooterContainer = styled.footer`
  height: 30px;
  width: 100%;
  background: ${AppColors.LightGray};
  border-top: 1px solid hsla(0, 0%, 0%, 0.25);
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const Footer = () => (
  <FooterContainer>
    <ContentContainer verticalAlign>
      <Logo margin="0 0.25em 0 1em" />
      <StrongText size="0.95em">
        Publications
      </StrongText>
    </ContentContainer>
    <ContentContainer verticalAlign>
      <TextButton
        size="0.9em"
        margin="0 1em 0 0"
      >
        My Account
      </TextButton>
      <TextButton
        size="0.9em"
        margin="0 1em 0 0"
      >
        Log Out
      </TextButton>
    </ContentContainer>
  </FooterContainer>
)

export default connect(null)(Footer)
