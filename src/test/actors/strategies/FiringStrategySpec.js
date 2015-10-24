var expect = require('chai').expect,
	sinon = require('sinon'),
	FiringStrategy = require('../../src/actors/FiringStrategy');

describe("FiringStrategy tests", function() {

	var myFiringStrategy, initSpy;

	before(function() {

	});

	beforeEach(function() {

		initSpy = sinon.spy(FiringStrategy.prototype, 'init');
		myClass = new FiringStrategy();
	});

	afterEach(function() {
		FiringStrategy.prototype.init.restore();
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