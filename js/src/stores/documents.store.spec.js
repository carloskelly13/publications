describe('Documents Store', function() {
  var DocumentsStore;

  beforeEach(function() {
    DocumentsStore = require('./documents.store');
  });

  it('should instantiate the DocumentsStore', function() {
    expect(DocumentsStore).to.be.defined;
  });
});
