presets = { bluePink: {
  numberOfBirds: 1000,
  nrLines: 2,
  bgColor: '#4372C0',
  lineColor: '#F2A8F5',
  birdColor: '#1a1a1a',
  fractalStrength: 30,
  fractalZoom: 10,
  maxStrokeWidth: 2,
  dashed: true,
  fancyLine: false
},
rainbow: {
  numberOfBirds: 300,
  nrLines: 5,
  bgColor: '#F0F0F0',
  lineColor: ['#4370D2','#7C9C6C','#E7B940','#BA372A','#E4AF67'],
  birdColor: '#ffffff',
  fractalStrength: 30,
  fractalZoom: 10,
  maxStrokeWidth: 10,
  dashed: false,
  fancyLine: true
},
dark: {
  numberOfBirds: 600,
  nrLines: 1,
  bgColor: '#110303',
  lineColor: '#ffffff',
  birdColor: '#ffffff',
  fractalStrength: 5,
  fractalZoom: 10,
  maxStrokeWidth: 5,
  dashed: false,
  fancyLine: false
},
dashed: {
  numberOfBirds: 300,
  nrLines: 1,
  bgColor: '#110303',
  lineColor: '#ffffff',
  birdColor: '#f0dc00',
  fractalStrength: 19,
  fractalZoom: 10,
  maxStrokeWidth: 5,
  dashed: true,
  fancyLine: false
}}

var preset = presets.dashed;
var minStrokeWidth = ".1";
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
var pause = false;
var showDirection = false;
var dashed = preset.dashed;
var fancyLine = preset.fancyLine;
var fr = 30;
var murmur = true;

var maxStrokeWidth = preset.maxStrokeWidth;
var maxStrokeWidthMin = 1;
var maxStrokeWidthMax = 100;

var fractal = true;
var fractalStrength = preset.fractalStrength;
var fractalStrengthMin = 1;
var fractalStrengthMax = 50;

var fractalZoom = preset.fractalZoom;
var fractalZoomMin = 1;
var fractalZoomMax = 50;

var lastNumberOfBirds = numberOfBirds;

  
function setup() {
  frameRate(fr);
  
  var gui = createGui('My awesome GUI');
  gui.addGlobals('nrLines', 'numberOfBirds', 'bgColor');
  if(typeof lineColor === 'string') gui.addGlobals('lineColor');
  gui.addGlobals('birdColor', 'fr', 'saveImage', 'dashed', 'fancyLine', 'maxStrokeWidth', 'minStrokeWidth', 'fractal', 'fractalStrength', 'fractalZoom', 'disco', 'pause', 'murmur', 'showDirection');
  lineColor = preset.lineColor
  var cvs = createCanvas(1500, 900, P2D);
  
  pixelDensity(displayDensity());
  
  murmuration = new Murmuration();
  // Add an initial set of sterlings into the system
  for (var i = 0; i < numberOfBirds; i++) {
    murmuration.addSterling(new Sterling(width/2,height/2, i));
  }
  
}


var time = 0;
var recording = false;

let sf = 1; // scaleFactor
let mx, my;


function draw() {
  if(lastNumberOfBirds != numberOfBirds) {
    murmuration = new Murmuration();
    // Add an initial set of sterlings into the system
    for (var i = 0; i < numberOfBirds; i++) {
      murmuration.addSterling(new Sterling(width/2,height/2, i));
    }
    lastNumberOfBirds = numberOfBirds
  }
  
  if(!recording){
    //snoiseSeed(i);
    translate(-width/2, -height/2);
    scale(2);
    

    mx = width/2;
    my = height/2;
    translate(mx, my);
    scale(sf);
    translate(-mx, -my);

    fill(bgColor);
    rect(0,0, width,height);
    noFill();
    murmuration.run();
    i+=.01;
  } 
  if(saveImage){
    saveCanvas("/img" + hour() + "-" + minute() + "-" + time + "png");
    time++
  }
}



window.addEventListener("wheel", function(e) {
  if (e.deltaY > 0)
    sf *= 1.05;
  else
    sf *= 0.95;
});

function mouseClicked() {
  //recording = true;
  //murmuration.record();
  //saveImage = true;
}
