class Hold {
  constructor(line, timing, lastTime) {
    //initialize variables
    this.line = document.getElementById(line);
    this.y = 0;
    this.timing = timing;
    this.lastTime = lastTime;
    //Add a hold div to line
    this.hold = document.createElement("div");
    this.hold.className = "hold";
    this.hold.appendChild(this.hold);
    this.hold.style.height = this.lastTime;

    this.holdingState = "unreached";
  }

  kill() {
    this.line.removeChild(this.hold);
  }

  move(speed) {
    this.y += speed;
    this.note.style.bottom = (this.y + 20) + "px";
    if (this.holdingState == "holding") {
      this.hold.style.height -= speed;
    }
  }

  judgeHoldTop(getTiming) {
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
    }
    if (result != undefined) {
      // this.kill();
      this.holdingState = "holding"
    }
    return result;
  }

  update(getTiming){
    if(getTiming >= this.timing + this.lastTime){
      if(this.holdingState == "holding"){
        this.kill();
        return "perfect";
      }else{
        this.kill();
        return "miss";
      }
    }
    return null;
  }

  miss(){
    this.state = "miss";
    this.hold.style.color = rgba(255, 247, 103, 0.3);
  }
}
