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

  moveNotes(speed) {
    this.noteGroup.forEach((eachNote) => {
      eachNote.move(speed);
    });
  }

  killOutOfRangeNotes() {
    if (this.noteGroup.length == 0) {
      return;
    }
    let lastNote = this.noteGroup[0];
    if (lastNote.y >= this.line.clientHeight + 50) {
      lastNote.kill();
      this.noteGroup.shift();
      return "killed";
    }
  }

  judgeLine(nowTiming) {
    if (this.noteGroup.length == 0) {
      return;
    }
    let lastNote = this.noteGroup[0];
    let result = lastNote.judgeNote(nowTiming);
    if (result != undefined) {
      this.noteGroup.shift();
    }
    return result;
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
}
