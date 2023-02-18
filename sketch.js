/* exported setup draw  mousePressed windowResized */
/* global background noFill stroke resizeCanvas createCanvas */
/* global windowWidth windowHeight vertex beginShape endShape */
/* global width map lerp */
let audioContext;
let analyzerNode;
let analyzerDataCurrent;
let analyzerDataTarget;
let updatesPerSecond = 12;
let timeMark;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  stroke("white");
  timeMark = performance.now();
  setInterval(() => {
    if (analyzerNode) {
      analyzerNode.getFloatTimeDomainData(analyzerDataTarget);
      timeMark = performance.now();
    }
  }, 1000 / updatesPerSecond);
}

function draw() {
  background(0);

  if (!analyzerNode) {
    return;
  }
  // interpolate current into target
  for (let i = 0; i < analyzerDataCurrent.length; i++) {
    analyzerDataCurrent[i] = lerp(
      analyzerDataCurrent[i],
      analyzerDataTarget[i],
      //0.5,
      map(performance.now() - timeMark, 0, 1000 / updatesPerSecond, 0, 1, true)
    );
  }
  // console.log(analyzerDataCurrent);

  beginShape();
  for (let i = 0; i < analyzerDataCurrent.length; i++) {
    const x = map(i, 0, analyzerDataCurrent.length, 0, width);
    const amplitude = analyzerDataCurrent[i];
    let y = map(amplitude, -1, 1, windowHeight, 0);
    vertex(x, y);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  console.log("mousePressed");
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  audioContext.resume();

  if (!analyzerNode) {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((mediaStream) => {
        const mic = audioContext.createMediaStreamSource(mediaStream);
        analyzerNode = audioContext.createAnalyser();
        analyzerNode.fftSize = 4096;
        analyzerDataCurrent = new Float32Array(analyzerNode.fftSize);
        analyzerDataTarget = new Float32Array(analyzerNode.fftSize);
        mic.connect(analyzerNode);
      });
  }
}
