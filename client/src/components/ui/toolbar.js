import React from "react";
import styled from "styled-components";
import { AppColors } from "../../util/constants";

const Toolbar = styled.div`
  align-items: flex-end;
  background: ${AppColors.White};
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

export default ({ children }) => (
  <div style={{ display: "block", zIndex: 5 }}>
    <Toolbar>{children}</Toolbar>
  </div>
);
