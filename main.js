import { CanvasActuator } from "./CanvasActuator.js";

function Grid(cols, rows) {
  const arr = new Array(cols);
  for (let i = 0; i < cols; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

class Cell {
  constructor(i, j, scl) {
    this.i = i;
    this.j = j;
    this.x = i * scl;
    this.y = j * scl;
    this.scl = scl;
    this.bee = false;
    this.revealed = false;
  }

  show() {
    const t = this;
    if (this.revealed) {
      if (this.bee) {
        myCanvas.ctx.fillStyle = "white";
        myCanvas.ctx.fillRect(t.x, t.y, t.scl, t.scl);
        myCanvas.ctx.beginPath();
        myCanvas.ctx.arc(
          t.x + t.scl / 2,
          t.y + t.scl / 2,
          t.scl / 4,
          0,
          2 * Math.PI
        );
        myCanvas.ctx.fillStyle = "gray";
        myCanvas.ctx.fill();
      } else {
        myCanvas.ctx.fillStyle = "white";
        myCanvas.ctx.fillRect(t.x, t.y, t.scl, t.scl);
        if (this.neighborCount) {
          myCanvas.ctx.textAlign = "center";
          myCanvas.ctx.textBaseline = "middle";
          myCanvas.ctx.fillStyle = "black";
          myCanvas.ctx.font = this.scl / 2 + "px arial";
          myCanvas.ctx.fillText(
            this.neighborCount,
            this.x + this.scl / 2,
            this.y + this.scl / 2
          );
        }
      }
    } else {
      myCanvas.ctx.fillStyle = "gray";
      myCanvas.ctx.fillRect(t.x, t.y, t.scl, t.scl);
    }
    myCanvas.ctx.beginPath();
    myCanvas.ctx.rect(t.x, t.y, t.scl, t.scl);
    myCanvas.ctx.stroke();
  }

  reveal(grid) {
    const t = this;
    if (!t.revealed) {
      t.revealed = true;
      if (t.bee) {
        return true;
      } else {
        if (!t.neighborCount) {
          for (let m = -1; m < 2; m++) {
            const p = grid[t.i + m];
            if (p) {
              for (let n = -1; n < 2; n++) {
                const q = p[t.j + n];
                if (q && !q.revealed) {
                  q.reveal(grid);
                }
              }
            }
          }
        }
      }
    }
    return false;
  }

  countBees(grid) {
    const t = this;
    if (!t.bee) {
      let sum = 0;
      for (let m = -1; m < 2; m++) {
        const p = grid[t.i + m];
        if (p) {
          for (let n = -1; n < 2; n++) {
            const q = p[t.j + n];
            if (q && q.bee) {
              sum++;
            }
          }
        }
      }
      t.neighborCount = sum;
    }
  }
}

class GameManager {
  constructor(scl, beesTotal) {
    this.cols = Math.floor(myCanvas.canvas.width / scl);
    this.rows = Math.floor(myCanvas.canvas.height / scl);
    this.scl = scl;
    this.beesTotal = beesTotal;
    this.cellsTotal = this.cols * this.rows;
    this.grid = Grid(this.cols, this.rows);
    this.setup();
  }

  setup() {
    const t = this;
    for (let i = 0; i < t.cols; i++) {
      for (let j = 0; j < t.rows; j++) {
        t.grid[i][j] = new Cell(i, j, t.scl);
      }
    }
    for (let i = 0; i < t.cols; i++) {
      if (!this.beesTotal) {
        break;
      }
      for (let j = 0; j < t.rows; j++) {
        if (this.beesTotal / this.cellsTotal > Math.random()) {
          t.grid[i][j].bee = true;
          this.beesTotal--;
        }
        this.cellsTotal--;
      }
    }
    for (let i = 0; i < t.cols; i++) {
      for (let j = 0; j < t.rows; j++) {
        t.grid[i][j].countBees(this.grid);
      }
    }
    myCanvas.on("draw", t.draw.bind(t));
    myCanvas.on("click", t.mousePressed.bind(t));
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
    const i = Math.floor(x / this.scl);
    const j = Math.floor(y / this.scl);
    if (this.grid[i][j].reveal(this.grid)) {
      this.gameOver();
      console.log("GAME OVER");
    }
  }

  draw() {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.grid[i][j].show();
      }
    }
  }
}

const myCanvas = new CanvasActuator(600, 600);
const game = new GameManager(20, 100);
