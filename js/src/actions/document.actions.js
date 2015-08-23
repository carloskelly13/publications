import dispatcher from '../flux/flux.dispatcher';

const DocumentActions = {
  GET: 'GET_DOCUMENT',
  UPDATE: 'UPDATE_DOCUMENT',
  LIST: 'LIST_DOCUMENTS',
  REMOVE: 'REMOVE_DOCUMENT',
  CREATE: 'CREATE_DOCUMENT',
  PDF: 'PDF_DOCUMENT',

  get(id) {
    dispatcher.handleViewAction({
      actionType: DocumentActions.GET,
      data: {id}
    });
  },

  update(id) {
    dispatcher.handleViewAction({
      actionType: DocumentActions.UPDATE,
      data: {id}
    });
  },

  list() {
    dispatcher.handleViewAction({
      actionType: DocumentActions.LIST
    });
  },

  remove(doc) {
    dispatcher.handleViewAction({
      actionType: DocumentActions.REMOVE,
      data: {doc}
    });
  },

  create(doc) {
    dispatcher.handleViewAction({
      actionType: DocumentActions.CREATE,
      data: {doc}
    });
  },

  pdf(id) {
    dispatcher.handleViewAction({
      actionType: DocumentActions.PDF,
      data: {id}
    });
  }
};

export default DocumentActions;
