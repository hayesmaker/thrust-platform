var pkg = require('../package');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    title: pkg.name,
    version: pkg.version,
    engine: 'javascripts/browserify/thrust-engine-auto.js'
  });
});

router.get('/min', function(req, res) {
  res.render('app', {
    title: pkg.name,
    version: pkg.version,
    engine: 'javascripts/browserify/thrust-engine-canvas.min.js'
  });
});

router.get('/dev', function(req, res) {
  res.render('app', {
    title: pkg.name,
    version: pkg.version,
    engine: 'javascripts/browserify/thrust-engine-canvas.js'
  });
});

router.get('/canvas', function(req, res) {
  res.render('app', {
    title: pkg.name,
    version: pkg.version,
    engine: 'javascripts/browserify/thrust-engine-canvas.js'
  });
});

router.get('/webgl', function(req, res) {
  res.render('app', {
    title: pkg.name,
    version: pkg.version,
    engine: 'javascripts/browserify/thrust-engine-webgl.js'
  });
});

router.get('/auto', function(req, res) {
  res.render('app', {
    title: pkg.name,
    version: pkg.version,
    engine: 'javascripts/browserify/thrust-engine-auto.js'
  });
});


module.exports = router;
