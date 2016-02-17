'use strict';

describe('Controller: SorryCtrl', function () {

  // load the controller's module
  beforeEach(module('loanApp'));

  var SorryCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SorryCtrl = $controller('SorryCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
