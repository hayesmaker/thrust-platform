var game = new Phaser.Game(700,500, Phaser.AUTO);

window.game = game;

game.state.add('play', require('./states/play'));
game.state.add('load', require('./states/load'));
game.state.add('menu', require('./states/menu'));
game.state.add('boot', require('./states/boot'));

game.state.start('play');