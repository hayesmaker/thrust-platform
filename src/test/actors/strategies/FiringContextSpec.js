var expect = require('chai').expect,
	sinon = require('sinon'),
	FiringContext = require('../../src/actors/FiringContext');

describe("FiringContext tests", function() {

	var myFiringContext, initSpy;

	before(function() {

	});

	beforeEach(function() {

		initSpy = sinon.spy(FiringContext.prototype, 'init');
		myClass = new FiringContext();
	});

	afterEach(function() {
		FiringContext.prototype.init.restore();
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