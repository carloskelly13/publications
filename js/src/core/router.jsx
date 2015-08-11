import React from 'react';
import ReactRouter, {Route, Redirect, DefaultRoute, NotFoundRoute} from 'react-router';
import Index from '../components/index';
import Login from '../components/login';
import Documents from '../components/documents/documents';
import Document from '../components/document/document';

export default class Router {
  constructor() {
    this.router = ReactRouter.create({
      routes: (
        <Route name='index' handler={Index} path='/'>
          <DefaultRoute handler={Documents} />
          <NotFoundRoute handler={Documents} />
          <Route name='documents' handler={Documents} path='documents' />
          <Route name='document-edit' handler={Document} path='documents/:id/edit' />
          <Route name='login' handler={Login} path='login' />
        </Route>
      ),
      location: ReactRouter.HashLocation
    });
  }

  run() {
    this.router.run((Handler, state) => {
      React.render(<Handler />, document.body);
    });
  }
}
