// @flow
import type { ComponentType } from "react"
import styled from "styled-components"

type Props = {
  verticalAlign: bool
}
export const ContentContainer: ComponentType<Props> = styled.div`
  display: flex;
  flex-direction: ${({ column }) => column ? "column" : "row" };
  ${({ verticalAlign }) => verticalAlign ? { alignItems: "center" } : {} };
`
