/*
function isTouchDevice(){
    return true == ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch);
}
Now checking if ‘isTouchDevice();’ is returns true it means its a touch device.

if(isTouchDevice()===true) {
    alert('Touch Device'); //your logic for touch device
}
else {
    alert('Not a Touch Device'); //your logic for non touch device
}
*/





module.exports = {
  init: function () {
    this.isTouchScreen = (('ontouchstart' in window)
        || (navigator.MaxTouchPoints > 0)
        || (navigator.msMaxTouchPoints > 0));
    console.log("touchScreen:", this.isTouchScreen);
  },
  isTouchScreen: this.isTouchScreen
}