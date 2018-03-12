/*jshint esnext: true */

var capture;

let pixelVectors = (capture, f) => {
  let vs = [];
  for (y = 0; y < capture.height; y++) {
    for (x = 0; x < capture.width; x++) {
      let i = (x + y * capture.width) * 4;

      let {length, angle} = f(capture.pixels[i+0], capture.pixels[i+1], capture.pixels[i+2], capture.pixels[i+3]);
      vs.push({x, y, angle, length});
    }
  }

  return vs;
};

// vector functions

let boringRed = (r, g, b, a) => {
  return {length: 1, angle: r};
};

let colorMagnitudeAndAlpha = (r, g, b, a) => {
  return {
    angle: (r + g + b) * (a / 255),
    length: (r / 255) * 1000,
  };
};


let rTheta = (r, g, b, a) => {
  return {
    angle: r,
    length: 1,
  };
};

// p5 stuff

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);
  capture.size(50, 50);
}

function draw() {
  background(255, 255, 255, 255);
  stroke(0, 0, 0, 150);
  strokeWeight(1);

  let scale = 15;
  capture.loadPixels();
  pixelVectors(capture, (r, g, b, a) => { return {angle: r, length: 1}; }).forEach((v) => {
    let x1 = v.x * scale + 2;
    let y1 = v.y * scale + 2;
    let x2 = 0.5 * scale * cos((v.angle / 255) * TWO_PI + HALF_PI) + x1;
    let y2 = 0.5 * scale * sin((v.angle / 255) * TWO_PI + HALF_PI) + y1;
    line(x1, y1, x2, y2);
  });
  pixelVectors(capture, (r, g, b, a) => { return {angle: -1 * g, length: 1}; }).forEach((v) => {
    let x1 = v.x * scale + 2;
    let y1 = v.y * scale + 2;
    let x2 = 0.5 * scale * cos((v.angle / 255) * TWO_PI + HALF_PI) + x1;
    let y2 = 0.5 * scale * sin((v.angle / 255) * TWO_PI + HALF_PI) + y1;
    line(x1, y1, x2, y2);
  });
  pixelVectors(capture, (r, g, b, a) => { return {angle: b, length: 1}; }).forEach((v) => {
    let x1 = v.x * scale + 2;
    let y1 = v.y * scale + 2;
    let x2 = 0.5 * scale * cos((v.angle / 255) * TWO_PI + HALF_PI) + x1;
    let y2 = 0.5 * scale * sin((v.angle / 255) * TWO_PI + HALF_PI) + y1;
    line(x1, y1, x2, y2);
  });
}
