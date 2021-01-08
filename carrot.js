class Carrot {
  constructor(x, y) {
    this.angle = random(360);
    this.pos = createVector(x, y);
    this.diameter = 20;
  }

  show() {
    push();
    fill(252, 110, 2)
    translate(this.pos.x, this.pos.y);
    angleMode(DEGREES);
    rotate(this.angle);
    triangle(0, 15, -5, -15, 5, -15)
    fill(40, 160, 30)
    triangle(0, -15, -5, -25, 5, -25)
    pop();
  }
}
