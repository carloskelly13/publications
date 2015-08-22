import AuthComponent from '../../core/auth-component';
import DocumentsStore from '../../stores/documents.store';
import React, {Component, PropTypes} from 'react';

import DocumentsNavbar from './documents.navbar';
import DocumentItem from './document.item';
import NewDocumentModal from './documents.new.modal';
import UserStore from '../../stores/user.store';

import DocumentActions from '../../actions/document.actions';
import UserActions from '../../actions/user.actions';

export default class Documents extends AuthComponent {
  constructor(props, context) {
    super(props);
    this.loginStateChanged = this.loginStateChanged.bind(this);
    this.dataChanged = this.dataChanged.bind(this);
    this.store = DocumentsStore;
    this.state = this.store.getState();
  }

  componentWillMount() {
    UserStore.addChangeListener(this.loginStateChanged);
    this.store.addChangeListener(this.dataChanged);
  }

  componentDidMount() {
    DocumentActions.list();
    document.title = 'Publications — All Documents';
  }

  componentWillUnmount() {
    UserStore.removeChangeListener(this.loginStateChanged);
    this.store.setSelectedDocument(null);
    this.store.removeChangeListener(this.dataChanged);
    document.title = 'Publications';
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

  loginStateChanged() {
    if (!UserStore.isAuthenticated()) {
      this.context.router.transitionTo('login');
    }
  }

  dataChanged() {
    this.setState(this.store.getState());
  }

  toggleNewDocumentModal() {
    this.store.toggleNewDocumentModal();
  }

  createNewDocument(options) {
    DocumentActions.create({
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
      DocumentActions.remove(selectedDocument);
    }
  }

  logOut() {
    UserActions.logout();
  }
}

Documents.contextTypes = {router: React.PropTypes.func.isRequired};
