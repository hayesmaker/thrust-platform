module.exports = {
  /**
   * Pythagorus ftw
   *
   * @method distAtoB
   * @param pointA
   * @param pointB
   * @returns {number}
   */
  distAtoB: function(pointA, pointB) {

    var A = pointB.x - pointA.x;
    var B = pointB.y - pointA.y;

    return Math.sqrt(A*A + B*B);
  }
};
