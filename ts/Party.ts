class Party {
  id: number;
  
  title: string;
  subtitle: string;
  share: number;
  seats: number;

  solidColor: string;
  backgroundColor: string;

  html = {
    partyElement: null,
    titleElement: null,
    subtitleElement: null,
    sliderElement: null,
    shareElement: null,
    seatsElement: null,
  };

  constructor (id: number, title: string, subtitle: string, share: number, solidColor: string) {

    this.id = id;
    this.title = title;
    this.subtitle = subtitle;
    this.share = share;
    this.seats = 0;

    this.solidColor = solidColor;

    this.html.partyElement = document.getElementById(`party-${id}`);
    this.html.titleElement = document.getElementById(`party-${id}-title`);
    this.html.subtitleElement = document.getElementById(`party-${id}-subtitle`);
    this.html.sliderElement = <HTMLInputElement>document.getElementById(`party-${id}-slider`);
    this.html.shareElement = <HTMLInputElement>document.getElementById(`party-${id}-share`);
    this.html.seatsElement = document.getElementById(`party-${id}-seats`);

    this.html.sliderElement.addEventListener('input', (e) => {
      this.changePartyShare(parseFloat(this.html.sliderElement.value));
    });

    this.html.shareElement.addEventListener('change', (e) => {
      this.changePartyShare(parseFloat(this.html.shareElement.value));
    });

    this.changePartyShare(share);
  }

  changePartyShare(percent: number) {

    if (isNaN(percent) || percent < 0) {
      this.share = 0;
    }
    else if (percent > 100) {
      this.share = 100;
    }
    else {
      this.share = Math.round(percent * 100) / 100;
    }
    this.html.sliderElement.value = this.share.toString();
    this.html.shareElement.value = this.share.toString();
  }
}