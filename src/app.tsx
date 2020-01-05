import React from "react";
import { AppStateProvider } from "./contexts/app-state-provider";
import { Provider, createClient } from "urql";
import ReactDOM from "react-dom";
import AppView from "./views/app-view";
import "./assets/font/inter.css";
import "focus-visible";

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

const PublicationsApp: React.FC = () => (
  <Provider value={client}>
    <AppStateProvider client={client}>
      <AppView />
    </AppStateProvider>
  </Provider>
);

ReactDOM.render(<PublicationsApp />, document.getElementById("pub-app"));
