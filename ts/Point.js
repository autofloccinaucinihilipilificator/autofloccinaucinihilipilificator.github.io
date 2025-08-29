"use strict";
class Point {
    constructor(theta, radius) {
        this.theta = theta;
        this.x = radius * Math.cos(Math.PI - theta);
        this.y = radius * Math.sin(theta);
        this.radius = radius;
    }
}
