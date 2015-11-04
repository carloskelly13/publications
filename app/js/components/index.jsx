import React, {Component} from 'react';
import {RouteHandler} from 'react-router';

export default class Index extends Component {
  render () {
    return (
      <div className="app-container">
        <RouteHandler />
      </div>);
  }
}
