var pkg = require('../package');
var express = require('express');
var router = express.Router();
var title = "Thrust 30";

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    title: title,
    version: pkg.version,
    engine: 'javascripts/browserify/thrust-engine-auto.js'
  });
});

router.get('/gobbapeas', function(req, res) {
  res.render('app', {
    title: 'Thrust 30 - @gobbapeas',
    version: pkg.version + '-@gobbapeas',
    engine: 'javascripts/browserify/thrust-engine-gobbapeas.js'
  });
});

router.get('/min', function(req, res) {
  res.render('app', {
    title: title + "(minified)",
    version: pkg.version,
    engine: 'javascripts/browserify/thrust-engine-canvas.min.js'
  });
});

router.get('/dev', function(req, res) {
  res.render('app', {
    title: title + " (dev)",
    version: pkg.version,
    engine: 'javascripts/browserify/thrust-engine-canvas.js'
  });
});

router.get('/mobile', function(req, res) {
  res.render('app', {
    title: title + " (mobile)",
    version: pkg.version,
    engine: 'javascripts/browserify/thrust-engine-mobile.js'
  });
});

router.get('/canvas', function(req, res) {
  res.render('app', {
    title: title + " (canvas)",
    version: pkg.version,
    engine: 'javascripts/browserify/thrust-engine-canvas.js'
  });
});

router.get('/webgl', function(req, res) {
  res.render('app', {
    title: title + " (webgl)",
    version: pkg.version,
    engine: 'javascripts/browserify/thrust-engine-webgl.js'
  });
});

router.get('/auto', function(req, res) {
  res.render('app', {
    title: title + " (auto)",
    version: pkg.version,
    engine: 'javascripts/browserify/thrust-engine-auto.js'
  });
});

router.get('/app-loader', function(req, res) {
  res.render('app-loader', {
    title: title + " (auto)",
    version: pkg.version,
    engine: 'javascripts/browserify/thrust-engine-canvas.js'
  });
});

module.exports = router;
