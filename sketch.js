let bunnies = [];
let carrots = [];
let debugInfo;

function setup() {
  createCanvas(600, 600);
  debugInfo = createDiv('').size(100, 100);

  for (let i = 0; i < 10; i++) {
    carrots[i] = new Carrot();
  }
  for (let i = 0; i < 5; i++) {
    bunnies[i] = new Bunny();
  }
}

function draw() {
  // console.log('fps : ' + frameRate());
  background(40, 195, 50);

  for (carrot of carrots) {
    carrot.show();
  }

  for (bunny of bunnies) {
    if (bunny.selected) {
      debugInfo.html('name : ' + bunny.name + ' state : ' + bunny.state + ' sex : ' + bunny.sex);
    }
    bunny.show();
    bunny.update(carrots);
  }
}