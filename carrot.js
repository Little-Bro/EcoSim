class Carrot {
  constructor() {
    this.pos = createVector(random(20, width - 20), random(20, height - 20));
    this.diameter = 10;
    this.taken = false;
  }

  show() {
    push();
    fill(240, 100, 10);
    noStroke();
    ellipse(this.pos.x, this.pos.y, 10, this.diameter);
    pop();
  }
}