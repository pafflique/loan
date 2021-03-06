'use strict';

angular.module('loanApp')
  .controller('LoanCtrl', function (loans, $scope, $state, $interval) {
    let vm = this;

    vm.sliderOptions = {
      showSelectionBar: true,
      hideLimitLabels: true,
      step: 10,
      floor: 50,
      ceil: 3000,
      translate: function(value) {
        return `€ ${value}`;
      }
    };

    vm.datePickerOpened = false;
    vm.pollingStatus = false;
    vm.status = null;

    vm.amountToReturn = 0;
    vm.model = {amount: 50};
    vm.errors = [];

    vm.open = () => {
      vm.datePickerOpened = true;
    };

    vm.onSubmit = () => {
      vm.errors = [];

      loans
        .post(vm.model)
        .then(pollStatus)
        .catch(handleError);
    };

    $scope.$watchGroup([() => vm.model.amount, () => vm.model.return], updateAmountToReturn);

    function updateAmountToReturn() {
      if (!vm.model.return || !vm.model.amount) {
        return 0;
      }

      vm.amountToReturn = loans.getAmountToReturn(vm.model.amount, vm.model.return);
    }

    function pollStatus(model) {
      vm.pollingStatus = true;
      vm.status = null;

      let promise = $interval(() => {
        loans
          .get(model._id)
          .then(handleStatus)
          .then((stop) => {
            if (stop) {
              $interval.cancel(promise);
            }
          });
      }, 30000);
    }

    function handleStatus(model) {
      if (model.status !== 'pending') {
        vm.status = model.status;
        return true;
      }

      return false;
    }

    function handleError(response) {
      if (response.status === 403) {
        $state.go('sorry');
      } else {
        _.forOwn(response.data.errors, (error) => {
          vm.errors.push(error.message);
        });
      }
    }
  });
