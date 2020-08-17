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
    this.running = false;
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
    push();
    fill(230, 175, 230);
    ellipse(this.pos.x - 7, this.pos.y - 25, 5, 20);
    ellipse(this.pos.x + 7, this.pos.y - 25, 5, 20);
    pop();

    // face shape
    ellipse(this.pos.x, this.pos.y, this.faceDiameter);

    // big bunny teeth
    fill(255);
    ellipse(this.pos.x - 2, this.pos.y + 4, 4, 5);
    ellipse(this.pos.x + 2, this.pos.y + 4, 4, 5);

    // eyes
    fill(0);
    if (this.state != 'dead') {
      ellipse(this.pos.x - 5, this.pos.y - 5, 5);
      ellipse(this.pos.x + 5, this.pos.y - 5, 5);
    } else {
      // left eye
      line(this.pos.x - 7, this.pos.y - 7, this.pos.x - 3, this.pos.y - 3);
      line(this.pos.x - 3, this.pos.y - 7, this.pos.x - 7, this.pos.y - 3);
      // right eye
      line(this.pos.x + 7, this.pos.y - 7, this.pos.x + 3, this.pos.y - 3);
      line(this.pos.x + 3, this.pos.y - 7, this.pos.x + 7, this.pos.y - 3);
    }

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

    pop();
  }

  update(carrots) {
    this.hunger -= 0.1;
    this.hunger = constrain(this.hunger, 0, 100);

    if (this.hunger < 50) {
      this.state = 'hungry';
      if (this.hunger == 0) {
        this.state = 'dead';
      }
    } else {
      this.state = 'roaming';
    }
    if (this.state != 'dead') {
      // physics
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0);
      this.vel.limit(2);

      // Lévy Flight
      let rng = random(100);
      if (rng < 0.1) {
        this.running = true;
        let strongForce = p5.Vector.random2D();
        strongForce.mult(10);
        this.applyForce(strongForce);
        setTimeout(() => {
          this.running = false;
        }, 3000);
      }
      // random walk
      if (!this.running) {
        let randomForce = p5.Vector.random2D();
        randomForce.mult(0.5);
        this.applyForce(randomForce);
      }

      // collision with edges
      // if (this.pos.x - this.faceDiameter / 2 < 0 || this.pos.x + this.faceDiameter / 2 > width)
      //   this.vel.x *= -1;
      // if (this.pos.y - this.faceDiameter / 2 < 0 || this.pos.y + this.faceDiameter / 2 > height)
      //   this.vel.y *= -1;
      this.pos.x = constrain(this.pos.x, this.faceDiameter / 2, width - this.faceDiameter / 2);
      this.pos.y = constrain(this.pos.y, this.faceDiameter / 2, height - this.faceDiameter / 2);

      if (this.state == 'hungry') {
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

        if (closest) {
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
      }
    }

    // debug
    let mouseDist = dist(this.pos.x, this.pos.y, mouseX, mouseY);
    if (mouseDist < this.sightDiameter / 2) {
      text(this.state, this.pos.x - 20, this.pos.y - 50);
      text(this.name, this.pos.x - 20, this.pos.y + 50);
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