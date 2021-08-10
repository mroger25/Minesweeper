export class CanvasActuator {
  constructor(id, w, h, color) {
    this.id = document.createElement("canvas");
    this.id.setAttribute("id", id);
    document.body.appendChild(this.id);
    this.ctx = this.id.getContext("2d");
    this.events = {};
    this.setup(w, h, color);
  }

  setup(w, h, color) {
    this.width = w;
    this.height = h;
    this.id.width = w;
    this.id.height = h;
    this.id.style.background = color;
  }

  rect(x, y, w, h, color, stroke) {
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = stroke;
    this.ctx.beginPath();
    this.ctx.rect(x, y, w, h);
    this.ctx.stroke();
  }

  arc(x, y, r, stroke) {
    this.ctx.strokeStyle = stroke;
    this.ctx.beginPath();
    this.ctx.arc(x, y, r / 2, 0, 2 * Math.PI);
    this.ctx.stroke();
  }

  render(e, t) {
    if (!this.events[e]) {
      this.events[e] = t;
    }
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.events[e]();
    requestAnimationFrame(() => {
      this.render(e, t);
    });
  }
}
