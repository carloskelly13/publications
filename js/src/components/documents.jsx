import AuthComponent from '../core/auth-component';
import {DocumentsStore} from '../stores/documents.store';
import React, {Component, PropTypes} from 'react';

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
        <DocumentsNavbar
          documentIsSelected={this.state.selectedDocument !== null}
          editDocument={e => this.editDocument(e)}
          deleteDocument={e => this.deleteDocument(e)}
          createNewDocument={e => this.createNewDocument(e)}
          logOut={e => this.logOut(e)} />
        <div className="app-content">
          <NewDocumentModal
            toggleNewDocumentModal={e => this.toggleNewDocumentModal(e)}
            isOpen={this.state.isNewDocModalOpen} />
          <ul className="document-items" onClick={(e, s) => this.updateSelectedDocument(event, null)}>
            {
              this.state.documents.map(doc => {
                return (
                  <DocumentItem
                    key={doc._id}
                    doc={doc}
                    selectedDocument={this.state.selectedDocument}
                    updateSelectedDocument={(e, s) => this.updateSelectedDocument(e, s)} />);
              })
            }
          </ul>
        </div>
      </div>
    );
  }

  updateSelectedDocument(sender, event) {
    if (event) {
      event.preventDefault();
    }
    this.store.setSelectedDocument(sender);
  }

  dataChanged() {
    this.setState(this.store.getState());
  }

  toggleNewDocumentModal() {
    this.store.toggleNewDocumentModal();
  }

  createNewDocument(sender) {
    // this.props.store.createNewDocument({
    //   name: 'Untitled Document',
    //   width: 5.0,
    //   height: 7.0
    // });
    this.toggleNewDocumentModal();
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
    UserAuth.logOut(() => this.context.router.transitionTo('login') );
  }
}

Documents.contextTypes = {router: React.PropTypes.func.isRequired};
