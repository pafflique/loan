'use strict';

describe('Controller: LoanCtrl', function () {

  // load the controller's module
  beforeEach(module('loanApp'));

  var LoanCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LoanCtrl = $controller('LoanCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
