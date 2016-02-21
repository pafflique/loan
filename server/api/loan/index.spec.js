'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var loanCtrlStub = {
  index: 'loanCtrl.index',
  show: 'loanCtrl.show',
  create: 'loanCtrl.create'
};

var routerStub = {
  get: sinon.spy(),
  post: sinon.spy()
};

// require the index with our stubbed out modules
var loanIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './loan.controller': loanCtrlStub
});

describe('Loan API Router:', function() {

  it('should return an express router instance', function() {
    loanIndex.should.equal(routerStub);
  });

  describe('GET /api/loans', function() {

    it('should route to loan.controller.index', function() {
      routerStub.get
        .withArgs('/', 'loanCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/loans/:id', function() {

    it('should route to loan.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'loanCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/loans', function() {

    it('should route to loan.controller.create', function() {
      routerStub.post
        .withArgs('/', 'loanCtrl.create')
        .should.have.been.calledOnce;
    });

  });
});
