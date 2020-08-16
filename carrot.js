class Carrot {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.diameter = 10;
  }

  show() {
    push();
    fill(240, 100, 10);
    noStroke();
    circle(this.pos.x, this.pos.y, this.diameter);
    pop();
  }
}