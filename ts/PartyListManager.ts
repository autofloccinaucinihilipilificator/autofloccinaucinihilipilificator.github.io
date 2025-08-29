// Deals with parties and coalitions

class PartyListManager {
  partyIDCounter: number;
  coalitionIDCounter: number;
  totalSeats: number;
  totalVoteShare: number = 0;

  parties: Party[] = [];
  coalitions: Coalition[] = [];

  html = {
    partyList: document.getElementById('party-list'),
    totalVoteShareInner: document.getElementById('total-vote-share-inner'),
    coalitionList: document.getElementById('coalition-list'),
  }

  constructor(totalSeats: number) {
    this.partyIDCounter = 0;
    this.coalitionIDCounter = 0;
    this.totalSeats = totalSeats;
  }

  addParty(title: string, subtitle: string, share: number, solidColor: string) {

    this.html.partyList.insertAdjacentHTML('beforeend',
      `<div id="party-${this.partyIDCounter}" class="party">
          <div id="party-${this.partyIDCounter}-wrapper" class="party-wrapper" style="background-color: ${solidColor};">
            <div id="party-${this.partyIDCounter}-text" class="party-text">
              <label id="party-${this.partyIDCounter}-title" class="party-title" for="party-${this.partyIDCounter}-input">${title}</label>
              <p id="party-${this.partyIDCounter}-subtitle" class="party-subtitle"><i>${subtitle}</i></p>
            </div>
            <input type="number" min="0" max="100" step="0.01" id="party-${this.partyIDCounter}-share">%</input>
            <p id="party-${this.partyIDCounter}-seats" class="party-seats">seats</p>
          </div>
          <input type="range" min="0" max="100" step="0.01" id="party-${this.partyIDCounter}-slider" class="party-slider"/>
        </div>`);

    this.parties.push(new Party(this.partyIDCounter, title, subtitle, share, solidColor));

    this.parties[this.partyIDCounter].html.sliderElement.addEventListener('input', (e) => {
      this.checkTotalVoteShare();
      this.calculateSeats();
      this.updateCoalitions();
    });

    this.parties[this.partyIDCounter].html.shareElement.addEventListener('change', (e) => {
      this.checkTotalVoteShare();
      this.calculateSeats();
      this.updateCoalitions();
    });

    this.checkTotalVoteShare();
    this.calculateSeats();
    this.updateCoalitions();

    this.partyIDCounter += 1;
  }

  removeParty(id: number) {

  }

  addCoalition(name:string, parties: Party[]) {

    this.html.coalitionList.insertAdjacentHTML('beforeend', `<p id="coalition-${this.coalitionIDCounter}">
          <span id="coalition-${this.coalitionIDCounter}-label"></span> (<i id="coalition-${this.coalitionIDCounter}-parties"></i>): 
          <span id="coalition-${this.coalitionIDCounter}-seats"></span>
           - Majority: <span id="coalition-${this.coalitionIDCounter}-majority"></span>
        </p>`);

    this.coalitions.push(new Coalition(this.coalitionIDCounter, parties, name, this.totalSeats));

    this.coalitionIDCounter += 1;

    this.updateCoalitions();
  }

  removeCoalition(id: number) {

  }

  // Check total vote share, unhide appropriate warning if not 100%
  checkTotalVoteShare() {
    let totalBasisPoints: number = 0; // avoid float problems

    this.parties.forEach((party) => {
      totalBasisPoints += Math.round(party.share * 100)
    });

    this.totalVoteShare = totalBasisPoints / 10000;
    this.html.totalVoteShareInner.innerHTML = (totalBasisPoints / 100).toString() + "%";
  }

  calculateSeats() {
    let tempParties: Party[] = [];
    let seatsAllocated: number = 0;

    // NL - d'Hondt method with 1 seat (1/150, ~0.67%) threshhold 
    this.parties.forEach((party) => {
      party.seats = 0;
      if (party.share > 2 / 3) {
        tempParties.push(new Party(party.id, party.title, party.subtitle, party.share, party.solidColor))
      }
    });

    while (seatsAllocated < this.totalSeats) {
      tempParties.sort((a, b) => {
        return (b.share / (1 + b.seats)) - (a.share / (1 + a.seats))
      });
      this.parties[tempParties[0].id].seats += 1;
      tempParties[0].seats += 1;
      seatsAllocated += 1;
    }

    this.parties.forEach(party => {
      party.html.seatsElement.innerHTML = party.seats.toString();
    });
  }

  updateCoalitions() {
    this.coalitions.forEach((coalition) => {
      coalition.update();
    });
  }
}