define(function (require) {
	var Stats = require('stats');

	var addStats = function () {
		console.log('fuck');
	};


	var boot = function(game) {
		console.log('boot ::', game);
	};

	boot.prototype = {

		preload: function(){
          addStats();
		},

		create: function() {
			console.log('shit');
		}
	};

	return boot;

});

/*


 module.exports = function(game) {

 var boot = {};

 boot.create = function () {

 if (properties.showStats) {
 addStats();
 }

 game.sound.mute = properties.mute;

 game.state.start('preloader');
 };

 function addStats() {
 var stats = new Stats();

 stats.setMode(0);

 stats.domElement.style.position = 'absolute';
 stats.domElement.style.right = '0px';
 stats.domElement.style.top = '0px';

 document.body.appendChild(stats.domElement);

 setInterval(function () {
 stats.begin();
 stats.end();
 }, 1000 / 60);
 }

 return boot;
 };
 */