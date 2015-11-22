var sinon = require('sinon');

module.exports = {

  collisions: require('./environment/collisionsMock'),

  body: {
    clearShapes: sinon.stub(),
    loadPolygon: sinon.stub(),
    setCollisionGroup: sinon.stub(),
    collides: sinon.stub(),
    particleClass: {

    }
  },

  newGame: require('./game/index'),

  game: {
    controls: {
      isJoypadEnabled: true
    },

    load: {
      atlas: sinon.stub(),
      image: sinon.stub(),
      physics: sinon.stub()
    },

    add: {
      emitter: sinon.stub().returns({
        particleClass: null,
        makeParticles: sinon.stub()
      })
    },

    physics: {
      p2: {
        enable: sinon.stub()
      }
    },
    world: {
      centerX: 500
    },
    make: {
      sprite: sinon.stub().
        returns({
          addChild: sinon.stub(),
          body: {
            clearShapes: sinon.stub(),
            addRectangle: sinon.stub(),
            setCollisionGroup: sinon.stub(),
            collides: sinon.stub()
          },
          scale: {
            setTo: sinon.stub()
          },
          pivot: {
            x: 50,
            y: 150
          }
        })
    },

    math: {
      degToRad: sinon.stub().returns(100)
    }
  }
};
