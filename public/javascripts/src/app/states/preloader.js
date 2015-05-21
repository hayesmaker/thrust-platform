module.exports = function(game) {

  var preloader = {};

  preloader.preload = function () {
    game.load.image('logo', 'images/phaser.png');
  };

  preloader.create = function () {
    game.state.start('game');
  };

  return preloader;
};
