import * as React from "react";
import TitleBar from "../components/title-bar";
import { AppContainer, AppStyle } from "../components/base";
import EditorView from "./editor-view";
import DocumentsView from "./documents-view";
import { Router } from "@reach/router";
import styled from "styled-components";
import DialogsView from "./dialogs-view";

const StyledRouter = styled(Router)`
  flex: 1;
  display: flex;
  height: calc(100% - 25px);
`;

const AppView: React.FC = () => (
  <>
    <AppStyle />
    <AppContainer>
      <TitleBar />
      <StyledRouter>
        <DocumentsView path="/" default />
        <EditorView path="edit/:documentId" />
      </StyledRouter>
    </AppContainer>
    <DialogsView />
  </>
);

export default AppView;
