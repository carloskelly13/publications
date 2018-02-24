import styled from "styled-components";
import { AppColors } from "../../util/constants";

export const LayersSidebarContainer = styled.div`
  min-width: 250px;
  background: ${AppColors.White};
  border-left: 1px solid ${AppColors.Gray50};
  z-index: 2;
  height: 100%;
  flex-direction: column;
  right: 0;
  display: ${({ visible }) => (visible ? "flex" : "none")};
  overflow: scroll;

  @media print {
    display: none;
  }
`;
