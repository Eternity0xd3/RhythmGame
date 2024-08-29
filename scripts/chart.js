// Tasks:
// 1.generate chart
class Chart {
  constructor(bpm, noteBeat, maxNotes) {
    this.bpm = bpm;
    this.noteBeat = noteBeat;
    this.maxNotes = maxNotes;
    this.chartList = [];
    this.chartState = false;
    //time gap of each beat
    this.timePerBeat = (1000 * 60) / bpm / (noteBeat / 4);
  }

  random(nowTiming) {
    let len = this.chartList.length;
    for (var i = 0; i < this.maxNotes - len; i++) {
      this.chartList.push([
        Math.floor(Math.random() * 4),
        nowTiming + this.timePerBeat * i,
      ]);
    }
    this.chartState = true;
  }
}
