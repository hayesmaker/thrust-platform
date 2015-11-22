var sinon = require('sinon');

module.exports = function() {

  return {
    controls: {
      isJoypadEnabled: false
    },
    load: {
      atlas: function() {},
      image: sinon.stub(),
      physics: sinon.stub()
    }


  }


};