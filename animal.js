class Animal {
  constructor(x, y) {
    // sex, name
    this.sex = random() > 0.5 ? 'male' : 'female';
    if (this.sex == 'female') {
      this.names = ['Louise', 'Beatrice', 'Denise', 'Jeanne', 'Helene', 'Alice', 'Camille', 'Lucie'];
    } else {
      this.names = ['Gerard', 'Denis', 'Roger', 'Edouard', 'Robert', 'Eugene', 'Louis', 'Didier'];
    }
    this.name = this.names[floor(random() * this.names.length)];

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
    this.scaleFactor = 0.3;
    this.gestationPeriod = 0;

    // initial attributes
    this.species = '';
    this.state = 'roaming';
    this.faceDiameter = 40;
    this.sightDiameter = 150;
    this.debug = false;
    this.adult = false;
    this.pregnant = false;
    this.runAwaySpeed = random(0.3, 0.8);
  }

  // this function is executed each frame
  update(puddles) {
    if (this.state != 'dead') {
      this.showDebug()
      this.updateLevels();
      this.determineState();
      this.applyPhysics();
      this.moveAround();
      this.manageThirstyState(puddles);
    }
    if (this.hunger == 200 || this.thirst == 200) {
      this.state = 'dead';
      this.timeAfterDeath += 0.1;
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
    if (this.thirst < 50 && this.hunger < 50) {
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
        if (this.species == 'bunnies') {
          for (let i = 0; i < rng; i++) {
            animals.push(new Bunny(this.pos.x, this.pos.y));
          }
        } else if (this.species == 'foxes') { // foxes have 1 baby at a time
          animals.push(new Fox(this.pos.x, this.pos.y));
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

  detectClosest(array) {
    let closest = null;
    let record = Infinity;
    for (let i = 0; i < array.length; i++) {
      let d = dist(this.pos.x, this.pos.y, array[i].pos.x, array[i].pos.y);
      if (d < record) {
        record = d;
        closest = array[i];
      }
    }
    return closest;
  }

  runAwayFrom(foxes) {
    // detect closest fox
    let closest = this.detectClosest(foxes);
    // does the bunny see the closest fox ?
    if (closest) {
      let index = foxes.indexOf(closest);
      let d = dist(this.pos.x, this.pos.y, closest.pos.x, closest.pos.y);
      let diameter = closest.faceDiameter;
      if (d < diameter / 2 + this.sightDiameter / 2) {
        if (this.debug)
          line(this.pos.x, this.pos.y, closest.pos.x, closest.pos.y);
        // if it does, the bunny runs away from the fox
        let force = p5.Vector.sub(closest.pos, this.pos);
        let distance = force.mag();
        force.normalize();
        force.mult(-this.runAwaySpeed); // bunnies have a random speed between 0.3 and 0.8
        this.applyForce(force);
      }
    }
  }

  applyForce(force) {
    this.acc.add(force);
  }

  manageHornyState(species) {
    if (this.state == 'horny') {
      for (let member of species) {
        let d = dist(this.pos.x, this.pos.y, member.pos.x, member.pos.y);
        if (d < 0.5 * (this.sightDiameter + member.sightDiameter)) {
          let matingConditions = (this.sex != member.sex && member.state == 'horny' && !member.reproducing && !member.pregnant);
          if (matingConditions) {
            this.reproducing = true;
            if (this.debug)
              line(this.pos.x, this.pos.y, member.pos.x, member.pos.y);
            member.vel.mult(0);
            this.moveTowards(member.pos);
            let mom = (this.sex == 'female') ? this : member;
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
  }

  manageHungryState(food) {
    if (this.state == 'hungry') {
      // detect closest food
      let closest = this.detectClosest(food);
      // does the animal see the food ? if so, it moves towards it
      if (closest) {
        let index = food.indexOf(closest);
        let d = dist(this.pos.x, this.pos.y, closest.pos.x, closest.pos.y);
        let diameter = food == carrots ? 20 : closest.faceDiameter;
        if (d < diameter / 2 + this.sightDiameter / 2) {
          if (this.debug)
            line(this.pos.x, this.pos.y, closest.pos.x, closest.pos.y);
          this.moveTowards(closest.pos);
          if (d < 1) {
            food.splice(index, 1);
            this.hunger = 0;
            if (food == carrots) {
              setTimeout(() => {
                let carrot;
                while (carrot == undefined) {
                  carrot = validEntity('carrot');
                }
                carrots.push(carrot);
              }, 3000); // another carrot spawns three seconds later
            } else {
              // bunny dies and vanishes instantly
              closest.timeAfterDeath = 31;
            }
          }
        }
      }
    }
  }

  manageThirstyState(puddles) {
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
  }
  showDebug() {
    // debug info
    noFill();
    if (this.debug && this.state != 'dead') {
      stroke(0);
      strokeWeight(1);
      circle(this.pos.x, this.pos.y, this.sightDiameter);
      text(this.name, this.pos.x - 15, this.pos.y - 50);
      text(this.state, this.pos.x - 20, this.pos.y + 50);
    }
  }
}
