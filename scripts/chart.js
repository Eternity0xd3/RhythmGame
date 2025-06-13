// Tasks:
// 1.generate chart
// format:[[line,timing,type,other args], [line,timing,type,other args], ...]
// args: hold: last time
//       events: [eventType, args]

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

  restart() {
    this.chartList = [];
    this.chartState = false;
  }

  random(nowTiming) {
    let len = this.chartList.length;
    for (var i = 0; i < this.maxNotes - len; i++) {
      this.chartList.push([
        Math.floor(Math.random() * 4),
        nowTiming + this.timePerBeat * i,
        "note",
        0,
      ]);
    }
    this.chartState = true;
  }

  randomHold(nowTiming) {
    let len = this.chartList.length;
    for (var i = 0; i < this.maxNotes - len; i++) {
      this.chartList.push([
        Math.floor(Math.random() * 4),
        nowTiming + this.timePerBeat * i,
        "hold",
        this.timePerBeat * 0.75,
      ]);
    }
    this.chartState = true;
  }

  fixed(nowTiming) {
    this.maxNotes = 0;
    if (this.chartState) {
      return;
    }

    fetch("../tracks/Armageddom/data.json")
      .then((response) => response.json())
      .then((json) => (this.chartList = json));
    //this.chartList = [[2, 589, 0, 0], [3, 589, "note", 0], [1, 874, "note", 0], [2, 1446, "note", 0], [1, 1589, "note", 0], [2, 1660, "note", 0], [0, 1731, "note", 0], [3, 1731, "note", 0], [1, 2017, "note", 0], [2, 2303, "note", 0], [3, 2589, "note", 0], [0, 2731, "note", 0], [1, 2731, "note", 0], [0, 2874, "note", 0], [3, 2874, "note", 0], [2, 3160, "note", 0], [0, 3303, "note", 0], [1, 3303, "note", 0], [2, 3589, "note", 0], [3, 3589, "note", 0], [0, 3731, "note", 0], [1, 3731, "note", 0], [2, 3803, "note", 0], [0, 3874, "note", 0], [1, 3946, "note", 0], [2, 4017, "note", 0], [3, 4017, "note", 0], [0, 4160, "note", 0], [3, 4160, "note", 0], [1, 4446, "note", 0], [3, 4446, "note", 0], [2, 4731, "note", 0], [3, 4731, "note", 0], [1, 4803, "note", 0], [0, 4874, "note", 0], [3, 4946, "note", 0], [2, 5017, "note", 0], [1, 5089, "note", 0], [0, 5160, "note", 0], [3, 5160, "note", 0], [2, 5446, "note", 0], [3, 5446, "note", 0], [0, 5731, "note", 0], [2, 5874, "note", 0], [1, 6160, "note", 0], [3, 6303, "note", 0], [2, 6589, "note", 0], [0, 6731, "note", 0], [1, 6731, "note", 0], [2, 6803, "note", 0], [2, 7017, "note", 0], [3, 7017, "note", 0], [1, 7089, "note", 0]]
  }
}
