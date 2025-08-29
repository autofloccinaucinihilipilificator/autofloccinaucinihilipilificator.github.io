"use strict";
class ParliamentChartManager {
    constructor(rowCount, totalSeats, innerRadius, outerRadius, centerPosiition, parties) {
        this.rowSeatCounts = [];
        this.html = {
            parliamentChart: document.getElementById('parliament-chart'),
            seats: [HTMLElement],
        };
        this.rowCount = rowCount;
        this.totalSeats = totalSeats;
        this.innerRadius = innerRadius;
        this.outerRadius = outerRadius;
        this.centerPosition = centerPosiition;
        this.parties = parties;
        this.rowGap = (this.innerRadius - this.outerRadius) / (rowCount - 1);
        this.computeSeatLocations();
    }
    computeRowCounts() {
        // badly named magic numbers
        let rowCoeff = 1;
        let totalLength = 1.5 * this.rowCount;
        let leftovers = [];
        let seatsDrawn = 0;
        for (let i = 0; i < this.rowCount; i++) {
            this.rowSeatCounts.push(Math.floor(this.totalSeats * rowCoeff / totalLength));
            leftovers.push(this.totalSeats * rowCoeff / totalLength - Math.floor(this.totalSeats * rowCoeff / totalLength));
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
        for (let row = 0; row < this.rowCount; row++) {
            thisRowSeats = this.rowSeatCounts[thisRowSeats];
            for (let seat = 0; seat < thisRowSeats; seat++) {
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
    static maxValueIndex(array) {
        return array.reduce(((currentBest, x, i, array) => x > array[currentBest] ? i : currentBest), 0);
    }
}
