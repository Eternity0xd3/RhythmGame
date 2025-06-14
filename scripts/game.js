// Tasks:
// 1.The main loop of the game
// 2.create note in different strategy
class Game {
  constructor() {
    // instancing objects & get elements
    this.line0 = new Line("line0");
    this.line1 = new Line("line1");
    this.line2 = new Line("line2");
    this.line3 = new Line("line3");
    this.lines = [this.line0, this.line1, this.line2, this.line3];
    this.bgLayer = document.getElementById("bg_layer");
    this.gameDiv = document.getElementById("game");
    this.menu = document.getElementById("menu");
    this.pauseDiv = document.getElementById("pause");
    this.start_button = document.getElementById("start-btn");
    this.settings_button = document.getElementById("settings-btn");
    this.settingsDiv = document.getElementById("settings");
    this.speedInput = document.getElementById("speed");
    this.bpmInput = document.getElementById("bpm");
    this.beatInput = document.getElementById("beat");
    this.chartInput = document.getElementById("chart");
    this.save_button = document.getElementById("save-btn");
    this.continue_button = document.getElementById("continue-btn");
    this.restart_button = document.getElementById("restart-btn");
    this.quit_button = document.getElementById("quit-btn");
    this.outputDivCombo = document.getElementById("output-combo");
    this.outputDivAcc = document.getElementById("output-acc");
    this.outputDivJudge = document.getElementById("output-judge");
    this.events();

    // init settings
    this.speed = 18;
    this.bpm = 200;
    this.beat = 8;
    this.chartNumber = 3;
    this.timePerBeat = (1000 * 60) / this.bpm / (this.beat / 4);

    // init
    this.gameState = "menu"; // enum: menu/settings/running/pause
    this.maxNotes = 20;
    this.fps = 60;
    this.timer = 0;
    this.fallingTime = this.arrivingTiming();
    this.keyStates = [false, false, false, false];
    this.previousKeyStates = [false, false, false, false];
    this.lastHoldComboTime = -1000;
    this.generator = "random";
    this.song = null;

    //output
    this.lastJudgement = "";
    this.combo = 0;
    this.score = 0;
    this.noteCount = 0;

    //initial display state
    this.gameDiv.style.display = "none";
    this.pauseDiv.style.display = "none";
    this.settingsDiv.style.display = "none";
  }

  loop(speed, fps) {
    let deltaTime = 1000 / fps;
    this.mainloop = setInterval(
      function () {
        if (this.gameState != "running") {
          clearInterval(this.mainloop);
        }
        if (this.song && this.timer >= 0 && this.gameState == "running") {
          this.song.play();
        }
        this.runChart();
        this.linesMove(speed);
        this.output();
        this.keyEvents();
        this.lineJudgeContinuous();
      }.bind(this),
      deltaTime
    );

    //fix: create a new interval for timer for accuracy
    this.timerLoop = setInterval(
      function () {
        if (this.gameState != "running") {
          clearInterval(this.timerLoop);
        }
        this.timer += 15;
      }.bind(this),
      15
    );
  }

  events() {
    //keyboard events
    let flags = [false, false, false, false];
    window.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "d":
          this.keyStates[0] = true;
          break;
        case "f":
          this.keyStates[1] = true;
          break;
        case "j":
          this.keyStates[2] = true;
          break;
        case "k":
          this.keyStates[3] = true;
          break;
      }
    });
    window.addEventListener("keyup", (event) => {
      switch (event.key) {
        case "d":
          this.keyStates[0] = false;
          break;
        case "f":
          this.keyStates[1] = false;
          break;
        case "j":
          this.keyStates[2] = false;
          break;
        case "k":
          this.keyStates[3] = false;
          break;
        case "Escape":
          if (this.gameState == "running") {
            this.pause();
          } else if (this.gameState == "pause") {
            this.continue();
          }
          break;
        case " ":
          if (this.gameState == "menu") {
            this.startGame();
          }
          break;
        case "`":
          if (this.gameState == "running") {
            this.restart();
          } else if (this.gameState == "pause") {
            this.continue();
            this.restart();
          }
      }
    });

    //button events
    this.start_button.onclick = function () {
      this.startGame();
    }.bind(this);
    this.continue_button.onclick = function () {
      this.continue();
    }.bind(this);
    this.restart_button.onclick = function () {
      this.continue();
      this.restart();
    }.bind(this);
    this.quit_button.onclick = function () {
      document.location.reload();
    }.bind(this);
    this.settings_button.onclick = function () {
      this.showSettings();
    }.bind(this);
    this.save_button.onclick = function () {
      this.saveSettings();
    }.bind(this);
  }

  keyEvents() {
    if (this.keyStates[0] && !this.previousKeyStates[0]) {
      this.lineJudgeTrigger(this.line0);
      this.line0.line.style.backgroundImage =
        "url(../static/img/keylight-2.png)";
    }
    if (!this.keyStates[0]) {
      this.line0.line.style.backgroundImage = "none";
    }
    if (this.keyStates[1] && !this.previousKeyStates[1]) {
      this.lineJudgeTrigger(this.line1);
      this.line1.line.style.backgroundImage =
        "url(../static/img/keylight-2.png)";
    }
    if (!this.keyStates[1]) {
      this.line1.line.style.backgroundImage = "none";
    }
    if (this.keyStates[2] && !this.previousKeyStates[2]) {
      this.lineJudgeTrigger(this.line2);
      this.line2.line.style.backgroundImage =
        "url(../static/img/keylight-2.png)";
    }
    if (!this.keyStates[2]) {
      this.line2.line.style.backgroundImage = "none";
    }
    if (this.keyStates[3] && !this.previousKeyStates[3]) {
      this.lineJudgeTrigger(this.line3);
      this.line3.line.style.backgroundImage =
        "url(../static/img/keylight-2.png)";
    }
    if (!this.keyStates[3]) {
      this.line3.line.style.backgroundImage = "none";
    }
    this.previousKeyStates = [...this.keyStates];
  }

  startGame() {
    switch (this.chartNumber) {
      case 1:
        this.generator = "random";
        break;
      case 2:
        this.generator = "randomHold";
        break;
      case 3:
        this.generator = "fixed";
        this.readMeta("../tracks/Armageddom");
        break;
      default:
        this.generator = "random";
    }

    this.gameState = "running";
    this.menu.style.display = "none";
    this.gameDiv.style.display = "block";
    this.bgLayer.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
    this.chart = new Chart(this.bpm, this.beat, this.maxNotes);
    this.generateChart(this.timer);
    this.timer = -1000;
    this.fallingTime = this.arrivingTiming();
    this.loop(this.speed, this.fps);
  }

  showSettings() {
    this.gameState = "settings";
    this.menu.style.display = "none";
    this.settingsDiv.style.display = "block";
    this.speedInput.value = this.speed;
    this.bpmInput.value = this.bpm;
    this.beatInput.value = this.beat;
    this.chartInput.value = this.chartNumber;
  }

  saveSettings() {
    this.gameState = "menu";
    this.menu.style.display = "block";
    this.settingsDiv.style.display = "none";
    this.speed = Number(this.speedInput.value);
    this.bpm = Number(this.bpmInput.value);
    this.beat = Number(this.beatInput.value);
    this.chartNumber = Number(this.chartInput.value);
    console.log([this.speed, this.bpm, this.beat]);
  }

  readMeta(path) {
    fetch(path + "/meta.json")
      .then((response) => response.json())
      .then((json) => (this.song = new Audio(path + "/" + json.song)));
  }

  pause() {
    if (this.gameState != "running") {
      return;
    }
    if (this.song) {
      this.song.pause();
    }
    this.gameState = "pause";
    this.pauseDiv.style.display = "block";
  }

  continue() {
    if (this.song) {
      this.song.play();
    }
    this.gameState = "running";
    this.pauseDiv.style.display = "none";
    this.loop(this.speed, this.fps);
  }

  restart() {
    clearInterval(this.mainloop);
    clearInterval(this.timerLoop);
    if (this.song) {
      this.song.pause();
    }
    this.lines.forEach((element) => {
      element.restartLine();
    });
    this.lastJudgement = "";
    this.combo = 0;
    this.score = 0;
    this.noteCount = 0;
    this.timer = 0;
    this.chart.restart();
    this.startGame();
  }

  linesMove(speed) {
    this.lines.forEach((eachLine) => {
      eachLine.moveNotes(speed);
      if (eachLine.getNextNoteType() == "note") {
        // kill notes that didn't pressed
        let result = eachLine.judgeLineNote(this.timer);
        if (result == "MISS") {
          this.combo = 0;
          this.noteCount += 1;
          this.lastJudgement = "miss";
          eachLine.killLastestNote();
        }
      } else if (eachLine.getNextNoteType() == "hold") {
        // kill the holds that finished
        let result = eachLine.getLastHoldState(this.timer);
        if (result == "FINISH") {
          eachLine.killLastestNote();
          eachLine.cancelHoldHitBox();
        }
        let holdTopResult = eachLine.getLastHoldTopState(this.timer);
        if (
          holdTopResult == "HOLD_TOP_MISS" &&
          eachLine.getLastHoldState() == "UNREACHED"
        ) {
          this.combo = 0;
          this.noteCount += 1;
          this.lastJudgement = "miss";
          eachLine.getLastNote().release();
          eachLine.cancelHoldHitBox();
        }
      }
    });
  }

  lineJudgeContinuous() {
    let lineID = 0;
    this.lines.forEach((eachLine) => {
      if (
        eachLine.getNextNoteType() == "hold" &&
        eachLine.getLastHoldState() == "HOLDING"
      ) {
        if (!this.keyStates[lineID]) {
          eachLine.getLastNote().release();
          this.combo = 0;
          this.noteCount += 1;
          this.lastJudgement = "miss";
          eachLine.cancelHoldHitBox();
        }
      }
      if (eachLine.getLastHoldState() == "HOLDING") {
        if (this.timer - this.lastHoldComboTime > this.timePerBeat) {
          this.score += 100;
          this.noteCount += 1;
          this.combo += 1;
          this.lastJudgement = "PERFECT";
          this.lastHoldComboTime = this.timer;
        }
      }
      lineID += 1;
    });
  }

  lineJudgeTrigger(line) {
    if (line.getNextNoteType() == "note") {
      let result = line.judgeLineNote(this.timer);
      if (result != undefined && result != "MISS" && result != "UNREACHED") {
        this.combo += 1;
        this.noteCount += 1;
        if (result == "PERFECT") {
          this.score += 100;
          this.lastJudgement = "PERFECT";
        } else if (result == "GOOD") {
          this.score += 50;
          this.lastJudgement = "GOOD";
        }
        line.hitbox();
        line.killLastestNote();
      }
    } else if (line.getNextNoteType() == "hold") {
      if (line.getLastHoldState() == "UNREACHED") {
        let result = line.getLastHoldTopState(this.timer);
        if (result == "HOLD_TOP_PERFECT") {
          this.score += 100;
          this.lastJudgement = "PERFECT";
          this.noteCount += 1;
          this.combo += 1;
          this.lastHoldComboTime = this.timer;
          line.startHoldHitbox();
          line.getLastNote().holding();
        }
      }
    }
  }

  generateChart(timing) {
    switch (this.generator) {
      case "random":
        this.chart.random(timing);
        break;
      case "randomHold":
        this.chart.randomHold(timing);
        break;
      case "fixed":
        this.chart.fixed(timing);
        break;
    }
  }

  runChart() {
    if (this.chart.chartList.length <= 0) return;
    let nextNoteLine = this.chart.chartList[0][0];
    let nextNoteTiming = this.chart.chartList[0][1];
    let nextNoteType = this.chart.chartList[0][2];
    let nextNoteArgument = this.chart.chartList[0][3];
    if (this.isProperTime(nextNoteTiming - this.fallingTime)) {
      switch (nextNoteType) {
        case "note":
          switch (nextNoteLine) {
            case 0:
              this.line0.createNotes(nextNoteTiming);
              break;
            case 1:
              this.line1.createNotes(nextNoteTiming);
              break;
            case 2:
              this.line2.createNotes(nextNoteTiming);
              break;
            case 3:
              this.line3.createNotes(nextNoteTiming);
              break;
          }
          break;
        case "hold":
          switch (nextNoteLine) {
            case 0:
              this.line0.createHolds(nextNoteTiming, nextNoteArgument);
              break;
            case 1:
              this.line1.createHolds(nextNoteTiming, nextNoteArgument);
              break;
            case 2:
              this.line2.createHolds(nextNoteTiming, nextNoteArgument);
              break;
            case 3:
              this.line3.createHolds(nextNoteTiming, nextNoteArgument);
              break;
          }
          break;
      }
      this.chart.chartList.shift();

      let thirdNoteTiming = this.chart.chartList[0][1];
      if (thirdNoteTiming === nextNoteTiming) {
        this.runChart();
      }
    }
    this.examineChart();
  }

  isProperTime(targetTiming) {
    return this.timer >= targetTiming;
  }

  examineChart() {
    if (this.chart.chartList.length < this.chart.maxNotes) {
      let latestTiming =
        this.chart.chartList[this.chart.chartList.length - 1][1];
      let continousTiming = (latestTiming += this.chart.timePerBeat);
      this.generateChart(continousTiming);
    }
  }

  arrivingTiming() {
    let height = this.line0.line.clientHeight;
    let t = (height / this.speed) * (1000 / this.fps);
    return t;
  }

  output() {
    let combo = this.combo >= 3 ? this.combo : "";
    let accuracy = this.noteCount == 0 ? 0 : this.score / this.noteCount;
    accuracy = Math.floor(accuracy * 100) / 100;
    let innerHTML = "acc:" + accuracy + "%; timer:" + this.timer;
    this.outputDivCombo.innerHTML = combo;
    this.outputDivAcc.innerHTML = innerHTML;
    this.outputDivJudge.innerHTML = this.lastJudgement;
  }
}
