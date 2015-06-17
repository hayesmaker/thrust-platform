var sinon = require('sinon');

module.exports = {
	/*
	 this.body.clearShapes();
	 this.body.addRectangle(-10,-17, 0,-2);
	 this.body.collideWorldBounds = properties.collideWorldBounds;
	 this.body.mass = 1;
	 this.body.setCollisionGroup(this.collisions.players);
	 this.body.collides(this.collisions.terrain, this.crash, this);
	 */
	game: {

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
