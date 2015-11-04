var _ = require('lodash'),
  fluxDispatcher = require('../flux/flux.dispatcher');

describe('Document actions: ', function() {

  var
    DocumentActions,
    dispatcher,
    payload;

  beforeEach(function() {
    DocumentActions = require('./document.actions');
    dispatcher = sinon.stub(fluxDispatcher, 'handleViewAction', _.noop);
  });

  afterEach(function() {
    dispatcher.restore();
  });

  it('should instantiate the DocumentActions', function() {
    expect(DocumentActions).to.be.defined;
  });

  describe('firing a LIST action', function() {
    beforeEach(function() {
      DocumentActions.list();
      payload = {actionType: DocumentActions.LIST};
    });

    it('should dispatch a view action with the actionType of LIST', function() {
      expect(dispatcher).to.have.been.calledWith(payload);
    });
  });

  describe('firing a GET action', function() {
    beforeEach(function() {
      var id = 'test-id';
      DocumentActions.get(id);
      payload = {data: {id: id}, actionType: DocumentActions.GET};
    });

    it('should dispatch a view action with the id and an actionType of GET', function() {
      expect(dispatcher).to.have.been.calledWith(payload);
    });
  });

  describe('firing an UPDATE action', function() {
    beforeEach(function() {
      var id = 'test-id';
      DocumentActions.update(id);
      payload = {data: {id: id}, actionType: DocumentActions.UPDATE};
    });

    it('should dispatch a view action with the id and an actionType of UPDATE', function() {
      expect(dispatcher).to.have.been.calledWith(payload);
    });
  });

  describe('firing a REMOVE action', function() {
    beforeEach(function() {
      var doc = {id: 'test-id', name: 'test-doc', width: 6, height: 4, shapes: []};
      DocumentActions.remove(doc);
      payload = {data: {doc: doc}, actionType: DocumentActions.REMOVE};
    });

    it('should dispatch a view action with the document and an actionType of REMOVE', function() {
      expect(dispatcher).to.have.been.calledWith(payload);
    });
  });

  describe('firing a CREATE action', function() {
    beforeEach(function() {
      var doc = {id: 'test-id', name: 'new-doc', width: 6, height: 4, shapes: []};
      DocumentActions.create(doc);
      payload = {data: {doc: doc}, actionType: DocumentActions.CREATE};
    });

    it('should dispatch a view action with the document and an actionType of CREATE', function() {
      expect(dispatcher).to.have.been.calledWith(payload);
    });
  });
});
