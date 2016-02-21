'use strict';

var express = require('express');
var controller = require('./loan.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.post('/:id/extend', controller.extend);

module.exports = router;
