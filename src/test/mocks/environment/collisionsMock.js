var sinon = require('sinon');
var Collisions = require('../../../app/environment/Collisions');

module.exports = function() {

  var collisions          = sinon.createStubInstance(Collisions);
  collisions.players      = sinon.createStubInstance(Phaser.Group);
  collisions.terrain 	    = sinon.createStubInstance(Phaser.Group);
  collisions.orb	 		    = sinon.createStubInstance(Phaser.Group);
  collisions.bullets	    = sinon.createStubInstance(Phaser.Group);
  collisions.enemyBullets = sinon.createStubInstance(Phaser.Group);
  collisions.enemies 		  = sinon.createStubInstance(Phaser.Group);

  return collisions;
};