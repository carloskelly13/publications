import styled from "styled-components";
import { Colors } from "../../util/constants";

export const LayersSidebarContainer = styled.div<{ visible?: boolean }>`
  min-width: 250px;
  background: ${Colors.LayersSidebar.Background};
  border-left: 1px solid ${Colors.LayersSidebar.Border};
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

export const Title = styled.h1`
  font-weight: 600;
  font-size: 1em;
  line-height: 1em;
  margin: 15px 10px;
  text-transform: uppercase;
  color: ${Colors.LayersSidebar.Text};
`;
