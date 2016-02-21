'use strict';

describe('Service: loan', function () {

  // load the service's module
  beforeEach(module('loanApp'));

  // instantiate service
  var loans;
  beforeEach(inject(function (_loans_) {
    loans = _loans_;
  }));

  it('should calculate the amount to return', function () {
    let amount = 100;
    let dateFrom = new Date(2016, 3, 5);
    let dateTo = new Date(2016, 3, 12);
    let expected = '135.00';

    expect(loans.getAmountToReturn(amount, dateTo, dateFrom)).toBe(expected);
  });

});
