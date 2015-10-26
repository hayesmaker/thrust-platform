var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    title: 'Thrust Engine'
  });
});

router.get('/min', function(req, res) {
  res.render('app', {
    title: 'Thrust Engine',
    engine: 'javascripts/browserify/thrust-engine.min.js'
  });
});

router.get('/app', function(req, res) {
  res.render('app', {
    title: 'Thrust Engine',
    engine: 'javascripts/browserify/thrust-engine.js'
  });
});

module.exports = router;
