class Site {

  // mapManager: MapManager;
  parliamentChartManager: ParliamentChartManager;
  partyListManager: PartyListManager;
  // pieChartManager: PieChartManager;

  constructor() {
    this.partyListManager = new PartyListManager(150);

    this.partyListManager.addParty('SP', 'Socialistische Partij', 3.15);
    this.partyListManager.addParty('PvdD', 'Partij voor de Dieren', 2.25);
    this.partyListManager.addParty('Denk', 'Denk', 2.37);
    this.partyListManager.addParty('GL/PvdA', 'GroenLinks/Partij van de Arbeid', 15.75);
    this.partyListManager.addParty('Volt', 'Volt Nederland', 1.71);
    this.partyListManager.addParty('D66', 'Democraten 66', 6.29);
    this.partyListManager.addParty('CU', 'ChristenUnie', 2.04);
    this.partyListManager.addParty('NSC', 'Nieuw Sociaal Contract', 12.88);
    this.partyListManager.addParty('VVD', 'Volkspartij voor Vrijheid en Democratie', 15.25);
    this.partyListManager.addParty('CDA', 'Christen-Democratisch Appel', 3.31);
    this.partyListManager.addParty('BBB', 'BoerBurgerBeweging', 4.65);
    this.partyListManager.addParty('JA21', 'JA21', 0.68);
    this.partyListManager.addParty('SGP', 'Staatkundig Gereformeerde Partij', 2.04);
    this.partyListManager.addParty('PVV', 'Partij voor de Vrijheid', 23.49);
    this.partyListManager.addParty('FvD', 'Forum voor Democratie', 2.23);

    this.partyListManager.addCoalition("Broad center-left", [
      this.partyListManager.parties[0], // SP
      this.partyListManager.parties[1], // PvdD
      this.partyListManager.parties[3], // GL/PvdA
      this.partyListManager.parties[4], // Volt
      this.partyListManager.parties[5], // D66
      this.partyListManager.parties[6], // CU
      this.partyListManager.parties[7], // NSC
    ]);

    this.partyListManager.addCoalition("Broad center", [
      this.partyListManager.parties[3], // GL/PvdA
      this.partyListManager.parties[4], // Volt
      this.partyListManager.parties[5], // D66
      this.partyListManager.parties[6], // CU
      this.partyListManager.parties[7], // NSC
      this.partyListManager.parties[8], // VVD
      this.partyListManager.parties[9], // CDA
    ]);

    this.partyListManager.addCoalition('"Narrow" center 2023', [
      this.partyListManager.parties[3], // GL/PvdA
      this.partyListManager.parties[5], // D66
      this.partyListManager.parties[7], // NSC
      this.partyListManager.parties[8], // VVD
    ]);

    this.partyListManager.addCoalition('"Narrow" center 2025', [
      this.partyListManager.parties[3], // GL/PvdA
      this.partyListManager.parties[5], // D66
      this.partyListManager.parties[8], // VVD
      this.partyListManager.parties[9], // CDA
    ]);

    this.partyListManager.addCoalition("Rutte III, IV", [
      this.partyListManager.parties[5], // D66
      this.partyListManager.parties[6], // CU
      this.partyListManager.parties[8], // VVD
      this.partyListManager.parties[9], // CDA
    ]);
    
    this.partyListManager.addCoalition("Rutte I", [
      this.partyListManager.parties[8], // VVD
      this.partyListManager.parties[9], // CDA
      this.partyListManager.parties[13], // PVV
    ]);

    this.partyListManager.addCoalition("Schoof cabinet", [
      this.partyListManager.parties[7], // NSC
      this.partyListManager.parties[8], // VVD
      this.partyListManager.parties[10], // BBB
      this.partyListManager.parties[13], // PVV
    ]);

    this.parliamentChartManager = new ParliamentChartManager(
      7, // rowCount
      150, // totalSeats
      100, // innerRadius
      200, // outerRadius
      [250, 50], // centerPosition
      this.partyListManager.parties // parties
    );
  }
}
const site: Site = new Site();