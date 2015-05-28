var expect = require('chai').expect,
	sinon = require('sinon'),
	Physics = require('../../src/environment/Physics');

describe("Physics tests", function() {

	var myClass, initSpy;

	before(function() {

	});

	beforeEach(function() {

		initSpy = sinon.spy(Physics.prototype, 'init');
		logSpy = sinon.spy(console, 'log');

		myClass = new Physics();
	});

	afterEach(function() {

		Physics.prototype.init.restore();

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