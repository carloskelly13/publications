// @flow
import React from "react";
import LogoBanner from "../ui/logo-banner";
import styled from "styled-components";
import { ActionsContext } from "../../contexts";
// import { Colors } from "../../util/constants";

const Container = styled.div`
  display: flex;
  padding: 2em;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
`;

export default () => (
  <Container>
    <ActionsContext.Consumer>{() => <LogoBanner />}</ActionsContext.Consumer>
  </Container>
);
