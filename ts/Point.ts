class Point {
  x: number;
  y: number;
  theta: number; // angle between seat and negative x axis

  constructor(x: number, y:number) {
    this.x = x;
    this.y = y;

    this.theta = Math.atan(-1 * y / x)
    if (this.theta < 0) {
      this.theta += Math.PI;
    }
  }
}