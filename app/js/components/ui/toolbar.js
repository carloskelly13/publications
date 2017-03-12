import styled from "styled-components"
import { AppColors } from "../../core/constants"

const Toolbar = styled.div`
  align-items: center;
  background: ${AppColors.DarkGray};
  box-pack: justify;
  display: flex;
  height: 40px;
  justify-content: space-between;
  top: 0;
  user-select: none;
  padding: 0 1em;
  width: calc(100% - 2em);
  z-index: 5;
`

export { Toolbar }
