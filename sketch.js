let bunnies = [];
let carrots = [];
let puddles = [];
let debugCheckBox;
let p1, p2, p3;
let population;

function setup() {
  createCanvas(700, 700);
  // html
  debugCheckBox = createCheckbox('Show debug info', false);
  debugCheckBox.changed(clicked);
  debugCheckBox.position(450, 20);
  p1 = createP('female bunnies are white, males are grey-ish');
  p2 = createP('pregnant bunnies turn red');
  p3 = createP('bunnies with pink eyes want to mate');
  population = createElement('h3');
  p1.position(720, 50);
  p2.position(720, 90);
  p3.position(720, 130);
  population.position(720, 200);

  // generating puddles
  puddle1 = new Puddle(300, 200, 100, 150);
  puddle2 = new Puddle(600, 600, 75, 120);
  puddles.push(puddle1);
  puddles.push(puddle2);

  while (bunnies.length < 5) {
    let bunny = validEntity('bunny');
    if (bunny != undefined)
      bunnies.push(bunny);
  }

  // forcing first gen of bunnies to be adults
  for (const bunny of bunnies) {
    bunny.adult = true;
  }

  while (carrots.length < 30) {
    let carrot = validEntity('carrot');
    if (carrot != undefined)
      carrots.push(carrot);
  }
}

function draw() {
  background(40, 195, 50);

  population.html('population : ' + bunnies.length);

  for (let puddle of puddles) {
    puddle.show();
  }
  for (let carrot of carrots) {
    carrot.show();
  }
  for (let bunny of bunnies) {
    bunny.show();
    bunny.update(carrots, puddles, bunnies);
    bunny.giveBirth(bunnies);
    if (bunny.timeAfterDeath > 30) {
      let index = bunnies.indexOf(bunny);
      bunnies.splice(index, 1);
    }
  }
}

// avoid things from spawning in puddles
function validEntity(entity) {
  let x = random(50, width - 50);
  let y = random(50, height - 50);
  let valid = true;

  for (let puddle of puddles) {
    let d = dist(x, y, puddle.pos.x, puddle.pos.y);
    if (d - 20 < 0.5 * (puddle.radius + (puddle.min + puddle.max) * 0.5)) {
      valid = false;
      break;
    }
  }
  if (valid) {
    if (entity == 'bunny') {
      return new Bunny(x, y);
    } else if (entity == 'carrot') {
      return new Carrot(x, y);
    }
  } else {
    return undefined;
  }
}

function clicked() {
  for (let bunny of bunnies) {
    if (this.checked())
      bunny.debug = true;
    else
      bunny.debug = false;
  }
  for (let puddle of puddles) {
    if (this.checked())
      puddle.debug = true;
    else
      puddle.debug = false;
  }
}
