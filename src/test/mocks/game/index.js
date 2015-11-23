var sinon = require('sinon');

module.exports = function() {

  return {
    stats: require('./stats'),

    controls: {
      isJoypadEnabled: false
    },
    load: {
      atlas: function() {},
      image: function() {},
      physics: function() {}
    }


  }


};