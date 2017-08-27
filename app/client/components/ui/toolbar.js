import styled from "styled-components"
import { AppColors } from "../../util/constants"

const Toolbar = styled.div`
  align-items: center;
  background: ${AppColors.LightGray};
  border-bottom: 1px solid hsla(0, 0%, 0%, 0.25);
  box-pack: justify;
  display: flex;
  height: 32px;
  justify-content: space-between;
  top: 0;
  user-select: none;
  padding: 0 1em;
  width: calc(100% - 2em);
  z-index: 5;
`

export { Toolbar }
