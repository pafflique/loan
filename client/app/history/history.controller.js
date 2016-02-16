'use strict';

angular.module('loanApp')
  .controller('HistoryCtrl', function (loans) {
    let vm = this;

    load();

    vm.extend = (item) => {
      loans.extend(item).then(load);
    };

    function load() {
      vm.history = loans.history();
    }
  });
