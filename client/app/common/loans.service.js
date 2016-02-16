'use strict';

angular.module('loanApp')
  .factory('loans', function ($resource) {
    const ENDPOINT = 'api/loans';
    let API = $resource(ENDPOINT, null, {
      extend: {
        method: 'POST',
        url: `${ENDPOINT}/:id/extend`,
        params: {id: '@_id'}
      }
    });

    return {
      post: (model) => {
        return API.save(model).$promise;
      },
      history: () => {
        return API.query();
      },
      extend: (item) => {
        return API.extend(item).$promise;
      }
    };
  });
