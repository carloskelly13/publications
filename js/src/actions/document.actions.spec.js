
describe('Document actions: ', function() {

  var
    DocumentActions;

  beforeEach(function() {
    DocumentActions = require('./document.actions');
  });

  it('should instantiate the DocumentActions', function() {
    expect(DocumentActions).to.be.defined;
  });
});
