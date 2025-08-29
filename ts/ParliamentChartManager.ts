class ParliamentChartManager {

  rowCount: number;
  totalSeats: number;
  innerRadius: number;
  outerRadius: number;
  rowGap: number;

  centerPosition: [number, number];

  parties: Party[];
  seats: Point[];
  rowSeatCounts: number[] = [];

  html = {
    parliamentChart: document.getElementById('parliament-chart'),
    seats: [HTMLElement],
  }

  constructor(
    rowCount: number,
    totalSeats: number,
    innerRadius: number,
    outerRadius: number,
    centerPosiition: [number, number],
    parties: Party[]
  ) {
    this.rowCount = rowCount;
    this.totalSeats = totalSeats;
    this.innerRadius = innerRadius;
    this.outerRadius = outerRadius;
    this.centerPosition = centerPosiition;
    
    this.parties = parties;

    this.rowGap = (this.innerRadius - this.outerRadius) / (rowCount - 1);

    this.computeSeatLocations()
  }

  computeRowCounts() {

    // badly named magic numbers
    let rowCoeff: number = 1;
    let totalLength: number = 1.5 * this.rowCount; 
    let leftovers : number[] = [];
    let seatsDrawn: number = 0;
    
    for (let i = 0; i < this.rowCount; i++) {
      this.rowSeatCounts.push(Math.floor(
        this.totalSeats * rowCoeff / totalLength
      ));

      leftovers.push(this.totalSeats * rowCoeff / totalLength - Math.floor(this.totalSeats * rowCoeff / totalLength))
      seatsDrawn += Math.floor(this.totalSeats * rowCoeff / totalLength);

      rowCoeff += 1 / (this.rowCount - 1);
    }

    let indexHighest = 0;

    console.log('seatsDrawn: ' + seatsDrawn);
    console.log('rowSeatCounts: ' + this.rowSeatCounts);

    for (let i = 0; i < this.totalSeats - seatsDrawn; i++) {
      indexHighest = ParliamentChartManager.maxValueIndex(leftovers);
      this.rowSeatCounts[indexHighest] = this.rowSeatCounts[indexHighest] + 1;
      leftovers[indexHighest] = 0;
      console.log('i: ' + i);
    }

  }

  computeSeatLocations() {
    this.computeRowCounts();

    let thisRowSeats = 0;

    for (let row: number = 0; row < this.rowCount; row++) {
      thisRowSeats = this.rowSeatCounts[thisRowSeats];
      
      for (let seat: number = 0; seat < thisRowSeats; seat++) {
        this.seats.push(new Point(Math.PI * seat / thisRowSeats, this.innerRadius + this.rowGap * row));
        this.seats[-1].x += this.centerPosition[0];
        this.seats[-1].y += this.centerPosition[1];
      }
    }

    this.seats.sort((a, b) => {
      if (a.theta == b.theta) {
        return a.radius - b.radius;
      }
      else {
        return a.theta - b.theta;
      }
    });
  }

  static maxValueIndex(array: number[]) {
    return array.reduce(((currentBest, x, i, array) => x > array[currentBest] ? i : currentBest), 0);
  }
}