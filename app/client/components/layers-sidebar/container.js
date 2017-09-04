import styled from "styled-components"
import { sidePanelWidth, AppColors } from "../../util/constants"

export const LayersSidebarContainer = styled.div`
  width: ${sidePanelWidth};
  position: fixed;
  background: ${AppColors.LightGray};
  border-left: 1px solid hsla(0, 0%, 0%, 0.25);
  z-index: 2;
  height: calc(100% - 59px);
  display: flex;
  flex-direction: column;
  right: 0;
  transition: transform 350ms ease-in-out;
  transform: translateX(${({ visible }) => visible ? "0" : "100%" });
`
