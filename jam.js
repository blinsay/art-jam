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

let _red = (x, y, r, g, b, a) => {
  return { x: x, y: y, angle: r / 255, length: 1};
};

let _green = (x, y, r, g, b, a) => {
  return { x: x, y: y, angle: g / 255, length: 1};
};

let _blue = (x, y, r, g, b, a) => {
  return { x: x, y: y, angle: b / 255, length: 1};
};

let scaleVec = (s) => (v) => {
  v.length = s * v.length;
  return v;
};

//intensity function (0.299*r + 0.587*g + 0.114*b)
// drawing functions

let vectorAsLine = (scale, rotate) => (v) => {
  let x1 = v.x * scale + Math.ceil(scale/2);
  let y1 = v.y * scale + Math.ceil(scale/2);
  let x2 = v.length * cos(v.angle * TWO_PI + rotate) + x1;
  let y2 = v.length * sin(v.angle * TWO_PI + rotate) + y1;
  line(x1, y1, x2, y2);
};


// the sketch

var capture;

function setup() {
  let outputSize = 60
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);
  capture.size(outputSize, outputSize);

  // create sliders
  lengthSlider = createSlider(0, 50, 10);
  lengthSlider.position(outputSize * 11, 20);
  delaySlider = createSlider(0, 255, 255, 1);
  delaySlider.position(outputSize * 11, 40);
  rotateSlider = createSlider(100, 2000, 2000);
  rotateSlider.position(outputSize * 11, 60);
}

function draw() {
  var lineLength = lengthSlider.value();
  var delay = delaySlider.value();
  var rotate = rotateSlider.value() < 2000 ? millis() / rotateSlider.value() : HALF_PI;

  background(255, 255, 255, delay);
  stroke(0, 0, 0, 150);
  strokeWeight(1);

  let colorVectors = (x, y, r, g, b, a) => [
    _red(x, y, r, g, b, a),
    _green(x, y, r, g, b, a),
    _blue(x, y, r, g, b, a)
  ];
  let drawVec = vectorAsLine(10, rotate);
  capture.loadPixels();
  mapCapture(capture, colorVectors).forEach((vecs) => vecs.map(scaleVec(lineLength)).forEach(drawVec));
}
