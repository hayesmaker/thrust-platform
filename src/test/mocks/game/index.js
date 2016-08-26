var sinon = require('sinon');

module.exports = function () {

  return {

    /*
     game.time.desiredFps = 60;
     if (game.device.iOS || game.device.android || game.device.windowsPhone) {
     game.time.desiredFps = 30;
     }
     */

    time: {
      desiredFps: 1
    },
    
    device: {
      iOS: false,
      android: false,
      windowsPhone: false,
      pixelRatio: 1
    },

    stats: require('./stats'),

    add: require('./add'),

    fpsProblemNotifier: require('./signal'),

    controls: {
      isJoypadEnabled: false
    },
    load: {
      audiosprite: function() {},
      onLoadStart: require('./signal'),
      onFileComplete: require('./signal'),
      onLoadComplete: require('./signal'),
      atlas: function () {},
      image: function () {},
      physics: function () {}
    }


  }


};