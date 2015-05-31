var expect = require('chai').expect,
	sinon = require('sinon'),
	Map = require('../../src/actors/Map');

describe("Map tests", function() {

	var myMap, initSpy;

	before(function() {

	});

	beforeEach(function() {

		initSpy = sinon.spy(Map.prototype, 'init');
		myClass = new Map();
	});

	afterEach(function() {
		Map.prototype.init.restore();
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