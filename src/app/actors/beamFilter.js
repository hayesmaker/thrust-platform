/**
 * @module filters
 * @class beamFilter
 * @type {{filter: null, fragmentSrc: string[], init: Function, start: Function, end: Function, update: Function}}
 */
module.exports = {
  /**
   * @property filter
   * @type {Phaser.Filter}
   */
  filter: null,

  fragmentSrc: null,

  /**
   * @method init
   */
  init: function() {
    this.fragmentSrc = [

      "precision mediump float;",

      "uniform vec2      resolution;",
      "uniform float     time;",

      "#define PI 90",

      "void main( void ) {",

      "vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.5;",

      "float sx = 0.3 * (p.x + 0.8) * sin( 200.0 * p.x - 1. * pow(time, 0.55)*5.);",

      "float dy = 4./ ( 200.0 * abs(p.y - sx));",

      "dy += 1./ (25. * length(p - vec2(p.x, 0.)));",

      "gl_FragColor = vec4( (p.x + 0.1) * dy, 0.3 * dy, dy, 1.1 );",

      "}"];
    this.filter = new Phaser.Filter(game, null, this.fragmentSrc);
    this.filter.setResolution(700, 500);
  },

  /**
   * @method start
   */
  start: function() {
    this.sprite = game.add.sprite();
    this.sprite.width = 700;
    this.sprite.height = 500;
    this.sprite.filters = [ this.filter ];
  },

  /**
   * @method end
   */
  end: function() {

  },

  update: function() {
    this.filter.update();
  }





};