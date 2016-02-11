'use strict';

angular.module('loanApp')
  .factory('loan', function ($resource) {
    let API = $resource('api/loans');

    return {
      post: (model) => {
        return API.save(model).$promise;
      }
    };
  });
