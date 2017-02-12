import React from "react"
import styled from "styled-components"
import { hidpiImage } from "helpers/hidpi-image"

const Logo = styled.div`
  ${hidpiImage({ img: "publications-logo-27", width: 27, height: 27, ext: "png" })};
  margin: 7px 0 7px 7px;
  height: 27px;
  width: 27px;
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
    <Logo />
  </AboutButtonContent>
)
