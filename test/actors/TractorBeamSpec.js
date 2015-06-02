var expect = require('chai').expect,
	sinon = require('sinon'),
	TractorBeam = require('../../src/actors/TractorBeam');

describe("TractorBeam tests", function() {

	var myTractorBeam, initSpy;

	before(function() {

	});

	beforeEach(function() {

		initSpy = sinon.spy(TractorBeam.prototype, 'init');
		myClass = new TractorBeam();
	});

	afterEach(function() {
		TractorBeam.prototype.init.restore();
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