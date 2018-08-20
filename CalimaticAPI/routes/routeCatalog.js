var express = require('express');
var router = express.Router();

// Require controller modules.
//var productController = require('../Controller/ProductController');


var accountController = require('../Controller/AccountCountroller')();

// GET catalog home page.
router.get('/account', accountController);

module.exports = router;