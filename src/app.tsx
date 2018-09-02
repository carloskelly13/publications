import React from "react";
import AppContainer from "./components/base";
import DocumentView from "./components/documents";
import { Provider, Client } from "urql";
import ReactDOM from "react-dom";

interface Headers {
  "Content-Type": string;
  Authorization?: string;
}

const client = new Client({
  url: "/graphql",
  fetchOptions: () => {
    const headers: Headers = { "Content-Type": "application/json" };
    const authorizationToken = localStorage.getItem("authorization_token");
    if (authorizationToken) {
      headers.Authorization = `Bearer ${authorizationToken}`;
    }
    return { headers };
  },
});

const App: React.SFC = () => (
  <Provider client={client}>
    <AppContainer>
      <DocumentView />
    </AppContainer>
  </Provider>
);

ReactDOM.render(<App />, document.getElementById("pub-app"));

if (module.hot) {
  module.hot.accept();
}