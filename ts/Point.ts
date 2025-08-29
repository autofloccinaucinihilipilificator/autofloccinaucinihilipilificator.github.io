class Point {
  x: number;
  y: number;
  theta: number; // angle between seat and negative x axis
  radius: number;

  constructor(theta: number, radius: number) {
    this.theta = theta;
    this.x = radius * Math.cos(Math.PI - theta);
    this.y = radius * Math.sin(theta);
    this.radius = radius
  }
}