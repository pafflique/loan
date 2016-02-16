'use strict';

describe('Service: loan', function () {

  // load the service's module
  beforeEach(module('loanApp'));

  // instantiate service
  var loan;
  beforeEach(inject(function (_loan_) {
    loan = _loan_;
  }));

  it('should do something', function () {
    expect(!!loan).toBe(true);
  });

});
