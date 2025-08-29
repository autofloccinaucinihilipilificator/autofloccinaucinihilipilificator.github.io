"use strict";
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.theta = Math.atan(-1 * y / x);
        if (this.theta < 0) {
            this.theta += Math.PI;
        }
    }
}
