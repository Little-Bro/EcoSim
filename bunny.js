class Bunny extends Animal {
  constructor(x, y) {
    super(x, y);
    if (this.sex == 'female')
      this.colour = 255;
    else
      this.colour = map(random(), 0, 1, 80, 150); // males have a greyish fur
  }

  show() {
    push();
    if (this.pregnant) {
      fill(255, 0, 0);
    } else {
      fill(this.colour);
    }

    translate(this.pos.x, this.pos.y);
    if (this.scaleFactor > 1)
      this.adult = true;
    if (this.adult)
      this.scaleFactor = 1; // forcing 1st gen to be adults
    scale(this.scaleFactor);

    // big bunny ears
    ellipse(-7, -25, 10, 30);
    ellipse(7, -25, 10, 30);
    push();
    fill(230, 175, 230);
    ellipse(-7, -25, 5, 20);
    ellipse(7, -25, 5, 20);
    pop();

    // face shape
    ellipse(0, 0, this.faceDiameter);

    // big bunny teeth
    fill(255);
    ellipse(-2, 4, 4, 5);
    ellipse(2, 4, 4, 5);

    // eyes
    if (this.state == 'horny')
      fill(250, 4, 230);
    else
      fill(0);
    if (this.state != 'dead') {
      ellipse(-5, -5, 5);
      ellipse(5, -5, 5);
    } else {
      // left eye
      line(-7, -7, -3, -3);
      line(-3, -7, -7, -3);
      // right eye
      line(7, -7, 3, -3);
      line(3, -7, 7, -3);
    }

    fill(255);

    // mouth
    strokeWeight(2);
    line(-10, 2, 10, 2);
    strokeWeight(1);

    // debug info
    noFill();
    if (this.debug && this.state != 'dead') {
      stroke(0);
      strokeWeight(1);
      circle(0, 0, this.sightDiameter);
      text(this.name, -15, -50);
      text(this.state, -20, 50);
    }
    if (!this.adult)
      this.scaleFactor += 0.001;
    pop();
  }
}