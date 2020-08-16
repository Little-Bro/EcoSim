class Bunny {
  constructor() {
    // individuality
    this.sex = random() > 0.5 ? 'male' : 'female';
    if (this.sex == 'female') {
      this.colour = 255; // all females have white fur
      this.names = ['Louise', 'Beatrice', 'Diane', 'Jane', 'Helen', 'Emma'];
    } else {
      this.colour = map(random(), 0, 1, 80, 150); // males have a greyish fur
      this.names = ['Roger', 'Michael', 'Robert', 'Eugene', 'Louis', 'Arthur'];
    }
    this.name = this.names[Math.floor(Math.random() * this.names.length)];

    // physics
    this.pos = createVector(random(width), random(height));
    this.vel = createVector();
    this.acc = createVector();

    // qualities
    this.state = 'roaming';
    this.faceDiameter = 40;
    this.sightDiameter = 150;
    this.hunger = 100;
    this.selected = false;

  }

  show() {
    push();

    fill(this.colour);
    // big bunny ears
    ellipse(this.pos.x - 7, this.pos.y - 25, 10, 30);
    ellipse(this.pos.x + 7, this.pos.y - 25, 10, 30);

    // face shape
    ellipse(this.pos.x, this.pos.y, this.faceDiameter);

    // big bunny teeth
    ellipse(this.pos.x - 2, this.pos.y + 4, 4, 5);
    ellipse(this.pos.x + 2, this.pos.y + 4, 4, 5);

    // eyes
    fill(0);
    ellipse(this.pos.x - 5, this.pos.y - 5, 5);
    ellipse(this.pos.x + 5, this.pos.y - 5, 5);
    fill(255);

    // mouth
    strokeWeight(2);
    line(this.pos.x - 10, this.pos.y + 2, this.pos.x + 10, this.pos.y + 2);
    strokeWeight(1);

    // sight circle
    noFill();
    if (this.selected)
      stroke(255, 0, 0);
    else
      stroke(0);
    circle(this.pos.x, this.pos.y, this.sightDiameter);
    fill(255);

    // text(this.hunger, this.pos.x, this.pos.y - 50);

    pop();
  }

  update(carrots) {

    this.hunger -= 0.1;
    this.hunger = constrain(this.hunger, 0, 100);

    if (this.hunger < 50) {
      this.state = 'hungry';
    } else {
      this.state = 'roaming';
    }

    // physics
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.vel.limit(2);

    // random walk
    let randomForce = p5.Vector.random2D();
    randomForce.mult(0.5);
    this.applyForce(randomForce);

    // collision with edges
    if (this.pos.x - this.faceDiameter / 2 < 0 || this.pos.x + this.faceDiameter / 2 > width)
      this.vel.x *= -1;
    if (this.pos.y - this.faceDiameter / 2 < 0 || this.pos.y + this.faceDiameter / 2 > height)
      this.vel.y *= -1;

    // detect closest carrot
    let closest = null;
    let record = Infinity;
    for (let i = 0; i < carrots.length; i++) {
      let d = dist(this.pos.x, this.pos.y, carrots[i].pos.x, carrots[i].pos.y);
      if (d < record) {
        record = d;
        closest = carrots[i];
      }
    }

    // moving towards closest carrot if it is detected and if bunny is hungry
    if (closest && this.state == 'hungry') {
      let index = carrots.indexOf(closest);
      let d = dist(this.pos.x, this.pos.y, closest.pos.x, closest.pos.y);
      if (d < closest.diameter / 2 + this.sightDiameter / 2) {
        // line(this.pos.x, this.pos.y, closest.pos.x, closest.pos.y);
        this.moveTowards(closest.pos);
        if (d < 1) {
          carrots.splice(index, 1);
          this.hunger = 100;
          setTimeout(() => {
            carrots.push(new Carrot());
          }, 3000); // another carrot spawns three seconds later
        }
      }
    }

    // debug
    let mouseDist = dist(this.pos.x, this.pos.y, mouseX, mouseY);
    if (mouseDist < this.sightDiameter / 2) {
      text(this.state, this.pos.x - 20, this.pos.y - 50);
      if (mouseIsPressed)
        this.selected = true;
    }
  }

  applyForce(force) {
    this.acc.add(force);
  }

  moveTowards(targetPos) {
    let force = p5.Vector.sub(targetPos, this.pos);
    let distance = force.mag();
    force.normalize();
    force.mult(0.5);
    this.applyForce(force);
  }
}