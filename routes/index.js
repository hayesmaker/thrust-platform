var pkg = require('../package');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    title: pkg.name,
    version: pkg.version,
    engine: 'javascripts/browserify/thrust-engine.js'
  });
});

router.get('/min', function(req, res) {
  res.render('app', {
    title: pkg.name,
    version: pkg.version,
    engine: 'javascripts/browserify/thrust-engine.min.js'
  });
});

router.get('/dev', function(req, res) {
  res.render('app', {
    title: pkg.name,
    version: pkg.version,
    engine: 'javascripts/browserify/thrust-engine.js'
  });
});

module.exports = router;
