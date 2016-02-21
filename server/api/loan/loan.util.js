'use strict';

import _ from 'lodash';
import moment from 'moment';
import ipware from 'ipware';
import Loan from './loan.model';

let get_ip = ipware().get_ip;

let API = {
  saveUpdates: saveUpdates,
  extendLoan: extendLoan,
  risksTooHigh: risksTooHigh,
  approveOrReject: approveOrReject,
  findByDateAndIp: findByDateAndIp,
  getCurrentHours: getCurrentHours
};

module.exports = API;

function saveUpdates(updates) {
  return function (entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(updated => {
        return updated;
      });
  };
}

function extendLoan(entity) {
  let updated = entity.toObject();
  let extendedDate = (new Date(entity.return)).getDate() + 7;

  updated.return.setDate(extendedDate);
  updated.interest = parseFloat((updated.interest * 1.5).toPrecision(2));
  updated.extensions++;

  return API.saveUpdates(updated)(entity);
}

function risksTooHigh(req) {
  let h = API.getCurrentHours();
  let isLate = h >= 0 && h < 6;
  let isDrunk = req.body.amount == 3000 && isLate;

  return API.findByDateAndIp(get_ip(req).clientIp).then((loans) => {
    if (isDrunk || loans.length > 2) {
      throw 'Too high risks';
    }
  });
}

function getCurrentHours() {
  let dt = new Date();
  return dt.getHours();
}

function approveOrReject(loan) {
  let updated = loan.toObject();
  updated.status = Math.random() > 0.3 ? 'approved' : 'rejected';

  setTimeout(() => {
    API.saveUpdates(updated)(loan);
  }, 45000);

  return loan;
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
