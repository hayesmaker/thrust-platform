var expect = require('chai').expect,
	sinon = require('sinon'),
	Background = require('../../src/actors/Background');

describe("Background tests", function() {

	var myBackground, initSpy;

	before(function() {

	});

	beforeEach(function() {

		initSpy = sinon.spy(Background.prototype, 'init');
		myClass = new Background();
	});

	afterEach(function() {
		Background.prototype.init.restore();
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