class Hold {
  PERFECT = 150;
  RELEASE = 50;

  constructor(line, timing, lastTime) {
    //initialize variables
    this.line = document.getElementById(line);
    this.y = 0;
    this.height = (lastTime / (1000 / 60)) * 13; // 13 here is speed!
    this.targetTiming = timing;
    this.lastTime = lastTime;
    //Add a note div to line
    this.note = document.createElement("div");
    this.note.className = "hold";
    this.line.appendChild(this.note);
    this.note.style.height = this.height + "px";

    // status: UNREACHED, HOLDING, RELEASED, FINISH
    this.status = "UNREACHED";
  }

  holding() {
    this.status = "HOLDING";
  }

  kill() {
    this.line.removeChild(this.note);
  }

  release() {
    this.status = "RELEASED";
    this.note.style.opacity = 0.4;
  }

  move(speed) {
    // adjust height to fix the speed
    this.height = (this.lastTime / (1000 / 60)) * speed;

    this.y += speed;
    this.note.style.top = this.y - this.height + "px";
    if (this.y - this.height < 0) {
      this.note.style.top = "0px";
      this.note.style.height =
        this.height - Math.abs(this.y - this.height) + "px";
    }

    if (this.y > this.line.clientHeight && this.status != "RELEASED") {
      if (this.y - this.height < 0) {
        this.note.style.height = this.line.clientHeight + "px";
      } else {
        this.note.style.height =
          this.line.clientHeight - (this.y - this.height) + "px";
      }
    }
  }

  getHoldTopStatus(timing) {
    if (this.status == "RELEASED") return "MISS";
    if (this.status == "HOLDING") return "HOLDING";
    if (Math.abs(timing - this.targetTiming) < this.PERFECT)
      return "HOLD_TOP_PERFECT";
    if (timing - this.targetTiming > this.PERFECT) return "HOLD_TOP_MISS";
    return "UNREACHED";
  }

  getHoldStatus(timing) {
    if (timing > this.targetTiming + this.lastTime - this.RELEASE)
      return "FINISH";
    return this.status;
  }

  getType() {
    return "hold";
  }
}
