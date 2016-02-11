'use strict';

angular.module('loanApp', [
  'loanApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap'
])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/loan');

    $locationProvider.html5Mode(true);
  });
