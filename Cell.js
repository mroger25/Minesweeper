export class Cell {
  constructor(i, j, scl) {
    this.i = i;
    this.j = j;
    this.x = i * scl;
    this.y = j * scl;
    this.scl = scl;
    this.bee = false;
    this.revealed = false;
  }

  show(myCanvas) {
    const t = this;
    if (t.revealed) {
      if (t.bee) {
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
        if (t.neighborCount) {
          myCanvas.ctx.textAlign = "center";
          myCanvas.ctx.textBaseline = "middle";
          myCanvas.ctx.fillStyle = "black";
          myCanvas.ctx.font = t.scl / 2 + "px arial";
          myCanvas.ctx.fillText(
            t.neighborCount,
            t.x + t.scl / 2,
            t.y + t.scl / 2
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

  reveal(e) {
    const t = this;
    if (!t.revealed) {
      t.revealed = true;
      if (t.bee) {
        return true;
      } else {
        if (!t.neighborCount) {
          for (let m = -1; m < 2; m++) {
            const p = e[t.i + m];
            if (p) {
              for (let n = -1; n < 2; n++) {
                const q = p[t.j + n];
                if (q && !q.revealed) {
                  q.reveal(e);
                }
              }
            }
          }
        }
      }
    }
    return false;
  }

  countBees(e) {
    const t = this;
    if (!t.bee) {
      let sum = 0;
      for (let m = -1; m < 2; m++) {
        const p = e[t.i + m];
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
