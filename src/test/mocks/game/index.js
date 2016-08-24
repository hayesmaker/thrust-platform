var sinon = require('sinon');

module.exports = function () {

  return {
    device: {
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