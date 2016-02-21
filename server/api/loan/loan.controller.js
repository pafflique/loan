/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/loans              ->  index
 * POST    /api/loans              ->  create
 * GET     /api/loans/:id          ->  show
 * POST    /api/loans/:id/extend   ->  extend
 */

'use strict';

import Loan from './loan.model';
import LoanUtil from './loan.util';
import ipware from 'ipware';

let get_ip = ipware().get_ip;

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      res.status(statusCode).json(entity);
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
  LoanUtil.risksTooHigh(req)
    .catch(respondWithResult(res, 403))
    .then(() => {
      req.body.ip = get_ip(req).clientIp;
      req.body.request = new Date();
      return Loan.createAsync(req.body);
    })
    .then(LoanUtil.approveOrReject)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Extends an existing Loan in the DB
export function extend(req, res) {
  Loan.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(LoanUtil.extendLoan)
    .then(respondWithResult(res))
    .catch(handleError(res));
}
