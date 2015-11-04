describe('Documents Store', function() {
  var UserStore;

  beforeEach(function() {
    UserStore = require('./user.store');
  });

  it('should instantiate the UserStore', function() {
    expect(UserStore).to.be.defined;
  });
});
