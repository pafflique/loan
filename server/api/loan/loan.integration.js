'use strict';

var app = require('../..');
import request from 'supertest';
import sinon from 'sinon';
import LoanUtil from './loan.util';

var newLoan;

describe('Loan API:', function() {
  let date = new Date(2016, 3, 5);

  describe('GET /api/loans', function() {
    var loans;

    beforeEach(function(done) {
      request(app)
        .get('/api/loans')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          loans = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      loans.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/loans', function() {
    beforeEach(function(done) {
      sinon.stub(LoanUtil, 'risksTooHigh', function () {
        return new Promise(function (resolve) {
          resolve();
        });
      });

      request(app)
        .post('/api/loans')
        .send({
          name: 'Pavel Staselun',
          phone: '123456789',
          iban: 'LVHABA5023123789287423',
          amount: 100,
          return: date
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newLoan = res.body;
          done();
        });
    });

    it('should respond with the newly created loan', function() {
      newLoan.name.should.equal('Pavel Staselun');
      newLoan.phone.should.equal('123456789');
      newLoan.iban.should.equal('LVHABA5023123789287423');
      newLoan.amount.should.equal(100);
      newLoan.return.should.equal(date.toISOString());
    });

  });

  describe('GET /api/loans/:id', function() {
    var loan;

    beforeEach(function(done) {
      request(app)
        .get('/api/loans/' + newLoan._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          loan = res.body;
          done();
        });
    });

    afterEach(function() {
      loan = {};
    });

    it('should respond with the requested loan', function() {
      loan.name.should.equal('Pavel Staselun');
      loan.phone.should.equal('123456789');
      loan.iban.should.equal('LVHABA5023123789287423');
      loan.amount.should.equal(100);
      loan.return.should.equal(date.toISOString());
    });
  });
});
