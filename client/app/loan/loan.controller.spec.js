'use strict';

describe('Controller: LoanCtrl', function () {

  // load the controller's module
  beforeEach(module('loanApp'));

  var $httpBackend, $interval, $state, LoanCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector, _$state_, _$interval_) {
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.whenGET('app/loan/loan.html').respond(200, '');
    $interval = _$interval_;
    $state = _$state_;

    scope = $rootScope.$new();
    LoanCtrl = $controller('LoanCtrl', {
      $scope: scope
    });

    spyOn($state, 'go');
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });


  it('should clear errors on submit', function () {
    $httpBackend.expectPOST('/api/loans').respond(201, '');
    LoanCtrl.errors.push('Error');
    expect(LoanCtrl.errors.length).toBe(1);
    LoanCtrl.onSubmit();
    $httpBackend.flush();
    expect(LoanCtrl.errors.length).toBe(0);
  });

  it('should post the model on submit and start poll status', function () {
    let model = {
      test: 123
    };

    $httpBackend.expectPOST('/api/loans', model).respond(201, '');
    LoanCtrl.model = model;
    LoanCtrl.onSubmit();
    $httpBackend.flush();

    expect(LoanCtrl.pollingStatus).toBeTruthy();
    expect(LoanCtrl.status).toBeNull();
  });

  it('should poll the status every 30s until it is approved or rejected, timer should be canceled', function () {
    let id = 123;
    let model = {
      _id: id,
      status: 'pending'
    };

    $httpBackend.expectPOST('/api/loans').respond(201, model);
    LoanCtrl.onSubmit();
    $httpBackend.flush();

    $httpBackend.expectGET('/api/loans/' + id).respond(200, {status: 'approved'});
    $interval.flush(30000);
    $httpBackend.flush();
    $interval.flush(30000);

    expect(LoanCtrl.status).toBe('approved');
  });

  it('should go to sorry page if 403 code returned', function () {
    $httpBackend.expectPOST('/api/loans').respond(403, '');
    LoanCtrl.onSubmit();
    $httpBackend.flush();

    expect($state.go).toHaveBeenCalledWith('sorry');
  });

  it('should display errors if returned', function () {
    $httpBackend.expectPOST('/api/loans').respond(500, {
      errors: {
        name: {
          message: 'Name error'
        },
        amount: {
          message: 'Amount error'
        }
      }
    });
    LoanCtrl.onSubmit();
    $httpBackend.flush();

    expect(LoanCtrl.errors).toEqual(['Name error', 'Amount error']);
  });
});
