import React from "react";
import DocumentsProvider from "./contexts/documents-provider";
import { Provider, createClient } from "urql";
import ReactDOM from "react-dom";
import { adopt } from "react-adopt";
import AppView from "./views/app-view";

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

const PublicationsApp: React.FC = () => (
  <AppProviders>{() => <AppView />}</AppProviders>
);

ReactDOM.render(<PublicationsApp />, document.getElementById("pub-app"));

if (module.hot) {
  module.hot.accept();
}
