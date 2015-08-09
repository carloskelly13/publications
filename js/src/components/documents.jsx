import AuthComponent from '../core/auth-component';
import {DocumentsStore} from '../stores/documents.store';
import React, {Component, PropTypes} from 'react';
// import Joi from 'joi';

import DocumentsNavbar from './ui/documents.navbar';
import DocumentItem from './document.item';
import Document from './document';
import NewDocumentModal from './documents/new.modal';
import UserAuth from '../core/user-auth';

export default class Documents extends AuthComponent {
  constructor(props, context) {
    super(props);
    this.dataChanged = this.dataChanged.bind(this);
    this.store = DocumentsStore;
    this.state = this.store.getState();
  }

  componentWillMount() {
    this.store.addChangeListener(this.dataChanged);
  }

  componentDidMount() {
    this.store.getAllDocuments();
  }

  componentWillUnmount() {
    this.store.setSelectedDocument(null);
    this.store.removeChangeListener(this.dataChanged);
  }

  render() {
    return (
      <div>
        <NewDocumentModal
          createNewDocument={o => this.createNewDocument(o)}
          toggleNewDocumentModal={e => this.toggleNewDocumentModal(e)}
          isOpen={this.state.isNewDocModalOpen} />
        <DocumentsNavbar
          documentIsSelected={this.state.selectedDocument !== null}
          editDocument={e => this.editDocument(e)}
          deleteDocument={e => this.deleteDocument(e)}
          createNewDocument={e => this.toggleNewDocumentModal(e)}
          logOut={e => this.logOut(e)} />
        <div className="app-content">
          <ul className="document-items" onClick={() => this.updateSelectedDocument(null, event)}>
            {
              this.state.documents.map(doc => {
                return (
                  <DocumentItem
                    key={doc._id}
                    doc={doc}
                    selectedDocument={this.state.selectedDocument}
                    updateSelectedDocument={(s, e) => this.updateSelectedDocument(s, e)} />);
              })
            }
          </ul>
        </div>
      </div>
    );
  }

  updateSelectedDocument(sender, event) {
    if (!!event) event.preventDefault();
    this.store.setSelectedDocument(sender);
  }

  dataChanged() {
    this.setState(this.store.getState());
  }

  toggleNewDocumentModal() {
    this.store.toggleNewDocumentModal();
  }

  createNewDocument(options) {
    this.store.createNewDocument({
      name: options.name,
      width: options.width,
      height: options.height
    });
  }

  editDocument() {
    let selectedDocument = this.store.state.selectedDocument;

    if (selectedDocument) {
      this.context.router.transitionTo('document-edit', {id: selectedDocument._id});
    }
  }

  deleteDocument() {
    let selectedDocument = this.store.state.selectedDocument;

    if (!!selectedDocument) {
      this.store.deleteDocument(selectedDocument);
    }
  }

  logOut() {
    UserAuth.logOut(() => this.context.router.transitionTo('login'));
  }
}

Documents.contextTypes = {router: React.PropTypes.func.isRequired};
