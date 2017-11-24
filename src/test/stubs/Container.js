export default class Container {
  constructor() {
    this.name = 'ContainerMock';
    this.children = [];
    this.pivot = {x: 0, y: 0};
    this.position = {x: 0, y: 0};
    this.scale = {
      x: 1,
      y: 1,
      set: (x, y) => {
        this.scale.x = x;
        this.scale.y = y;
      }
    };
  }

  addChild(displayObject) {
    this.children.push(displayObject);
  }
}
