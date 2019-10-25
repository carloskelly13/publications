import * as React from "react";
import styled from "styled-components";
import LayersSidebar from "../components/inspector";
import Editor from "../components/editor";
import { navigate, RouteComponentProps } from "@reach/router";
import { StateContext } from "../contexts/app-state";

const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  width: 100%;
`;

type EditorView = React.FC<
  RouteComponentProps<{
    documentId: string;
  }>
>;
const EditorView: EditorView = props => {
  const {
    currentDocument,
    actions,
    dataLoaded,
    userFetching,
    user,
  } = React.useContext(StateContext);
  const getDocument = React.useRef(actions.getDocument);
  const documentId = React.useRef(props.documentId);
  React.useEffect(() => {
    if (userFetching || !dataLoaded || currentDocument) {
      return;
    }
    if (!userFetching && !user && !currentDocument) {
      navigate("/");
      return;
    }
    if (user && !currentDocument) {
      getDocument.current(documentId.current);
    }
  }, [currentDocument, dataLoaded, userFetching, user]);

  const handleUnloadEvent = React.useCallback(() => {
    if (user && currentDocument) {
      actions.saveDocument().then(void 0);
    }
    return undefined;
  }, [actions, currentDocument, user]);

  React.useEffect(() => {
    window.addEventListener("beforeunload", handleUnloadEvent);
    return () => {
      window.removeEventListener("beforeunload", handleUnloadEvent);
    };
  }, [handleUnloadEvent]);
  return (
    <Content>
      {currentDocument && (
        <>
          <Editor />
          <LayersSidebar />
        </>
      )}
    </Content>
  );
};

export default EditorView;
