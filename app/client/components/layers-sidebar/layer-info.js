import React from "react"
import styled from "styled-components"
import { AppColors } from "../../util/constants"

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 0.9em;
`

const BaseIcon = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  margin: 0 5px 0 0;
`

const RectangleIcon = styled(BaseIcon)`
  border: 1px solid ${({ stroke }) => stroke};
  border-radius: 1px;
  background: ${({ fill }) => fill};
`

const EllipseIcon = styled(RectangleIcon)`
  border-radius: 9px;
`

const TextIcon = styled(BaseIcon)`
  border: 1px solid ${AppColors.DarkGray};
  border-radius: 1px;
  background: #fff;
  font-size: 9px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`

const MetricsContainer = styled.div`
  font-size: 0.8em;
  color: ${AppColors.MidTextGray};
  align-items: flex-end;
  justify-content: space-between;
`

const Metric = styled.span`
  font-weight: 500;
  color: ${AppColors.DarkGray};
`

export const renderIcon = shape => {
  switch (shape.type) {
  case "rect":
    return (
      <IconContainer>
        <RectangleIcon fill={shape.fill} stroke={shape.stroke} />
        <div>Rectangle</div>
      </IconContainer>
    )
  case "ellipse":
    return (
      <IconContainer>
        <EllipseIcon fill={shape.fill} stroke={shape.stroke} />
        <div>Ellipse</div>
      </IconContainer>
    )
  case "text":
    return (
      <IconContainer>
        <TextIcon>Aa</TextIcon>
        <div>Text</div>
      </IconContainer>
    )
  default:
    return null
  }
}

export default ({ shape }) => (
  <Container>
    {renderIcon(shape)}
    <MetricsContainer>
      <Metric>{shape.width}</Metric>&#8221;&nbsp;&times;&nbsp;
      <Metric>{shape.height}</Metric>&#8221;
    </MetricsContainer>
  </Container>
)
