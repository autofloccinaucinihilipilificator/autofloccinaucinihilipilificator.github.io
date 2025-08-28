class Coalition {
  id: number;
  parties: Party[] = [];
  name: string;
  totalSeats: number; // total number of seats in legislature
  
  seats: number;
  majority: boolean;

  html = {
    coalition: <HTMLElement>null,
    coalitionLabel: <HTMLElement>null,
    coalitionParties: <HTMLElement>null,
    coalitionSeats: <HTMLElement>null,
    coalitionMajority: <HTMLElement>null,
  };

  constructor(id: number, parties: Party[], name: string, totalSeats: number) {
    this.id = id;
    this.parties = parties;
    this.name = name;
    this.totalSeats = totalSeats;

    this.seats = 0;
    this.majority = false;

    this.html.coalition = document.getElementById(`coalition-${id}`);
    this.html.coalitionLabel = document.getElementById(`coalition-${id}-label`);
    this.html.coalitionParties = document.getElementById(`coalition-${id}-parties`);
    this.html.coalitionSeats = document.getElementById(`coalition-${id}-seats`);
    this.html.coalitionMajority = document.getElementById(`coalition-${id}-majority`);

    this.update();
  }

  update() {
    this.seats = 0;
    this.parties.forEach((party) => {
      this.seats += party.seats;
    });

    this.majority = this.seats > this.totalSeats / 2;
    this.updateHTML()
  }

  updateHTML() {

    this.html.coalitionLabel.innerHTML = this.name;
    this.html.coalitionSeats.innerHTML = this.seats.toString();
    this.html.coalitionMajority.innerHTML = (this.majority ? "YES" : "NO");
    

    this.html.coalitionParties.innerHTML = ""
    this.parties.forEach((party) => {
      this.html.coalitionParties.innerHTML += party.title + "-";
    });
    this.html.coalitionParties.innerHTML = this.html.coalitionParties.innerHTML.slice(0, -1);
  }
}