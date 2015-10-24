var expect = require('chai').expect,
	sinon = require('sinon'),
	Collisions = require('../../src/environment/Collisions');

describe("Collisions tests", function() {

	var myClass, initSpy, logSpy;

	before(function() {

	});

	beforeEach(function() {

		initSpy = sinon.spy(Collisions.prototype, 'init');
		logSpy = sinon.spy(console, 'log');

		myClass = new Collisions();
	});

	afterEach(function() {

		Collisions.prototype.init.restore();
		console.log.restore();

	});

	after(function() {

	});

	describe("constructor: (*EXAMPLE* please replace with your own tests)", function() {

		it("myPublicVar is set correctly", function() {
			expect(myClass.myPublicVar).to.equal(1);
		});

		it("init is called", function() {
			expect(initSpy.called).to.equal(true);
		});

	});
});