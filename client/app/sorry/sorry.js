'use strict';

angular.module('loanApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('sorry', {
        url: '/sorry',
        templateUrl: 'app/sorry/sorry.html',
        controller: 'SorryCtrl',
        controllerAs: 'vm'
      });
  });
