'use strict';

angular.module('loanApp')
  .factory('loans', function ($resource) {
    const ENDPOINT = '/api/loans/:id';
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
      }
    };
  });
