// Tasks:
// 1.The main loop of the game
// 2.create note in different strategy
class Game {
  constructor(line0, line1, line2, line3) {
    // instancing objects & get elements
    this.line0 = new Line(line0);
    this.line1 = new Line(line1);
    this.line2 = new Line(line2);
    this.line3 = new Line(line3);
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
    this.save_button = document.getElementById("save-btn");
    this.continue_button = document.getElementById("continue-btn");
    this.restart_button = document.getElementById("restart-btn");
    this.quit_button = document.getElementById("quit-btn");
    this.outputDivCombo = document.getElementById("output-combo");
    this.outputDivAcc = document.getElementById("output-acc");
    this.outputDivJudge = document.getElementById("output-judge");
    this.events();

    // init settings
    this.speed = 13;
    this.bpm = 200;
    this.beat = 8;

    // init
    this.gameState = "menu"; // enum: menu/settings/running/pause
    this.maxNotes = 20;
    this.fps = 60;
    this.timer = 0;
    this.fallingTime = this.arrivingTiming();
    this.generator = "random";

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
        this.runChart();
        this.linesMove(speed);
        this.output();
        //console.log(this.timer);
        this.timer += deltaTime;
      }.bind(this),
      deltaTime
    );
  }

  events() {
    //keyboard events
    let flags = [false, false, false, false];
    window.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "d":
          if (flags[0]) {
            return;
          }
          flags[0] = true;
          this.lineJudge(this.line0);
          this.line0.line.style.backgroundImage =
            "url(../static/img/keylight-2.png)";
          break;
        case "f":
          if (flags[1]) {
            return;
          }
          flags[1] = true;
          this.lineJudge(this.line1);
          this.line1.line.style.backgroundImage =
            "url(../static/img/keylight-2.png)";
          break;
        case "j":
          if (flags[2]) {
            return;
          }
          flags[2] = true;
          this.lineJudge(this.line2);
          this.line2.line.style.backgroundImage =
            "url(../static/img/keylight-2.png)";
          break;
        case "k":
          if (flags[3]) {
            return;
          }
          flags[3] = true;
          this.lineJudge(this.line3);
          this.line3.line.style.backgroundImage =
            "url(../static/img/keylight-2.png)";
          break;
      }
    });
    window.addEventListener("keyup", (event) => {
      switch (event.key) {
        case "d":
          flags[0] = false;
          this.line0.line.style.backgroundImage = "none";
          break;
        case "f":
          flags[1] = false;
          this.line1.line.style.backgroundImage = "none";
          break;
        case "j":
          flags[2] = false;
          this.line2.line.style.backgroundImage = "none";
          break;
        case "k":
          flags[3] = false;
          this.line3.line.style.backgroundImage = "none";
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

  startGame() {
    this.gameState = "running";
    this.menu.style.display = "none";
    this.gameDiv.style.display = "block";
    this.bgLayer.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
    this.chart = new Chart(this.bpm, this.beat, this.maxNotes);
    this.generateChart(this.timer);
    this.timer = -1000;
    this.loop(this.speed, this.fps);
  }

  showSettings() {
    this.gameState = "settings";
    this.menu.style.display = "none";
    this.settingsDiv.style.display = "block";
    this.speedInput.value = this.speed;
    this.bpmInput.value = this.bpm;
    this.beatInput.value = this.beat;
  }

  saveSettings() {
    this.gameState = "menu";
    this.menu.style.display = "block";
    this.settingsDiv.style.display = "none";
    this.speed = Number(this.speedInput.value);
    this.bpm = Number(this.bpmInput.value);
    this.beat = Number(this.beatInput.value);
    console.log([this.speed, this.bpm, this.beat]);
  }

  pause() {
    if (this.gameState != "running") {
      return;
    }
    this.gameState = "pause";
    this.pauseDiv.style.display = "block";
  }

  continue() {
    this.gameState = "running";
    this.pauseDiv.style.display = "none";
    this.loop(this.speed, this.fps);
  }

  restart() {
    clearInterval(this.mainloop);
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
      let result = eachLine.killOutOfRangeNotes();
      if (result == "killed") {
        this.combo = 0;
        this.noteCount += 1;
        this.lastJudgement = "miss";
      }
    });
  }

  lineJudge(line) {
    let result = line.judgeLine(this.timer);
    if (result == "miss") {
      this.combo = 0;
      this.noteCount += 1;
      this.lastJudgement = "miss";
    } else if (result != undefined && result != "miss") {
      this.combo += 1;
      this.noteCount += 1;
      line.hitbox();
      if (result == "perfect") {
        this.score += 100;
        this.lastJudgement = "perfect";
      } else if (result == "good") {
        this.score += 50;
        this.lastJudgement = "good";
      }
    }
  }

  generateChart(timing) {
    switch (this.generator) {
      case "random":
        this.chart.random(timing);
        break;
    }
  }

  runChart() {
    let nextNoteLine = this.chart.chartList[0][0];
    let nextNoteTiming = this.chart.chartList[0][1];
    if (this.isProperTime(nextNoteTiming)) {
      nextNoteTiming += this.fallingTime;
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
      this.chart.chartList.shift();
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
    let t = height / (this.speed / (1000 / this.fps));
    return t;
  }

  output() {
    let combo = this.combo >= 3 ? this.combo : "";
    let accuracy = this.noteCount == 0 ? 0 : this.score / this.noteCount;
    accuracy = Math.floor(accuracy * 100) / 100;
    let innerHTML = "acc:" + accuracy + "%";
    this.outputDivCombo.innerHTML = combo;
    this.outputDivAcc.innerHTML = innerHTML;
    this.outputDivJudge.innerHTML = this.lastJudgement;
  }
}
