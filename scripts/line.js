// Task:
// Run as note group class
// 1.create notes
// 2.store the information of notes
// 3.judge the proper note
// 4.hitbox response
class Line {
  constructor(select, timer) {
    this.line = document.getElementById(select);
    this.noteGroup = [];

    //hitbox
    this.box = this.line.childNodes[1];
    this.imgList = [];
    let path = "../static/img/";
    for (let i = 1; i < 10; i++) {
      let imgpath = path + "hit-" + i + ".png";
      this.imgList.push(imgpath);
    }
    this.animation = null;
  }

  createNotes(targetTiming) {
    let note = new Note(this.line.id, targetTiming);
    this.noteGroup.push(note);
  }

  createHolds(targetTiming, lastTime) {
    let hold = new Hold(this.line.id, targetTiming, lastTime);
    this.noteGroup.push(hold);
  }

  moveNotes(speed) {
    this.noteGroup.forEach((eachNote) => {
      eachNote.move(speed);
    });
  }

  killLastestNote() {
    if (this.noteGroup.length == 0) {
      return;
    }
    let lastNote = this.noteGroup[0];
    lastNote.kill();
    this.noteGroup.shift();
  }

  judgeLineNote(nowTiming) {
    if (this.noteGroup.length == 0) {
      return;
    }
    let lastNote = this.noteGroup[0];
    if (lastNote.getType() == "note") {
      return lastNote.getStatus(nowTiming);
    } else if (lastNote.getType() == "hold") {
      return lastNote.getHoldStatus(nowTiming);
    }
  }

  getLastHoldTopState(nowTiming) {
    if (this.noteGroup.length == 0) {
      return;
    }
    let lastNote = this.noteGroup[0];
    if (lastNote.getType() == "hold") {
      return lastNote.getHoldTopStatus(nowTiming);
    }
  }

  getLastHoldState(nowTiming) {
    if (this.noteGroup.length == 0) {
      return;
    }
    let lastNote = this.noteGroup[0];
    if (lastNote.getType() == "hold") {
      return this.noteGroup[0].getHoldStatus(nowTiming);
    }
  }

  getNextNoteType() {
    if (this.noteGroup.length == 0) {
      return;
    }
    return this.noteGroup[0].getType();
  }

  getLastNote() {
    if (this.noteGroup.length == 0) {
      return;
    }
    return this.noteGroup[0];
  }

  restartLine() {
    this.noteGroup.forEach((element) => {
      element.kill();
    });
    this.noteGroup = [];
  }

  hitbox() {
    let index = 0;
    if (this.animation !== null) {
      clearInterval(this.animation);
    }
    this.box.src = this.imgList[1];
    this.box.style.display = "block";
    this.animation = setInterval(
      function () {
        let currentImg = this.imgList[index];
        this.box.src = currentImg;
        index = (index + 1) % this.imgList.length;
        if (index === 0) {
          this.box.style.display = "none";
          clearInterval(this.animation);
        }
      }.bind(this),
      40
    );
  }

  startHoldHitbox() {
    if (this.animation) {
      clearInterval(this.animation);
    }
    let index = 0;
    this.box.src = this.imgList[1];
    this.box.style.display = "block";
    this.animation = setInterval(
      function () {
        let currentImg = this.imgList[index];
        this.box.src = currentImg;
        index = (index + 1) % this.imgList.length;
      }.bind(this),
      40
    );
  }

  cancelHoldHitBox() {
    if (this.animation) {
      clearInterval(this.animation);
      this.box.style.display = "none";
    }
  }
}
