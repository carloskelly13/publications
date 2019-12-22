import * as React from "react";
import TitleBar from "../components/title-bar";
import { AppContainer, AppStyle } from "../components/base";
import EditorView from "./editor-view";
import DocumentsView from "./documents-view";
import { Router } from "@reach/router";
import styled from "styled-components";
import DialogsView from "./dialogs-view";
import WebFont from "webfontloader";

WebFont.load({
  google: {
    families: [
      "IBM Plex Serif:400,400i,700,700i",
      "IBM Plex Sans:400,400i,700,700i",
    ],
  },
});

const StyledRouter = styled(Router)`
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
