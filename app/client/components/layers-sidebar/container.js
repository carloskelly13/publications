import styled from "styled-components"
import { sidePanelWidth, AppColors } from "../../util/constants"

export const LayersSidebarContainer = styled.div`
  width: ${sidePanelWidth};
  position: fixed;
  background: ${AppColors.LightGray};
  border-left: 1px solid hsla(0, 0%, 0%, 0.25);
  z-index: 2;
  height: calc(100% - 59px);
  flex-direction: column;
  right: 0;
  display: ${({ visible }) => visible ? "flex" : "none" };
`
