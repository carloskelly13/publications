var
  _ = require('lodash'),
  React = require('react'),
  TestUtils = React.addons.TestUtils;

describe('Input Text: ', function() {
  var
    InputText,
    element,
    testController,
    spies = {};

  beforeEach(function() {
    InputText = require('./input.text');

    testController = {onChange: _.noop};
    spies.change = sinon.spy(testController, 'onChange');

    element = TestUtils.renderIntoDocument(
      <InputText
        displayName="Name"
        name="name"
        validator='isLength'
        validatorOptions={1}
        valueChanged={testController.onChange} />
    );
  });

  afterEach(function() {
    spies.change.restore();
  });

  it('should instantiate the InputText', function() {
    expect(TestUtils.isCompositeComponent(element)).to.be.true;
  });

  describe('inputing valid text into the field', function() {
    it('should call the valueChanged callback', function() {
      var input = TestUtils.findRenderedDOMComponentWithTag(element, 'input');
      TestUtils.Simulate.change(input, {target: {value: 'Sample Document Name'}});
      expect(spies.change).to.have.been.called;
    });
  });

  describe('inputing invalid text into the field', function() {
    it('should not call the valueChanged callback', function() {
      var input = TestUtils.findRenderedDOMComponentWithTag(element, 'input');
      TestUtils.Simulate.change(input, {target: {value: ''}});
      expect(spies.change).to.not.have.been.called;
    });
  });
});
