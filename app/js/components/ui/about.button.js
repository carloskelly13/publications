import React from "react"
import styled from "styled-components"
import { hidpiImage } from "helpers/hidpi-image"

const Logo = styled.div`
  ${hidpiImage({ img: "publications-logo-27", width: 27, height: 27, ext: "png" })};
  margin: 7px 0 7px 7px;
  height: 27px;
  width: 27px;
`

export const AboutButton = ({ toggleAboutAppModal = () => {} }) => (
  <div className="about-button">
    <div
      className="navbar-logo"
      onClick={toggleAboutAppModal}
    >
      <Logo />
    </div>
  </div>
)
