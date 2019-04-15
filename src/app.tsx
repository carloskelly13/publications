import React from "react";
import AppContainer from "./components/base";
import DocumentsProvider from "./contexts/documents-provider";
import { Provider, createClient } from "urql";
import ReactDOM from "react-dom";
import {
  DocumentView,
  ViewContainer,
  ViewContent,
} from "./components/documents/components";
import Modals from "./components/documents/modals";
import TitleBar from "./components/title-bar";
import EditorView from "./components/editor";
import LayersSidebar from "./components/inspector";
import { adopt } from "react-adopt";

const client = createClient({
  url: "/graphql",
  fetchOptions: () => {
    const authorizationToken = localStorage.getItem("authorization_token");
    return {
      headers: {
        ...(authorizationToken && {
          Authorization: `Bearer ${authorizationToken}`,
        }),
      },
    };
  },
});

const AppProviders = adopt({
  urqlProvider: ({ render }) => <Provider value={client}>{render()}</Provider>,
  documentsProvider: ({ render }) => (
    <DocumentsProvider>{render()}</DocumentsProvider>
  ),
});

function PublicationsApp() {
  return (
    <AppProviders>
      {() => (
        <AppContainer>
          <ViewContainer>
            <DocumentView>
              <TitleBar />
              <ViewContent>
                <EditorView />
                <LayersSidebar />
              </ViewContent>
            </DocumentView>
          </ViewContainer>
          <Modals />
        </AppContainer>
      )}
    </AppProviders>
  );
}

ReactDOM.render(<PublicationsApp />, document.getElementById("pub-app"));

if (module.hot) {
  module.hot.accept();
}
