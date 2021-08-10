export class CanvasActuator {
  constructor(w, h) {
    this.canvas = document.createElement("canvas");
    this.events = {};
    this.start(w, h);
  }

  start(w, h) {
    this.canvas.width = w;
    this.canvas.height = h;
    this.ctx = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.render();
    this.click();
  }

  emit(e, t) {
    const i = this.events[e];
    if (i) {
      i.forEach((e) => {
        e(t);
      });
    }
  }

  on(e, t) {
    if (this.events[e]) {
      this.events[e].push(t);
    } else {
      this.events[e] = [];
      this.events[e].push(t);
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.w, this.canvas.h);
  }

  fillRect(x, y, w, h, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, w, h);
  }

  rect(x, y, w, h) {
    this.ctx.beginPath();
    this.ctx.rect(x, y, w, h);
    this.ctx.stroke();
  }

  arc(x, y, d) {
    this.ctx.arc(x, y, d / 2, 0, 2 * Math.PI);
  }

  click() {
    this.canvas.addEventListener("click", (e) => {
      const n = { x: e.layerX, y: e.layerY };
      this.emit("click", n);
    });
  }

  render() {
    this.clear();
    this.emit("draw");
    requestAnimationFrame(() => {
      this.render();
    });
  }
}
