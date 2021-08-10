import { CanvasActuator } from "./CanvasActuator.js";

function Grid(cols, rows) {
  const arr = new Array(cols);
  for (let i = 0; i < cols; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

class Cell {
  constructor(x, y, w, h, color, stroke) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
    this.stroke = stroke;
    if (Math.random() < 0.5) {
      this.bee = true;
    } else {
      this.bee = false;
    }
    this.revealed = false;
  }

  show() {
    const t = this;
    myCanvas.rect(t.x, t.y, t.w, t.h, t.color, t.stroke);
    if (this.revealed) {
      if (this.bee) {
        myCanvas.arc(t.x + t.w / 2, t.y + t.w / 2, t.w / 2, t.stroke);
      }
    }
  }
}

class GameManager {
  constructor(scl) {
    this.cols = Math.floor(myCanvas.width / scl);
    this.rows = Math.floor(myCanvas.height / scl);
    this.scl = scl;
    this.grid = Grid(this.cols, this.rows);
    this.setup();
  }

  setup() {
    const t = this;
    for (let i = 0; i < t.cols; i++) {
      for (let j = 0; j < t.rows; j++) {
        t.grid[i][j] = new Cell(
          i * t.scl,
          j * t.scl,
          t.scl,
          t.scl,
          "white",
          "black"
        );
      }
    }
    myCanvas.render("draw", this.draw.bind(this));
  }

  draw() {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.grid[i][j].show();
      }
    }
  }
}

const myCanvas = new CanvasActuator("myCanvas", 200, 200, "white");
const game = new GameManager(20);
