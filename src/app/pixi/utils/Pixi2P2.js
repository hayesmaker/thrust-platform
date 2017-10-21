const FACTOR = 100;
const FRACTION = 0.01;

/**
 * Convert p2 physics value (meters) to pixel scale.
 * By default Phaser uses a scale of 20px per meter.
 * If you need to modify this you can over-ride these functions via the Physics Configuration object.
 *
 * @method Phaser.Physics.P2#mpx
 * @param {number} v - The value to convert.
 * @return {number} The scaled value.
 */
export function mpx (v) {
  return v *= FACTOR;
}

/**
 * Convert pixel value to p2 physics scale (meters).
 * By default Phaser uses a scale of 20px per meter.
 * If you need to modify this you can over-ride these functions via the Physics Configuration object.
 *
 * @method Phaser.Physics.P2#pxm
 * @param {number} v - The value to convert.
 * @return {number} The scaled value.
 */
export function pxm (v) {
  return v * FRACTION;
}

/**
 * Convert p2 physics value (meters) to pixel scale and inverses it.
 * By default Phaser uses a scale of 20px per meter.
 * If you need to modify this you can over-ride these functions via the Physics Configuration object.
 *
 * @method Phaser.Physics.P2#mpxi
 * @param {number} v - The value to convert.
 * @return {number} The scaled value.
 */
export function mpxi (v) {
  return v *= -FACTOR;
}

/**
 * Convert pixel value to p2 physics scale (meters) and inverses it.
 * By default Phaser uses a scale of 20px per meter.
 * If you need to modify this you can over-ride these functions via the Physics Configuration object.
 *
 * @method Phaser.Physics.P2#pxmi
 * @param {number} v - The value to convert.
 * @return {number} The scaled value.
 */
export function pxmi (v) {
  return v * -FRACTION;
}