presets = { bluePink: {
  numberOfBirds: 1000,
  nrLines: 2,
  bgColor: '#4372C0',
  lineColor: '#F2A8F5',
  birdColor: '#1a1a1a',
  fractalStrength: 30,
  fractalSize: 10,
  maxStrokeWidth: 2,
  dashed: true,
},
black: {
  numberOfBirds: 300,
  nrLines: 5,
  bgColor: '#F0F0F0',
  lineColor: ['#4370D2','#7C9C6C','#E7B940','#BA372A','#E4AF67'],
  birdColor: '#ffffff',
  fractalRotationStrength: 30,
  fractalStrength: 30,
  fractalSize: 10,
  maxStrokeWidth: 10,
  dashed: false,
}}

var preset = presets.black;

var numberOfBirds = preset.numberOfBirds;
var numberOfBirdsMin = 0;
var numberOfBirdsMax = 3000;
var nrLines = preset.nrLines;
var nrLinesMin = 1;
var nrLinesMax = 10;
var bgColor = preset.bgColor;
var lineColor = "#000000";
var birdColor = preset.birdColor;
var myChoice = ['one', 'two', 'three'];
var saveImage = false;
var disco = false;
var dashed = preset.dashed;
var fr = 30;

var maxStrokeWidth = preset.maxStrokeWidth;
var maxStrokeWidthMin = 1;
var maxStrokeWidthMax = 100;

var fractalStrength = preset.fractalStrength;
var fractalStrengthMin = 1;
var fractalStrengthMax = 1000;
var fractalRotationStrength = preset.fractalRotationStrength;
var fractalRotationStrengthMin = 1;
var fractalRotationStrengthMax = 1000;

var fractalSize = preset.fractalSize;
var fractalSizeMin = 1;
var fractalSizeMax = 50;

var lastNumberOfBirds = numberOfBirds;

  
function setup() {
  frameRate(fr);
  
  var gui = createGui('My awesome GUI');
  gui.addGlobals('nrLines', 'numberOfBirds', 'bgColor');
  if(typeof lineColor === 'string') gui.addGlobals('lineColor');
  gui.addGlobals('birdColor', 'fr', 'saveImage', 'dashed', 'maxStrokeWidth', 'fractalStrength', 'fractalRotationStrength','fractalSize', 'disco');
  lineColor = preset.lineColor
  var cvs = createCanvas(1500, 900, P2D);
  
  pixelDensity(displayDensity());
  flock = new Flock();
  // Add an initial set of sterlings into the system
  for (var i = 0; i < numberOfBirds; i++) {
    flock.addSterling(new Sterling(width/2,height/2, i));
  }
  
}


var time = 0;
var recording = false;
function draw() {
  if(lastNumberOfBirds != numberOfBirds) {
    flock = new Flock();
    // Add an initial set of sterlings into the system
    for (var i = 0; i < numberOfBirds; i++) {
      flock.addSterling(new Sterling(width/2,height/2, i));
    }
    lastNumberOfBirds = numberOfBirds
  }
  
  if(!recording){
    //snoiseSeed(i);
    translate(-width/2, -height/2);
    scale(2);
    fill(bgColor);
    rect(0,0, width,height);
    noFill();
    flock.run();
    i+=.01;
  } 
  if(saveImage){
    saveCanvas("/img" + hour() + "-" + minute() + "-" + time + "png");
    time++
  }
}

function mouseClicked() {
  //recording = true;
  //flock.record();
  //saveImage = true;
}
