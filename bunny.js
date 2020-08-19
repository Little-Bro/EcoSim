class Bunny {
  constructor(x, y) {
    // sex, name
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
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();

    // actions
    this.running = false;
    this.drinking = false;
    this.reproducing = false;

    // needs
    this.hunger = random(25);
    this.thirst = random(25);
    this.lust = random(25);

    // counters
    this.timeAfterDeath = 0;
    this.scaleFactor = 0.01;
    this.gestationPeriod = 0;

    // initial attributes
    this.state = 'roaming';
    this.faceDiameter = 40;
    this.sightDiameter = 150;
    this.debug = false;
    this.adult = false;
    this.pregnant = false;
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

  update(carrots, puddles, bunnies) {
    if (this.state != 'dead') {
      this.updateLevels();
      this.determineState();
      this.applyPhysics();
      this.moveAround();
      this.giveBirth();

      if (this.state == 'horny') {
        for (let bunny of bunnies) {
          let d = dist(this.pos.x, this.pos.y, bunny.pos.x, bunny.pos.y);
          if (d < 0.5 * (this.sightDiameter + bunny.sightDiameter)) {
            let matingConditions = (this.sex != bunny.sex && bunny.state == 'horny' && !bunny.reproducing && !bunny.pregnant);
            if (matingConditions) {
              this.reproducing = true;
              if (this.debug)
                line(this.pos.x, this.pos.y, bunny.pos.x, bunny.pos.y);
              bunny.vel.mult(0);
              this.moveTowards(bunny.pos);
              let mom = (this.sex == 'female') ? this : bunny;
              if (d < 5) {
                this.vel.mult(0);
                setTimeout(() => {
                  this.lust = 0;
                  mom.pregnant = true;
                  this.reproducing = false;
                }, 3000);
              }
            }
          }
        }
      }

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
        // does the bunny see the closest carrot ? If so, it moves towards it
        if (closest) {
          let index = carrots.indexOf(closest);
          let d = dist(this.pos.x, this.pos.y, closest.pos.x, closest.pos.y);
          if (d < closest.diameter / 2 + this.sightDiameter / 2) {
            if (this.debug)
              line(this.pos.x, this.pos.y, closest.pos.x, closest.pos.y);
            this.moveTowards(closest.pos);
            if (d < 1) {
              carrots.splice(index, 1);
              this.hunger = 0;
              setTimeout(() => {
                let carrot;
                while (carrot == undefined) {
                  carrot = validEntity('carrot');
                }
                carrots.push(carrot);
              }, 3000); // another carrot spawns three seconds later
            }
          }
        }
      }

      if (this.state == 'thirsty') {
        for (let puddle of puddles) {
          let d = dist(this.pos.x, this.pos.y, puddle.pos.x, puddle.pos.y);
          if (d < this.sightDiameter * 0.5 + 0.5 * (puddle.radius + (puddle.min + puddle.max) * 0.5)) {
            if (this.debug)
              line(this.pos.x, this.pos.y, puddle.pos.x, puddle.pos.y);

            if (d < this.faceDiameter * 0.5 + 0.5 * (puddle.radius + (puddle.min + puddle.max) * 0.5)) {
              this.vel.mult(0);
              this.drinking = true;
              setTimeout(() => {
                this.thirst = 0;
                this.drinking = false;
              }, 3000);
            } else {
              this.moveTowards(puddle.pos);
            }
          }
        }
      } else if (this.state != 'thirsty') {
        // bouncing off water
        for (let puddle of puddles) {
          let d = dist(this.pos.x, this.pos.y, puddle.pos.x, puddle.pos.y);
          if (d < this.faceDiameter * 0.5 + 0.5 * (puddle.radius + (puddle.min + puddle.max) * 0.5)) {
            let force = p5.Vector.sub(puddle.pos, this.pos);
            this.applyForce(force.normalize().mult(-1));
          }
        }
      }
    } else {
      this.timeAfterDeath += 0.1;
    }

    if (this.hunger == 200 || this.thirst == 200) {
      this.state = 'dead';
    }
  }
  updateLevels() {
    if (!this.drinking && !this.reproducing)
      this.thirst += 0.1;
    this.thirst = constrain(this.thirst, 0, 200);
    if (!this.reproducing)
      this.hunger += 0.1;
    this.hunger = constrain(this.hunger, 0, 200);
    if (this.adult)
      this.lust += 0.1;
    this.lust = constrain(this.lust, 0, 100);
  }
  determineState() {
    if (this.thirst < 50 && this.hunger < 50) { //there it is
      this.state = 'roaming';
      if (this.lust > 50 && !this.pregnant) {
        this.state = 'horny';
      }
    } else {
      let maximum = Math.max(this.hunger, this.thirst);
      if (maximum > 50) {
        if (maximum == this.hunger) {
          this.state = 'hungry';
        } else if (maximum == this.thirst) {
          this.state = 'thirsty';
        }
      }
    }
  }
  giveBirth() {
    if (this.pregnant) {
      this.gestationPeriod += 0.1;
      if (this.gestationPeriod > 50) {
        this.pregnant = false;
        this.gestationPeriod = 0;

        let rng = floor(random(3) + 1); // 1, 2 or 3 babies per bunny
        for (let i = 0; i < rng; i++) {
          bunnies.push(new Bunny(this.pos.x, this.pos.y));
        }
      }
    }
  }
  applyPhysics() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.vel.limit(2);
  }
  moveAround() {
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
    // screen wrap
    if (this.pos.x < 0)
      this.pos.x = width;
    else if (this.pos.x > width)
      this.pos.x = 0;
    if (this.pos.y < 0)
      this.pos.y = height;
    else if (this.pos.y > height)
      this.pos.y = 0;
  }
  moveTowards(targetPos) {
    let force = p5.Vector.sub(targetPos, this.pos);
    let distance = force.mag();
    force.normalize();
    force.mult(0.5);
    this.applyForce(force);
  }
  applyForce(force) {
    this.acc.add(force);
  }
}