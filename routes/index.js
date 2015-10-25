var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Thrust Engine',
    engine: 'javascripts/browserify/thrust-engine.js'
  });
});

router.get('/min', function(req, res, next) {
  res.render('index', {
    title: 'Thrust Engine',
    engine: 'javascripts/browserify/thrust-engine.min.js'
  });
});

module.exports = router;