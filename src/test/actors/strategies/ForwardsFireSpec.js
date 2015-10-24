var expect = require('chai').expect,
	sinon = require('sinon'),
	ForwardsFire = require('../../src/actors/ForwardsFire');

describe("ForwardsFire tests", function() {

	var myForwardsFire, initSpy;

	before(function() {

	});

	beforeEach(function() {

		initSpy = sinon.spy(ForwardsFire.prototype, 'init');
		myClass = new ForwardsFire();
	});

	afterEach(function() {
		ForwardsFire.prototype.init.restore();
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