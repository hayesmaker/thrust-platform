var Cocoon = global.Cocoon || {};
var options = require('./options-model');


module.exports = {

  levelsPurchased: [],
//classicLevels1
  productIds: ['classicLevels1'],

  inappsService: null,

  onLevelsPurchased: null,

  /**
   * @method init
   */
  init: function () {
    this.onLevelsPurchased = new Phaser.Signal();
    console.log('in-app-purchases init :: Cocoon', Cocoon && Cocoon.InApp);
    if (Cocoon.InApp) {
      this.inappsService = Cocoon.InApp;
      options.lockGameModes();
    } else {
      return;
    }

    this.inappsService.initialize({
      autofinish: true
    }, function (error) {
      if (error) {
        console.error(error);
      }
      console.log('inappsService initialized :: levelsPurchased=', levelsPurchased);
      var levelsPurchased = this.checkLevelsPurchased();

    }.bind(this));

    this.inappsService.fetchProducts(this.productIds, function(products, error){
      if(error){
        console.log("Error: " + error);
      }
      else {
        for (var i = 0; i < products.length; ++i) {
          var product = products[i];
          console.log(product);
        }
      }
    });

    this.inappsService.on("purchase", {
      start: function (productId) {
        console.log("purchase started " + productId);
      },
      error: function (productId, error) {
        console.warn("purchase failed " + productId + " error: " + JSON.stringify(error));
        alert("purchase failed " + productId + " error: " + JSON.stringify(error));
      },
      complete: function (purchase) {
        console.log("purchase completed " + JSON.stringify(purchase));
      }
    });
  },



  restorePurchases: function(callback) {
    if (this.inappsService) {
      this.inappsService.restorePurchases(function(error) {
        if (error){
          alert(JSON.stringify(error));
          callback.call();
        } else {
          this.levelsPurchased.push('classicLevels1');
          this.onLevelsPurchased.dispatch();
          alert("Purchases restored");
        }
      });
    } else {
      console.log('in app purchase api not available');
      callback.call();
    }
  },

  /**
   *
   */
  buyClassicLevels: function (callback) {
    if (this.inappsService) {
      this.inappsService.purchase('classicLevels1', 1, function (error) {
        if (error) {
          callback.call();
        } else {
          this.levelsPurchased.push('classicLevels1');
          callback.call();
          this.onLevelsPurchased.dispatch();
          alert('All Classic Levels are now unlocked.  For speed run and endless mode GOTO OPTIONS > General.' +
            ' Happy Thrusting!');
        }
      }.bind(this));
    } else {
      console.log('sorry no purchases available on this platform');
      callback.call();
    }
  },

  /**
   *
   */
  checkLevelsPurchased: function () {
    if (this.inappsService) {
      if (this.inappsService.isPurchased(['classicLevels1'])) {
        if (this.levelsPurchased.indexOf('classicLevels1') < 0) {
          this.levelsPurchased.push('classicLevels1');
          options.unlockGameModes();
        }
        return true;
      } else {
        return false;
      }
    }
  }


};

/*

 inappsService.on("purchase", {
 start: function(productId) {
 console.log("purchase started " + productId);
 },
 error: function(productId, error) {
 console.log("purchase failed " + productId + " error: " + JSON.stringify(error));
 },
 complete: function(purchase) {
 console.log("purchase completed " + JSON.stringify(purchase));
 }
 });

 // Service initialization
 inappsService.initialize({
 autofinish: true
 }, function(error){

 }
 );
 */