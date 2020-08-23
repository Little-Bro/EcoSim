class Fox extends Animal {
  constructor(x, y) {
    super(x, y);
    this.adult = false;
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    if (this.scaleFactor > 1)
      this.adult = true;
    if (this.adult)
      this.scaleFactor = 1; // forcing 1st gen to be adults
    scale(this.scaleFactor);

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
    if (this.state == 'horny')
      fill(250, 4, 230);
    else
      fill(0);
    if (this.state != 'dead') {
      circle(-10, -5, 5);
      circle(10, -5, 5);
    } else {
      stroke(1);
      // left eye
      line(-12, -7, -8, -3);
      line(-12, -3, -8, -7);
      // right eye
      line(12, -7, 8, -3);
      line(12, -3, 8, -7);
    }


    //moustache
    stroke(1);
    fill(0);
    let dy = -10;
    for (let i = 0; i < 3; i++) {
      dy += 5;
      line(p3.x, p3.y - 2, p3.x + 10, p3.y + dy);
      line(p3.x, p3.y - 2, p3.x - 10, p3.y + dy);
    }

    // nose
    circle(p3.x, p3.y - 2, 5);

    if (!this.adult)
      this.scaleFactor += 0.001;
    pop();
  }
}