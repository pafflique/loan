'use strict';

class NavbarController {
  //start-non-standard
  menu = [
    {
      'title': 'Get Loan!',
      'state': 'loan'
    },
    {
      'title': 'History',
      'state': 'history'
    }
  ];

  isCollapsed = true;
  //end-non-standard

  constructor() {
    }
}

angular.module('loanApp')
  .controller('NavbarController', NavbarController);
