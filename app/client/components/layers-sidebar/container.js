import styled from "styled-components"
import { sidePanelWidth, AppColors } from "../../util/constants"

export const LayersSidebarContainer = styled.div`
  width: ${sidePanelWidth};
  position: fixed;
  background: ${AppColors.White};
  border-left: 1px solid ${AppColors.Gray50};
  z-index: 2;
  height: calc(100% - 54px);
  flex-direction: column;
  right: 0;
  display: ${({ visible }) => visible ? "flex" : "none" };

  @media print {
    display: none;
  }
`
