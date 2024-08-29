// Tasks:
// 1.create note in target line => constructor()
// 2.delete the note => kill()
// 3.move the note => move()
// 4.judgement of single note => judgeNote()

class Note {
  constructor(line, timing) {
    //initialize variables
    this.line = document.getElementById(line);
    this.y = 0;
    this.timing = timing;
    //Add a note div to line
    this.note = document.createElement("div");
    this.note.className = "note";
    this.line.appendChild(this.note);
  }

  kill() {
    this.line.removeChild(this.note);
  }

  move(speed) {
    this.y += speed;
    this.note.style.top = this.y + "px";
  }

  judgeNote(getTiming) {
    const PERFECT_TIMING = 50;
    const GOOD_TIMING = 100;
    const BAD_TIMING = 200;
    let gapOfTiming = Math.abs(this.timing - getTiming);
    let result;
    if (gapOfTiming <= PERFECT_TIMING) {
      //perfect judgment
      result = "perfect";
    } else if (gapOfTiming <= GOOD_TIMING) {
      //good judgment
      result = "good";
    } else if (gapOfTiming <= BAD_TIMING) {
      //press too early
      result = "miss";
    }
    if (result != undefined) {
      this.kill();
    }
    return result;
  }
}
