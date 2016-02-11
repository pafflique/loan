'use strict';

angular.module('loanApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('loan', {
        url: '/loan',
        templateUrl: 'app/loan/loan.html',
        controller: 'LoanCtrl',
        controllerAs: 'vm'
      });
  });
