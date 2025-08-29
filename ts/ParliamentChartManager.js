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
    computeSeatLocations() {
        // badly named magic numbers
        let rowCoeff = 1;
        let totalLength = 1.5 * this.rowCount;
        let leftovers = [];
        let seatsDrawn = 0;
        for (let i = 0; i < this.rowCount; i++) {
            this.rowSeatCounts.push(Math.floor(this.totalSeats * rowCoeff / totalLength));
            leftovers.push(this.totalSeats * rowCoeff / totalLength - Math.floor(this.totalSeats * rowCoeff / totalLength));
            rowCoeff += 2 / (this.rowCount - 1);
            seatsDrawn += 1;
        }
        let indexHighest = 0;
        for (let i = 0; i < this.totalSeats - seatsDrawn; i++) {
            indexHighest = ParliamentChartManager.maxValueIndex(leftovers);
            this.rowSeatCounts[indexHighest] = this.rowSeatCounts[indexHighest]++;
            leftovers[indexHighest]--;
        }
    }
    static maxValueIndex(array) {
        return array.reduce(((currentBest, x, i, array) => x > array[currentBest] ? i : currentBest), 0);
    }
}
