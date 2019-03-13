import * as React from "react";
import styled from "styled-components";
// import { StateContext } from "../../contexts";
import { Colors } from "../../util/constants";

const Container = styled.header`
  background: ${Colors.TitleBar.Background};
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  position: fixed;
  width: 100vw;
  height: 25px;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
`;

const Title = styled.div`
  color: ${Colors.TitleBar.Text};
`;

export default function TitleBar() {
  // const { currentDocument } = React.useContext(StateContext);

  return (
    <Container>
      <Title>Publications</Title>
    </Container>
  );
}
