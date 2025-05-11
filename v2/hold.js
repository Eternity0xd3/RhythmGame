class Hold {
  PERFECT = 200;

  constructor(line, timing, lastTime) {
    //initialize variables
    this.line = document.getElementById(line);
    this.y = 0;
    this.targetTiming = timing;
    this.lastTime = lastTime;
    //Add a note div to line
    this.note = document.createElement("div");
    this.note.className = "line";
    this.line.appendChild(this.note);

    // status: UNREACHED, HOLDING, RELEASED, MISS
    this.status = "UNREACHED";
  }

  kill() {
    this.line.removeChild(this.note);
  }

  release() {
    this.status = "RELEASED";
    // TODO: some logic and visual feedback like changing opacity
  }

  move(speed) {
    this.y += speed;
    this.note.style.top = this.y + "px";
  }

  getHoldTopStatus(timing) {
    if (this.status == "RELEASED") return "MISS"
    if (Math.abs(timing - this.targetTiming) < this.GOOD) return "PERFECT";
    if (timing - this.targetTiming > this.GOOD) return "MISS";
    return "UNREACHED";
  }

  getType(){
    return "hold"
  }
}
