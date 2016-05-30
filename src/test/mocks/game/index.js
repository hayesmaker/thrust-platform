var sinon = require('sinon');

module.exports = function () {

  return {
    stats: require('./stats'),

    add: require('./add'),

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