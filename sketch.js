/* exported setup draw  mousePressed windowResized */
/* global background noFill stroke resizeCanvas createCanvas */
/* global windowWidth windowHeight vertex beginShape endShape */
/* global width map */
let audioContext;
let analyzerNode;
let analyzerData;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  if (analyzerNode) {
    noFill();
    stroke("white");
    analyzerNode.getFloatTimeDomainData(analyzerData);

    beginShape();
    for (let i = 0; i < analyzerData.length; i++) {
      const x = map(i, 0, analyzerData.length, 0, width);
      const amplitude = analyzerData[i];
      let y = map(amplitude, -1, 1, windowHeight, 0);
      vertex(x, y);
    }
    endShape();
  }
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
        analyzerData = new Float32Array(analyzerNode.fftSize);
        mic.connect(analyzerNode);
      });
  }
}
