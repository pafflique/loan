'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var LoanSchema = new mongoose.Schema({
  name: {type: String, required: true},
  phone: {type: String, required: true},
  iban: {type: String, required: true},
  amount: {type: Number, required: true},
  interest: {type: Number, default: 0.05},
  return: {type: Date, required: true},
  request: {type: Date},
  extensions: {type: Number, default: 0},
  ip: {type: String}
});

export default mongoose.model('Loan', LoanSchema);
