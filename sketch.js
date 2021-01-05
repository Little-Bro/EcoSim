let animals = [];
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

  const nBunnies = 15;
  const nFoxes = 3;

  for (let i = 0; i < nBunnies + nFoxes; i++) {
    if (i < nBunnies) {
      let bunny = validEntity('bunny');
      if (bunny) {
        bunny.adult = true;
        bunny.species = 'bunnies';
        // bunny.food = 'carrots';
        animals.push(bunny);
      } else {
        console.log('bunny spawned in water and drowned T-T');
      }
    } else if (i >= nBunnies && i < nFoxes + nBunnies) {
      let fox = validEntity('fox');
      if (fox) {
        fox.adult = true;
        fox.species = 'foxes';
        fox.food = 'bunnies';
        animals.push(fox);
      } else {
        console.log('fox spawned in water and drowned T-T');
      }
    }
  }

  while (carrots.length < 15) {
    let carrot = validEntity('carrot');
    if (carrot != undefined)
      carrots.push(carrot);
  }
}

function draw() {
  background(40, 195, 50);

  bunnyPopulation.html('bunny Population : ' + (animals.filter(animal => animal instanceof Bunny)).length);
  foxPopulation.html('fox Population : ' + (animals.filter(animal => animal instanceof Fox)).length);

  puddles.forEach(puddle => {
    puddle.show();
  })

  carrots.forEach(carrot => {
    carrot.show();
  })

  for (let animal of animals) {
    let species = [];
    let food = [];
    if (animal instanceof Fox) {
      species = animals.filter(animal => animal instanceof Fox);
      food = animals.filter(animal => animal instanceof Bunny);
    } else {
      species = animals.filter(animal => animal instanceof Bunny);
      food = carrots;
    }
    animal.show();
    animal.manageHungryState(food);
    animal.manageHornyState(species);
    animal.update(puddles);
    animal.giveBirth();
    if (animal.timeAfterDeath > 30) {
      let index = animals.indexOf(animal);
      animals.splice(index, 1);
    }
  }
}
