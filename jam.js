/*jshint esnext: true */

let mapCapture = (capture, f) => {
  let results = [];
  for (y = 0; y < capture.height; y++) {
    for (x = 0; x < capture.width; x++) {
      let i = (x + y * capture.width) * 4;

      results.push(
        f(x, y, capture.pixels[i+0], capture.pixels[i+1], capture.pixels[i+2], capture.pixels[i+3])
      );
    }
  }

  return results;
};

// pixel -> vector functions


let projectRG = (_x, _y, r, g, b, a) => {
  return createVector((r - 127)/ 127, (g - 127) / 127);
};

let redAngle = (x, y, r, g, b, a) => {
  return p5.Vector.fromAngle((r - 127)/ 127 * TWO_PI);
};

// the sketch

var captureSize = 60;
var scaleUp = 10;

var capture;
var walkers = [];

let walkerPixel = (walker) => floor(walker.x) * captureSize + floor(walker.y);

let newWalker = (x, y) => {
    walkers.push(createVector(x, y));
};

let randomWalker = () => {
  let x = floor(random() * captureSize);
  let y = floor(random() * captureSize);
  newWalker(x, y);
};

let minWalkers = 2000;

function setup() {
  createCanvas(windowWidth, windowHeight);

  background(0);
  noStroke();
  fill(255, 255, 255, 155);

  capture = createCapture(VIDEO, () => {
    background(0);
  });
  capture.size(captureSize, captureSize);

  for (x = 0; x < captureSize; x++) {
    newWalker(x, 0);
  }
}

function draw() {
  background(0, 0, 0, 20);

  capture.loadPixels();
  let field = mapCapture(capture, redAngle);

  walkers.forEach((walker) => {
    let v = field[walkerPixel(walker)];
    walker.add(field[walkerPixel(walker)]);
  });

  walkers = walkers.filter((w) => !(w.x < 0 || w.x >= captureSize || w.y < 0 || w.y >= captureSize));

  walkers.forEach((w) => {
    ellipse(w.x * scaleUp, w.y *scaleUp, 1, 1);
  });

  for (x = 0; x < captureSize; x++) {
    randomWalker();
  }
}
