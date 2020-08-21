class Fox extends Animal {
  constructor(x, y) {
    super(x, y);
    this.len = 30;

  }
  show() {
    push();
    translate(this.pos.x, this.pos.y);
    let len = 30;
    // face
    let c = createVector(width / 2, height / 2);
    let p1 = createVector(-len, -len);
    let p2 = createVector(len, -len);
    let p3 = createVector(0, len);

    noStroke();
    fill(250, 85, 0);
    triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);

    // ears
    triangle(-len, -len, -(len - 5), -len - 20, -10, -len);
    triangle(+len, -len, +(len - 5), -len - 20, +10, -len);

    // eyes
    fill(0);
    circle(-10, -5, 5);
    circle(10, -5, 5);

    //moustache
    stroke(1);
    let dy = -10;
    for (let i = 0; i < 3; i++) {
      dy += 5;
      line(p3.x, p3.y - 2, p3.x + 10, p3.y + dy);
      line(p3.x, p3.y - 2, p3.x - 10, p3.y + dy);
    }

    // nose
    circle(p3.x, p3.y - 2, 5);

    // debug info
    noFill();
    if (this.debug && this.state != 'dead') {
      stroke(0);
      strokeWeight(1);
      circle(0, 0, this.sightDiameter);
      text(this.name, -15, -50);
      text(this.state, -20, 50);
    }
    pop();
  }
}