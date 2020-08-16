class Puddle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.r = random(40, 50);
    this.radius;
    this.vertices = [];

    // generating vertices
    let i = 0;
    for (let a = 0; a < TWO_PI; a += 0.1) {
      let xoff = cos(a) + 1;
      let yoff = sin(a) + 1;
      let r = map(noise(xoff, yoff), 0, 1, 100, 200);
      this.radius = r;
      let x = r * cos(a);
      let y = r * sin(a);
      this.vertices[i] = createVector(x, y);
      i++;
    }

    // position shape on screen
    let diff = this.pos.sub(this.vertices[0]);
    for (let i = 0; i < this.vertices.length; i++) {
      this.vertices[i].add(diff);
    }
  }
  show() {
    push();
    fill(40, 175, 200);
    noStroke();
    beginShape();
    for (let i = 0; i < this.vertices.length; i++) {
      vertex(this.vertices[i].x, this.vertices[i].y);
    }

    endShape(CLOSE);
    pop();
    // noFill();
    // circle(this.pos.x, this.pos.y, this.radius + 160);
  }
}