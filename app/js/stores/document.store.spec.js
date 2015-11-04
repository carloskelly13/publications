describe('Document Store', function() {
  var DocumentStore;

  beforeEach(function() {
    DocumentStore = require('./document.store');
  });

  it('should instantiate the DocumentStore', function() {
    expect(DocumentStore).to.be.defined;
  });
});
