let bunnies = [];
let foxes = [];
let carrots = [];
let puddles = [];
let debugCheckBox;
let p1, p2, p3;
let bunnyPopulation;
let foxPopulation;

function setup() {
  createCanvas(700, 700);
  // html
  debugCheckBox = createCheckbox('Show debug info', false);
  debugCheckBox.changed(clicked);
  debugCheckBox.position(450, 20);
  p1 = createP('female bunnies are white, males are grey-ish');
  p2 = createP('pregnant bunnies turn red');
  p3 = createP('bunnies with pink eyes want to mate');
  p1.position(720, 50);
  p2.position(720, 90);
  p3.position(720, 130);
  bunnyPopulation = createElement('h3');
  bunnyPopulation.position(720, 200);
  foxPopulation = createElement('h3');
  foxPopulation.position(720, 240);

  // generating puddles
  puddle1 = new Puddle(300, 200, 100, 150);
  puddle2 = new Puddle(600, 600, 75, 120);
  puddles.push(puddle1);
  puddles.push(puddle2);

  while (bunnies.length < 15) {
    let bunny = validEntity('bunny');
    if (bunny != undefined) {
      bunnies.push(bunny);
      bunny.adult = true;
    }
  }

  while (foxes.length < 3) {
    let fox = validEntity('fox');
    if (fox != undefined) {
      foxes.push(fox);
      fox.adult = true;
    }
  }

  while (carrots.length < 30) {
    let carrot = validEntity('carrot');
    if (carrot != undefined)
      carrots.push(carrot);
  }
}

function draw() {
  background(40, 195, 50);

  bunnyPopulation.html('bunny Population : ' + bunnies.length);
  foxPopulation.html('fox Population : ' + foxes.length);

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
  for (let fox of foxes) {
    fox.show();
    fox.update(bunnies, puddles, foxes);
    fox.giveBirth(foxes);
    if (fox.timeAfterDeath > 30) {
      let index = foxes.indexOf(fox);
      foxes.splice(index, 1);
    }
  }
}