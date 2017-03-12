import React from "react"
import styled from "styled-components"
import { AppColors } from "../../core/constants"

export const Header = styled.h1`
  font-weight: 500;
  font-size: 1.2em;
  margin: 0 0 5px;
`

export const Message = styled.p`
  font-size: 1em;
  margin: 0 0 15px;
`

export const MarginText = styled.span`
  margin: ${({ mr, ml, mt, mb }) => `${mt || 0} ${mr || 0} ${mb || 0} ${ml || 0}`}
`

export const Text = styled(MarginText)`
  font-size: ${({ size }) => size || '1em'};
  text-align: left;
  font-weight: 400;
  color: ${props => {
    if (props.white) return "#fff"
    return AppColors.DarkGray
  }};
`

export const StrongText = styled(Text)`
  font-weight: 600;
`

export const MediumText = styled(Text)`
  font-weight: 500;
`

export const LightText = styled(Text)`
  font-weight: 300;
`
