import AuthComponent from '../../core/auth-component';
import React, {Component, PropTypes} from 'react';
import {select, contains, isEmpty} from 'lodash';

import DocumentsNavbar from './documents.navbar';
import DocumentItem from './document.item';
import NewDocumentModal from './documents.new.modal';
import DocumentStore from '../../stores/document.store';
import UserStore from '../../stores/user.store';
import InputText from '../ui/input.text';

import DocumentActions from '../../actions/document.actions';
import UserActions from '../../actions/user.actions';

export default class Documents extends AuthComponent {
  constructor(props, context) {
    super(props);
    this.loginStateChanged = this.loginStateChanged.bind(this);
    this.dataChanged = this.dataChanged.bind(this);

    this.state = {
      documents: [],
      searchKeyword: '',
      selectedDocument: null,
      isNewDocModalOpen: false
    };
  }

  componentWillMount() {
    UserStore.addChangeListener(this.loginStateChanged);
    DocumentStore.addChangeListener(this.dataChanged);
  }

  componentDidMount() {
    DocumentActions.list();
    document.title = 'Publications — All Documents';
  }

  componentWillUnmount() {
    UserStore.removeChangeListener(this.loginStateChanged);
    DocumentStore.removeChangeListener(this.dataChanged);
    this.setState({selectedDocument: null});
    document.title = 'Publications';
  }

  render() {
    let documentItems = select(this.state.documents, doc => {
      if (isEmpty(this.state.searchKeyword)) {
        return true;
      } else {
        return contains(doc.get('name').toLowerCase(), this.state.searchKeyword.toLowerCase());
      }
    }).map(doc => {
      return (
        <DocumentItem
          key={doc.get('_id')}
          doc={doc}
          editDocument={::this.editDocument}
          selectedDocument={this.state.selectedDocument}
          updateSelectedDocument={::this.updateSelectedDocument} />
      );
    });

    return (
      <div>
        <NewDocumentModal
          createNewDocument={::this.createNewDocument}
          toggleNewDocumentModal={::this.toggleNewDocumentModal}
          isOpen={this.state.isNewDocModalOpen} />
        <DocumentsNavbar
          documentIsSelected={this.state.selectedDocument !== null}
          editDocument={::this.editDocument}
          deleteDocument={::this.deleteDocument}
          createNewDocument={::this.toggleNewDocumentModal}
          logOut={e => this.logOut(e)} />
        <div className="app-content">
          <input
            className="input-text-search"
            value={this.state.searchKeyword}
            onChange={::this.searchKeywordChanged}
            placeholder="Search for Documents" />
          <ul className="document-items" onClick={() => this.updateSelectedDocument(null, event)}>
            {documentItems}
          </ul>
        </div>
      </div>
    );
  }

  updateSelectedDocument(sender, event) {
    if (!!event) event.preventDefault();
    this.setState({selectedDocument: sender});
  }

  loginStateChanged() {
    if (!UserStore.isAuthenticated()) {
      this.context.router.transitionTo('login');
    }
  }

  searchKeywordChanged(event) {
    this.setState({searchKeyword: event.target.value});
  }

  dataChanged() {
    this.setState({
      documents: DocumentStore.getDocuments(),
      isNewDocModalOpen: false
    });
  }

  toggleNewDocumentModal() {
    this.setState({
      isNewDocModalOpen: !this.state.isNewDocModalOpen
    });
  }

  createNewDocument(options) {
    DocumentActions.create({
      name: options.name,
      width: options.width,
      height: options.height
    });
  }

  editDocument() {
    let selectedDocument = this.state.selectedDocument;

    if (selectedDocument) {
      this.context.router.transitionTo('document-edit', {id: selectedDocument.get('_id')});
    }
  }

  deleteDocument() {
    let selectedDocument = this.state.selectedDocument;

    if (!!selectedDocument) {
      DocumentActions.remove(selectedDocument);
    }
  }

  logOut() {
    UserActions.logout();
  }
}

Documents.contextTypes = {router: React.PropTypes.func.isRequired};
