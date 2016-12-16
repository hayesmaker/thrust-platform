var Cocoon = global.Cocoon || {};


module.exports = {

  levelsPurchased: [],

  productIds: ['classicLevels1'],

  inappsService: null,

  onLevelsPurchased: null,

  /**
   * @method init
   */
  init: function () {
    if (Cocoon.InApp) {
      this.inappsService = Cocoon.InApp;
      this.onLevelsPurchased = new Phaser.Signal();
    } else {
      return;
    }

    this.inappsService.initialize({
      autofinish: true
    }, function (error) {
      if (error) {
        console.error(error);
      }

      var levelsPurchased = this.checkLevelsPurchased();
      console.info('inappsService initialized :: levelsPurchased=', levelsPurchased);
      //Fetch products from the server
      /*
       this.inappsService.fetchProducts(this.productIds, function (products, error) {
       if (error) {
       alert('error: ' + error);
       } else {
       console.info('products:', products);
       //alert(products.toString());
       }
       });
       */

    }.bind(this));

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

  /**
   *
   */
  buyClassicLevels: function () {
    if (this.inappsService) {
      this.inappsService.purchase('classicLevels1', 1, function (error) {
        if (error) {

        } else {
          this.levelsPurchased.push('classicLevels1');
          this.onLevelsPurchased.dispatch();
          alert('All Classic Levels are now unlocked.  For speed run and endless mode GOTO OPTIONS > General.' +
            ' Happy Thrusting!');
        }
      }.bind(this));
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