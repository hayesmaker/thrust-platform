var expect = require('chai').expect,
	sinon = require('sinon'),
	UserControl = require('../../src/environment/UserControl');

describe("UserControl tests", function() {

	var myUserControl, initSpy;

	before(function() {

	});

	beforeEach(function() {

		initSpy = sinon.spy(UserControl.prototype, 'init');
		myClass = new UserControl();
	});

	afterEach(function() {
		UserControl.prototype.init.restore();
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