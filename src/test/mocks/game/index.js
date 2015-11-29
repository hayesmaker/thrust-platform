var sinon = require('sinon');

module.exports = function () {

  return {
    stats: require('./stats'),

    add: require('./add'),

    controls: {
      isJoypadEnabled: false
    },
    load: {
      onLoadStart: require('./signal'),
      onFileComplete: require('./signal'),
      onLoadComplete: require('./signal'),
      atlas: function () {},
      image: function () {},
      physics: function () {}
    }


  }


};