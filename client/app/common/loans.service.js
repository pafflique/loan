'use strict';

angular.module('loanApp')
  .factory('loans', function ($resource) {
    const ENDPOINT = '/api/loans/:id';
    const INTEREST = 0.05;

    let API = $resource(ENDPOINT, null, {
      extend: {
        method: 'POST',
        url: `${ENDPOINT}/extend`,
        params: {id: '@_id'}
      }
    });

    return {
      post: (model) => {
        return API.save(model).$promise;
      },
      get: (id) => {
        return API.get({id: id}).$promise;
      },
      history: () => {
        return API.query();
      },
      extend: (item) => {
        return API.extend(item).$promise;
      },
      getAmountToReturn: getAmountToReturn
    };

    function getAmountToReturn(amount, dateTo, dateFrom) {
      amount = parseFloat(amount);
      dateFrom = dateFrom || new Date();

      let dayCount = msToDays(dateTo - dateFrom);

      return (amount + (amount * INTEREST * dayCount)).toFixed(2);
    }

    function msToDays(ms) {
      return ms / 1000 / 60 / 60 / 24;
    }
  });
