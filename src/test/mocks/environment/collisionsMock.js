var sinon = require('sinon');
var Collisions = require('../../../app/environment/Collisions');

module.exports = function() {

  var collisions          = sinon.createStubInstance(Collisions);
  collisions.players      = [];
  collisions.terrain 	    = [];
  collisions.orb	 		    = [];
  collisions.bullets	    = [];
  collisions.enemyBullets = [];
  collisions.enemies 		  = [];

  return collisions;
};