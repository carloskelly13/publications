var _ = require('lodash'),
  fluxDispatcher = require('../flux/flux.dispatcher');

describe('User actions: ', function() {

  var
    UserActions,
    dispatcher,
    payload;

  beforeEach(function() {
    UserActions = require('./user.actions');
    dispatcher = sinon.stub(fluxDispatcher, 'handleViewAction', _.noop);
  });

  afterEach(function() {
    dispatcher.restore();
  });

  it('should instantiate the UserActions', function() {
    expect(UserActions).to.be.defined;
  });

  describe('firing a LOGIN action', function() {
    beforeEach(function() {
      var userData = {name: 'carlos@email.com', password: 'pass123'};
      UserActions.login(userData);
      payload = {actionType: UserActions.LOGIN, data: userData};
    });

    it('should dispatch a view action with the actionType of LOGIN', function() {
      expect(dispatcher).to.have.been.calledWith(payload);
    });
  });

  describe('firing a LOGOUT action', function() {
    beforeEach(function() {
      UserActions.logout();
      payload = {actionType: UserActions.LOGOUT};
    });

    it('should dispatch a view action with the actionType of LOGOUT', function() {
      expect(dispatcher).to.have.been.calledWith(payload);
    });
  });
});
