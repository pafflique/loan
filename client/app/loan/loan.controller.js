'use strict';

angular.module('loanApp')
  .controller('LoanCtrl', function (loan) {
    let vm = this;

    vm.datePickerOpened = false;
    vm.amountToReturn = 0;
    vm.model = {};
    vm.errors = [];

    vm.open = () => {
      vm.datePickerOpened = true;
    };

    vm.updateAmountToReturn = () => {
      if (!vm.model.return || !vm.model.amount) {
        return 0;
      }

      let now = new Date();
      let dayCount = (vm.model.return - now) / 1000 / 60 / 60 / 24;
      let amount = parseFloat(vm.model.amount);
      vm.amountToReturn = (amount + (amount * 0.05 * dayCount)).toFixed(2);
    };

    vm.onSubmit = () => {
      vm.errors = [];

      loan
        .post(vm.model)
        .catch((response) => {
          _.forOwn(response.data.errors, (error) => {
            vm.errors.push(error.message);
          });
        });
    };
  });
