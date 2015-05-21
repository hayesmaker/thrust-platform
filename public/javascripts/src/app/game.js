define(function(require) {
	console.log('game instantiated');
	var game = new Phaser.Game(700, 400, Phaser.AUTO, 'game');

	return {

		game: game


	}
});