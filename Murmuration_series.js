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
  bgColor: '#110303',
  lineColor: ['#4370D2','#7C9C6C','#E7B940','#BA372A','#E4AF67'],
  birdColor: '#333333',
  fractalStrength: 30,
  fractalZoom: 10,
  maxStrokeWidth: 1,
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
var numberOfBirds = 300;
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
var disco = 0;
var pause = false;
var showDirection = false;
var dashed = preset.dashed;
var fancyLine = preset.fancyLine;
var fr = 30;
var murmur = true;


var parameters = {
  background:true,
  bgColor: preset.bgColor,
  bgFader:1,
  paused:false,
  saveImage:function(){
    saveCanvas("/img" + hour() + "-" + minute() + "-" + time + "png");
    time++
  },
  boid: {
    lineLength: 300,
    nrLines:preset.nrLines,
    strokeColor: preset.lineColor,
    strokeAlpha: 1,
    strokeWidthMin: .1,
    strokeWidthMax: 5,
    dashed: false,
    fancy: false,
    disco: 0,
    showDirection: false,
    numberOfBirds: preset.numberOfBirds,
    equality: 100,
    murmur: true,
    fractal: true,
    fractalStrength: 10,
    fractalZoom: 10
  },
  sterling: {
    bird: true,
    birdColor: preset.birdColor,
    maxspeed: 1,
  }

}


  
function setup() {
  frameRate(fr);
  

  const gui = new dat.GUI();
  gui.add(parameters, 'background');
  gui.addColor(parameters, 'bgColor');
  gui.add(parameters, 'bgFader', 0, 1);
  gui.add(parameters, 'saveImage');
  gui.add(parameters, 'paused');

  let boid = gui.addFolder('Lines');
  boid.add(parameters['boid'], 'lineLength', 3, 1000);
  boid.add(parameters['boid'], 'nrLines', 1, 10);
  boid.add(parameters['boid'], 'dashed');
  boid.add(parameters['boid'], 'fancy');
  boid.add(parameters['boid'], 'disco', 0, 1);
  boid.add(parameters['boid'], 'numberOfBirds', 0, 1000).onChange(updateBirdCount);
  boid.addColor(parameters['boid'], 'strokeColor');
  boid.add(parameters['boid'], 'strokeAlpha', 0.01, 1);
  boid.add(parameters['boid'], 'strokeWidthMin', 0.0001, .5);
  boid.add(parameters['boid'], 'strokeWidthMax', 0, 10);

  let mechanism = gui.addFolder('Mechanism');
  mechanism.add(parameters['boid'], 'equality', -100, 100);
  mechanism.add(parameters['boid'], 'murmur');
  mechanism.add(parameters['boid'], 'fractal');
  mechanism.add(parameters['boid'], 'fractalStrength', 0, 100);
  mechanism.add(parameters['boid'], 'fractalZoom', 0, 100);

  mechanism.add(parameters['boid'], 'showDirection');

  
  var sterling = gui.addFolder('Sterling');
  sterling.add(parameters['sterling'], 'bird')
  sterling.addColor(parameters['sterling'], 'birdColor')
  sterling.add(parameters['sterling'], 'maxspeed', .1, 5)


  // var gui2 = createGui('My awesome GUI');
  // gui2.addGlobals('nrLines', 'numberOfBirds', '_background', 'bgColor', '_line', 'maxspeed', 'maxforce', 'desiredseparation', 'equality', 'equalityDirection');
  // if(typeof lineColor === 'string') gui2.addGlobals('lineColor');
  // gui2.addGlobals('myTheme', '_bird', 'birdColor', 'fr', 'saveImage', 'dashed', 'fancyLine', 'maxStrokeWidth', 'maxStrokePow', 'minStrokeWidth', 'fractal', 'fractalStrength', 'fractalZoom', 'disco', 'pause', 'murmur', 'showDirection', 'maxLineLength');
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
  if(lastTheme != myTheme) {
    preset = presets[myTheme];

    lastNumberOfBirds = parameters.boid.numberOfBirds;
    lastTheme = myTheme;
  }

  center = createVector(width/2+sin(time/50)*150, height/2+cos(time/50)*150);
  if(parameters.boid.showDirection) {
    if (mouseIsPressed) center=createVector(mouseX, mouseY);
    fill("#ffffff");
    circle(center.x, center.y, 2)
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
    if(parameters.background) {
      let c = color(parameters.bgColor);
      fill(red(c), green(c), blue(c), pow(parameters.bgFader,10) * 255);
      rect(0,0, width,height);
    }
    noFill();
    murmuration.run();
  } 
  if(saveImage){
    saveCanvas("/img" + hour() + "-" + minute() + "-" + time + "png");
    time++
  }
}

function updateBirdCount(numberOfBirds) {
  if(lastNumberOfBirds != numberOfBirds) {
    if(lastNumberOfBirds <= numberOfBirds) {
      for(var i=0; i < numberOfBirds-lastNumberOfBirds; i++) {
        murmuration.addSterling(new Sterling(center.x,center.y, i));
      }
    }

    if(lastNumberOfBirds > numberOfBirds) {
      for(var i=0; i < lastNumberOfBirds-numberOfBirds; i++) {

        murmuration.removeSterling();
      }
    }
    lastNumberOfBirds = numberOfBirds
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
    parameters.paused = !parameters.paused;
  }
  if (keyCode === 66) {
    _background = !_background;
  }
  if (keyCode === 70) {
    fractal = !fractal;
  }
}