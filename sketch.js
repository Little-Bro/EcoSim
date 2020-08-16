let bunnies = [];
let carrots = [];
let puddles = [];
let debugInfo;

function setup() {
  createCanvas(700, 700);
  debugInfo = createDiv('').size(100, 100);

  for (let i = 0; i < 10; i++) {
    carrots[i] = new Carrot();
  }
  for (let i = 0; i < 5; i++) {
    bunnies[i] = new Bunny();
  }
  puddle1 = new Puddle(300, 200);
  puddles.push(puddle1);
}

function draw() {
  // console.log(floor(frameRate()));
  background(40, 195, 50);
  for (carrot of carrots) {
    carrot.show();
  }

  for (puddle of puddles) {
    puddle.show();
  }

  for (bunny of bunnies) {
    if (bunny.selected) {
      debugInfo.html('name : ' + bunny.name + ' state : ' + bunny.state + ' sex : ' + bunny.sex);
    }
    bunny.show();
    bunny.update(carrots);
  }
}