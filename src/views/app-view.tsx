import * as React from "react";
import TitleBar from "../components/title-bar";
import AppContainer from "../components/base";
import EditorView from "./editor-view";
import DocumentsView from "./documents-view";
import { Router } from "@reach/router";
import styled from "styled-components";

const StyledRouter = styled(Router)`
  flex: 1;
  display: flex;
`;

const AppView: React.FC = () => (
  <AppContainer>
    <TitleBar />
    <StyledRouter>
      <DocumentsView path="/" default />
      <EditorView path="edit/:documentId" />
    </StyledRouter>
  </AppContainer>
);

export default AppView;
