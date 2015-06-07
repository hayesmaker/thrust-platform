var expect = require('chai').expect,
	sinon = require('sinon'),
	StatsModule = require('../../src/utils/StatsModule');

describe("StatsModule tests", function() {

	var myStatsModule, initSpy;

	before(function() {

	});

	beforeEach(function() {

		initSpy = sinon.spy(StatsModule.prototype, 'init');
		myClass = new StatsModule();
	});

	afterEach(function() {
		StatsModule.prototype.init.restore();
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