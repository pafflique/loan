/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/loans              ->  index
 * POST    /api/loans              ->  create
 * GET     /api/loans/:id          ->  show
 * PUT     /api/loans/:id          ->  update
 * POST    /api/loans/:id/extend   ->  extend
 * DELETE  /api/loans/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Loan from './loan.model';
import ipware from 'ipware';
import moment from 'moment';
import Promise from 'bluebird';

let get_ip = ipware().get_ip;

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function (entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.removeAsync()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

function extendLoan(entity) {
  let updated = entity.toObject();
  let extendedDate = (new Date(entity.return)).getDate() + 7;
  updated.return.setDate(extendedDate);
  updated.interest *= 1.5;
  updated.extensions++;
  return saveUpdates(updated)(entity);
}

function findByDateAndIp(ip) {
  let today = moment();
  let yesterday = moment(today).subtract(1, 'day');

  return Loan.find(
    {
      request: {
        $gte: yesterday.toDate(),
        $lt: today.toDate()
      },
      ip: ip
    }
  );
}

function risksTooHigh(req) {
  let dt = new Date();
  let h = dt.getHours();
  let isLate = h >= 0 && h < 6;
  let isDrunk = req.body.amount == 3000 && isLate;

  return findByDateAndIp(get_ip(req).clientIp).then((loans) => {
    if (isDrunk || loans.length > 2) {
      throw 'Too high risks';
    }
  });

}

// Gets a list of Loans
export function index(req, res) {
  Loan.findAsync()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Loan from the DB
export function show(req, res) {
  Loan.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Loan in the DB
export function create(req, res) {
  risksTooHigh(req)
    .catch(respondWithResult(res, 403))
    .then(() => {
      req.body.ip = get_ip(req).clientIp;
      req.body.request = new Date();
      return Loan.createAsync(req.body);
    })
    .delay(2000)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Loan in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Loan.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Extends an existing Loan in the DB
export function extend(req, res) {
  Loan.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(extendLoan)
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Loan from the DB
export function destroy(req, res) {
  Loan.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
