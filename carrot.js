class Carrot {
  constructor() {
    this.pos = createVector(random(width), random(height));
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