'use strict';

import LoanUtil from './loan.util';
import Loan from './loan.model';
import sinon from 'sinon';

describe('Loan Util:', function () {
  let saveStub, findStub, hourStub;
  let ips = [];
  let hours = 0;

  beforeEach(function () {
    saveStub = sinon.stub(LoanUtil, 'saveUpdates', () => function () {
    });

    findStub = sinon.stub(LoanUtil, 'findByDateAndIp', function () {
      return new Promise(function (resolve) {
        resolve(ips);
      });
    });

    hourStub = sinon.stub(LoanUtil, 'getCurrentHours', () => hours);
  });

  afterEach(function () {
    saveStub.restore();
    findStub.restore();
    hourStub.restore();
  });

  it('should extend a loan', function () {
    let data = {
      name: 'Pavel Staselun',
      phone: '123456789',
      iban: 'LVHABA5023123789287423',
      amount: 100,
      return: new Date(2016, 3, 5),
      interest: 0.05,
      extensions: 0
    };

    let model = new Loan(data);
    let expected = model.toObject();
    expected.return = new Date(2016, 3, 12);
    expected.interest = 0.075;
    expected.extensions = 1;

    LoanUtil.extendLoan(model);

    sinon.assert.calledWith(saveStub, expected);
  });

  it('should reject application at night & max amount', function (done) {
    hours = 3;

    let req = {
      headers: {},
      body: {
        amount: 3000
      }
    };

    LoanUtil.risksTooHigh(req).catch(() => {
      done();
    });
  });

  it('should approve application at night & not max amount', function (done) {
    hours = 3;

    let req = {
      headers: {},
      body: {
        amount: 2999
      }
    };

    LoanUtil.risksTooHigh(req).then(done);
  });

  it('should approve application at morning & max amount', function (done) {
    hours = 9;

    let req = {
      headers: {},
      body: {
        amount: 3000
      }
    };

    LoanUtil.risksTooHigh(req).then(done);
  });

  it('should reject application if 3 applications were made in last 24hrs', function (done) {
    ips = [1, 2, 3];

    let req = {
      headers: {},
      body: {
        amount: 100
      }
    };

    LoanUtil.risksTooHigh(req).catch(() => {
      done();
    });
  });
});
