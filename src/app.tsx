import React from "react";
import AppContainer from "./components/base";
import DocumentView from "./components/documents/documents-view";
import { Provider, createClient } from "urql";
import ReactDOM from "react-dom";

interface Headers {
  "Content-Type": string;
  Authorization?: string;
}

const client = createClient({
  url: "/graphql",
  fetchOptions: () => {
    const headers: HeadersInit = { "Content-Type": "application/json" };
    const authorizationToken = localStorage.getItem("authorization_token");
    if (authorizationToken) {
      headers.Authorization = `Bearer ${authorizationToken}`;
    }
    return { headers };
  },
});

const App: React.FunctionComponent = () => (
  <Provider value={client}>
    <AppContainer>
      <DocumentView />
    </AppContainer>
  </Provider>
);

ReactDOM.render(<App />, document.getElementById("pub-app"));

if (module.hot) {
  module.hot.accept();
}
