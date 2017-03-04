import React from "react"
import styled from "styled-components"
import { hidpiImage } from "helpers/hidpi-image"

export const Logo = styled.div`
  ${hidpiImage({ img: "publications-logo-27", width: 27, height: 27, ext: "png" })};
  height: 27px;
  width: 27px;
  display: inline-block;
`

export const ToolbarLogo = styled(Logo)`
  margin: 7px 0 7px 7px;
`

const AboutButtonContent = styled.div`
  display: inline-block;
  height: 40px;
  margin: 0;
  padding: 0 10px 0 4px;
  vertical-align: middle;
  width: 28px;
`

export const AboutButton = ({ toggleAboutAppModal = () => {} }) => (
  <AboutButtonContent onClick={toggleAboutAppModal}>
    <ToolbarLogo />
  </AboutButtonContent>
)
