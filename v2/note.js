// Tasks:
// 1.create note in target line => constructor()
// 2.delete the note => kill()
// 3.move the note => move()
// 4.judgement of single note => judgeNote()

class Note {
  PERFECT = 100;
  GOOD = 200;

  constructor(line, timing) {
    //initialize variables
    this.line = document.getElementById(line);
    this.y = 0;
    this.targetTiming = timing;
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

  getStatus(timing) {
    if (Math.abs(timing - this.targetTiming) < this.PERFECT) return "PERFECT";
    if (Math.abs(timing - this.targetTiming) < this.GOOD) return "GOOD";
    if (timing - this.targetTiming > this.GOOD) return "MISS";
    return "UNREACHED";
  }

  getType(){
    return "note"
  }
}
