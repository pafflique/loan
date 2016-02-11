'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var LoanSchema = new mongoose.Schema({
  name: {type: String, required: true},
  phone: {type: String, required: true},
  iban: {type: String, required: true},
  amount: {type: Number, required: true},
  return: {type: Date, required: true}
});

export default mongoose.model('Loan', LoanSchema);
