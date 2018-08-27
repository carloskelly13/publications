import React from "react";
import styled from "styled-components";
import { Colors } from "../../util/constants";

const ToolbarContainer = styled.div`
  align-items: flex-end;
  background: ${Colors.App.Toolbar};
  box-pack: justify;
  display: flex;
  height: 27px;
  justify-content: space-between;
  top: 0;
  user-select: none;
  padding: 0 0.5em 0 1em;
  width: calc(100% - 1.5em);

  @media print {
    display: none;
  }
`;

interface Props {
  children: React.ReactNode;
}
const Toolbar: React.SFC<Props> = ({ children }) => (
  <div style={{ display: "block", zIndex: 5 }}>
    <ToolbarContainer>{children}</ToolbarContainer>
  </div>
);
export default Toolbar;
