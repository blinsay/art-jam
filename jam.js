/*jshint esnext: true */

// applies a function to every pixel in the capture. capture.loadPixels() must
// be called for there to be any pixels in the capture.pixels array.
//
// f is passed the x, y coordinate of the pixel and its r, g, b and a values.
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


// the sketch

var captureSize = 60;
var scaleUp = 10;

var capture;
var walkers = [];

let walkerPixel = (walker) => floor(walker.y) * captureSize + floor(walker.x);

let newWalker = (x, y) => {
    walkers.push(createVector(x, y));
};

function setup() {
  createCanvas(windowWidth, windowHeight);

  background(0);
  noStroke();
  fill(255, 255, 255, 155);

  capture = createCapture(VIDEO, () => {
    background(0);
  });
  capture.size(captureSize, captureSize);

  for (i = 0; i < captureSize; i++) {
    for (j = 0; j < captureSize; j++) {
      newWalker(i, j);
    }
  }
}

function draw() {
  background(0, 0, 0, 128);

  capture.loadPixels();
  let field = mapCapture(capture, (_x, _y, r, _g, _b, _a) => createVector(0, r / 255));

  walkers.forEach((walker) => {
    let v = field[walkerPixel(walker)];
    walker.add(field[walkerPixel(walker)]);
    walker.add(createVector(0, 0.1));
  });

  walkers = walkers.filter((w) => !(w.x < 0 || w.x >= captureSize || w.y < 0 || w.y >= captureSize));

  walkers.forEach((w) => {
    ellipse(w.x * scaleUp, w.y *scaleUp, 1, 1);
  });

  for (x = 0; x < captureSize; x++) {
    newWalker(x, 0);
  }
}
