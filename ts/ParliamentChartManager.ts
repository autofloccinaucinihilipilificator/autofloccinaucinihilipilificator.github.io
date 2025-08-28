class ParliamentChartManager {
  
  outerRadius: number;
  innerRadius: number;
  seatCount: number;
  rowCount: number;
  bottomLeftPos: [number, number];

  centerPos: [number, number];

  totalArcLength: number;
  arcLengths: number[];

  seatLocations: [number, number, number][] = []; // x, y, theta with left is 0, right is pi

  
  constructor() {
    
  }

  drawChart() {

  }

  computeSeatPos() {
    this.totalArcLength = (this.rowCount - 1) * (this.outerRadius - this.innerRadius) * Math.PI / 2 + this.innerRadius * this.rowCount * Math.PI;

    for (let i = 0; i < this.rowCount; i++) {
      this.arcLengths.push(i * (this.outerRadius - this.innerRadius) / this.rowCount + i);
    }
  }

  compareSeatPos(a: [number, number], b: [number, number]) {

  }
}