// avoiding things from spawning in puddles
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
    switch (entity) {
      case 'bunny':
        return new Bunny(x, y);
        break;
      case 'carrot':
        return new Carrot(x, y);
        break;
      case 'fox':
        return new Fox(x, y);
        break;
      default:
        return undefined;
    }
  }
}

// user clicks on debug checkbox
function clicked() {
  for (let bunny of bunnies) {
    if (this.checked())
      bunny.debug = true;
    else
      bunny.debug = false;
  }
  for (let fox of foxes) {
    if (this.checked())
      fox.debug = true;
    else
      fox.debug = false;
  }
}