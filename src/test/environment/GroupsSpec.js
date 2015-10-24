var expect = require('chai').expect,
	sinon = require('sinon'),
	Groups = require('../../src/environment/Groups');

describe("Groups tests", function() {

	var myClass, initSpy, logSpy;

	before(function() {

	});

	beforeEach(function() {

		initSpy = sinon.spy(Groups.prototype, 'init');
		logSpy = sinon.spy(console, 'log');

		myClass = new Groups();
	});

	afterEach(function() {

		Groups.prototype.init.restore();
		console.log.restore();

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