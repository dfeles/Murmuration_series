presets = { bluePink: {
  numberOfBirds: 1000,
  nrLines: 2,
  bgColor: '#4372C0',
  lineColor: '#F2A8F5',
  birdColor: '#1a1a1a',
  fractalStrength: 30,
  fractalZoom: 10,
  maxStrokeWidth: 2,
  maxStrokePow: 50,
  dashed: true,
  fancyLine: false
},
rainbow: {
  numberOfBirds: 300,
  nrLines: 5,
  bgColor: '#F0F0F0',
  lineColor: ['#4370D2','#7C9C6C','#E7B940','#BA372A','#E4AF67'],
  birdColor: '#333333',
  fractalStrength: 30,
  fractalZoom: 10,
  maxStrokeWidth: 10,
  maxStrokePow: 50,
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
  maxStrokePow: 50,
  dashed: false,
  fancyLine: false
},
dashed: {
  numberOfBirds: 300,
  nrLines: 1,
  bgColor: '#1c1c22',
  lineColor: '#4d4b42',
  birdColor: '#f0dc00',
  fractalStrength: 19,
  fractalZoom: 10,
  maxStrokeWidth: 5,
  maxStrokePow: 50,
  dashed: false,
  fancyLine: false
}}

var lastTheme = 'dashed';
var preset = presets[lastTheme];

var minStrokeWidth = ".1";
var numberOfBirds = preset.numberOfBirds;
var numberOfBirdsMin = 0;
var numberOfBirdsMax = 1000;
var nrLines = preset.nrLines;
var nrLinesMin = 1;
var nrLinesMax = 10;
var _background = true;
var bgColor = preset.bgColor;
var _line = true;
var lineColor = "#000000";
var _bird = true;
var birdColor = preset.birdColor;
var myTheme = ['dashed', 'bluePink', 'rainbow', 'dark'];
var saveImage = false;
var disco = false;
var pause = false;
var showDirection = false;
var dashed = preset.dashed;
var fancyLine = preset.fancyLine;
var fr = 30;
var murmur = true;

var maxspeed = "1";
var maxforce = "0.025";
var desiredseparation = 100;
var desiredseparationMin = 1;
var desiredseparationMax = 3000;

var maxStrokeWidth = preset.maxStrokeWidth;
var maxStrokeWidthMin = 1;
var maxStrokeWidthMax = 100;

var strokePow = preset.maxStrokePow;
var strokePowMin = 1;
var strokePowMax = 100;

var fractal = true;
var fractalStrength = preset.fractalStrength;
var fractalStrengthMin = 1;
var fractalStrengthMax = 50;

var fractalZoom = preset.fractalZoom;
var fractalZoomMin = 1;
var fractalZoomMax = 50;


var maxLineLength = 200;
var maxLineLengthMin = 1;
var maxLineLengthMax = 1000;

var lastNumberOfBirds = numberOfBirds;

  
function setup() {
  frameRate(fr);
  
  var gui = createGui('My awesome GUI');
  gui.addGlobals('nrLines', 'numberOfBirds', '_background', 'bgColor', '_line', 'maxspeed', 'maxforce', 'desiredseparation');
  if(typeof lineColor === 'string') gui.addGlobals('lineColor');
  gui.addGlobals('myTheme', '_bird', 'birdColor', 'fr', 'saveImage', 'dashed', 'fancyLine', 'maxStrokeWidth', 'maxStrokePow', 'minStrokeWidth', 'fractal', 'fractalStrength', 'fractalZoom', 'disco', 'pause', 'murmur', 'showDirection', 'maxLineLength');
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

var center;


function draw() {
  console.log(lastTheme, myTheme);
  if(lastTheme != myTheme) {
    preset = presets[myTheme];

    numberOfBirds = preset.numberOfBirds;
    nrLines = preset.nrLines;
    bgColor = preset.bgColor;
    birdColor = preset.birdColor;
    lineColor = preset.lineColor
    dashed = preset.dashed;
    fancyLine = preset.fancyLine;
    maxStrokeWidth = preset.maxStrokeWidth;
    fractalZoom = preset.fractalZoom;
    fractalStrength = preset.fractalStrength;
    lastNumberOfBirds = numberOfBirds;
    fractalZoom = preset.fractalZoom;
    strokePow = preset.strokePow;
    lastTheme = myTheme;
  }
  maxspeed = parseFloat(maxspeed)
  maxforce = parseFloat(maxforce)

  center = createVector(width/2+sin(time/50)*150, height/2+cos(time/50)*150);
  if(showDirection) {
    if (mouseIsPressed) center=createVector(mouseX, mouseY);
    fill(birdColor)
    circle(center.x, center.y, 2)
  }

  if(lastNumberOfBirds != numberOfBirds) {
    if(lastNumberOfBirds < numberOfBirds) {
      for(var i=0; i < numberOfBirds-lastNumberOfBirds; i++) {

        murmuration.addSterling(new Sterling(center.x,center.y, i));
      }
    }

    if(lastNumberOfBirds > numberOfBirds) {
      for(var i=0; i < lastNumberOfBirds-numberOfBirds; i++) {

        murmuration.removeSterling();
      }
    }

    
    // murmuration = new Murmuration();
    // // Add an initial set of sterlings into the system
    // for (var i = 0; i < numberOfBirds; i++) {
    //   var index = murmuration.sterlings.length + i
    //   murmuration.addSterling(new Sterling(width/2,height/2, index));
    // }
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
    if(_background) {
      fill(bgColor);
      rect(0,0, width,height);
    }
    noFill();
    murmuration.run();
    i+=.01;
  } 
  if(saveImage){
    saveCanvas("/img" + hour() + "-" + minute() + "-" + time + "png");
    time++
  }
}



// window.addEventListener("wheel", function(e) {
//   if (e.deltaY > 0)
//     sf *= 1.05;
//   else
//     sf *= 0.95;
// });

function mouseClicked() {
  //recording = true;
  //murmuration.record();
  //saveImage = true;
}
function keyPressed() {
  if (keyCode === 32) {
    pause = !pause;
  }
  if (keyCode === 66) {
    _background = !_background;
  }
  if (keyCode === 70) {
    fractal = !fractal;
  }
}