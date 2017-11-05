

/**
 * @class Object pooling utility.
 */
export default class Pool {

  constructor(options) {
    options = options || {};

    /**
     * @property {Array} objects
     * @type {Array}
     */
    this.objects = [];

    if(options.size !== undefined && options.world !== undefined){
      this.resize(options.size, options.world);
    }
  }

  /**
   * @method resize
   * @param {number} size
   * @return {Pool} Self, for chaining
   */
  resize(size, world) {
    let objects = this.objects;

    while (objects.length > size) {
      objects.pop();
    }

    while (objects.length < size) {
      objects.push(this.create(world));
    }

    return this;
  }

  /**
   * Get an object from the pool or create a new instance.
   * @method get
   * @return {Object}
   */
  get() {
    let objects = this.objects;
    return objects.length ? objects.pop() : this.create();
  }

  /**
   * Clean up and put the object back into the pool for later use.
   * @method release
   * @param {Object} object
   * @return {Pool} Self for chaining
   */
  release(object) {
    this.destroy(object);
    this.objects.push(object);
    return this;
  }

}

