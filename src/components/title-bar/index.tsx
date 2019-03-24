import * as React from "react";
import styled from "styled-components";
// import { StateContext } from "../../contexts";
import { Colors } from "../../util/constants";
import PublicationsIcon from "../icons/publications";
import { StateContext } from "../../contexts";

const Container = styled.header`
  background: ${Colors.TitleBar.Background};
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100vw;
  height: 25px;
  z-index: 1;
`;

const Title = styled.div`
  padding: 0 0.25em;
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: bold;
  justify-content: flex-start;
  color: ${Colors.TitleBar.Text};
  svg {
    margin-right: 0.25em;
  }
`;

export default function TitleBar() {
  return (
    <Container>
      <Title>
        <PublicationsIcon size={20} />
        Publications
      </Title>
    </Container>
  );
}
