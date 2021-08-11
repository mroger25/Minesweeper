import { CanvasActuator } from "./CanvasActuator.js";
import { Cell } from "./Cell.js";

class GameManager {
  constructor(scl, beesTotal) {
    this.myCanvas = new CanvasActuator(600, 600);
    this.cols = Math.floor(this.myCanvas.canvas.width / scl);
    this.rows = Math.floor(this.myCanvas.canvas.height / scl);
    this.scl = scl;
    this.beesTotal = beesTotal;
    this.cellsTotal = this.cols * this.rows;
    this.setup();
  }

  setup() {
    const t = this;
    t.buildGrid();
    t.positioningBees();
    t.countingBees();
    t.myCanvas.on("draw", t.draw.bind(t));
    t.myCanvas.on("click", t.mousePressed.bind(t));
  }

  buildGrid() {
    const t = this;
    t.grid = t.Grid(t.cols, t.rows);
    for (let i = 0; i < t.cols; i++) {
      for (let j = 0; j < t.rows; j++) {
        t.grid[i][j] = new Cell(i, j, t.scl);
      }
    }
  }

  positioningBees() {
    const t = this;
    for (let i = 0; i < t.cols; i++) {
      if (!t.beesTotal) {
        break;
      }
      for (let j = 0; j < t.rows; j++) {
        if (t.beesTotal / t.cellsTotal > Math.random()) {
          t.grid[i][j].bee = true;
          t.beesTotal--;
        }
        t.cellsTotal--;
      }
    }
  }

  countingBees() {
    const t = this;
    for (let i = 0; i < t.cols; i++) {
      for (let j = 0; j < t.rows; j++) {
        t.grid[i][j].countBees(t.grid);
      }
    }
  }

  Grid(cols, rows) {
    const arr = new Array(cols);
    for (let i = 0; i < cols; i++) {
      arr[i] = new Array(rows);
    }
    return arr;
  }

  gameOver() {
    const t = this;
    for (let i = 0; i < t.cols; i++) {
      for (let j = 0; j < t.rows; j++) {
        t.grid[i][j].revealed = true;
      }
    }
  }

  mousePressed({ x, y }) {
    const t = this;
    const i = Math.floor(x / t.scl);
    const j = Math.floor(y / t.scl);
    if (t.grid[i][j].reveal(t.grid)) {
      t.gameOver();
      console.log("GAME OVER");
    }
  }

  draw() {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.grid[i][j].show(this.myCanvas);
      }
    }
  }
}

const game = new GameManager(20, 100);
