var expect = require('chai').expect,
	sinon = require('sinon'),
	Turret = require('../../src/actors/Turret');

describe("Turret tests", function() {

	var myTurret, initSpy;

	before(function() {

	});

	beforeEach(function() {

		initSpy = sinon.spy(Turret.prototype, 'init');
		myClass = new Turret();
	});

	afterEach(function() {
		Turret.prototype.init.restore();
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