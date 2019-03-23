import * as React from "react";
import styled from "styled-components";
// import { StateContext } from "../../contexts";
import { Colors } from "../../util/constants";
import PublicationsIcon from "../icons/publications";

const Container = styled.header`
  background: ${Colors.TitleBar.Background};
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100vw;
  height: 25px;
  z-index: 1;
`;

const IconContainer = styled.div`
  padding: 0 0.25em;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

export default function TitleBar() {
  // const { currentDocument } = React.useContext(StateContext);

  return (
    <Container>
      <IconContainer>
        <PublicationsIcon size={20} />
      </IconContainer>
    </Container>
  );
}
