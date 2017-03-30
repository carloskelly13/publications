import styled from "styled-components"
import { hidpiImage } from "../../util/hidpi-image"

export const Logo = styled.div`
  ${hidpiImage({ img: "pub-logo-23x23-alt", ext: "png", width: 23, height: 23 })};
  width: 23px;
  height: 23px;
  display: inline-block;
  margin: ${({ margin }) => margin || 0};
`
