module.exports = {
  canvas: require('./canvas'),
  features: require('./features'),
  levelsLoader: require('./levels-loader'),
  /**
   * @method distAtoB
   * @param pointA
   * @param pointB
   * @return {number}
   */
  distAtoB: function(pointA, pointB) {
    var A = pointB.x - pointA.x;
    var B = pointB.y - pointA.y;
    return Math.sqrt(A*A + B*B);
  }
};
