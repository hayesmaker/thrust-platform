
const FACTOR = 100;

export function pixi (value, y) {
  return value * FACTOR * (y ? -1 : 1);
}

export function p2 (value) {
  return value / FACTOR;
}