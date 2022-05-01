
var time = 0;
// The Murmuration (a list of Sterling objects)

class Murmuration {

  constructor() {
    this.sterlings = []; // Initialize the ArrayList
    this.records = 0;
    this.distances = [];
  }

  run() {
    time++;

    console.log(mouseX,(mouseX - displayWidth/2))
    //center = createVector(width/2+sin(this.index%2*4*PI/4+time/100)*100*sin(time/20), height/2+cos(this.index%2*4*PI/4+time/100)*100*cos(time/20));

    
    if(_line) {
      for(var i = 0; i<this.sterlings.length; i+=nrLines){
        var bird = this.sterlings[i]
        //if(random()>0.8) {
            bird.renderLine();
      };
    }

    this.sterlings.forEach(function(bird){
      bird.run(this.sterlings); 
    },this);
    noFill();
  }


  addSterling(b) {
    append(this.sterlings,b);
  }
  removeSterling() {
    this.sterlings.shift();
  }

  record() {
    var svg = createGraphics(1920, 1080, SVG, "o"+records+".svg");
    records++;
    stroke(255);
    noFill();
    svg.beginDraw();
    this.sterlings.forEach(function(b){
      //if(b.index % 4 != 0) continue;
  
      svg.beginShape();
      svg.noFill();
      var n=0;
      if(b.index % 84 == 0) {
        
        svg.stroke(255,255,255,255);
        svg.strokeWeight(.1);
      } else if(b.index % 80 == 0) {
        
        svg.stroke(255,255,255,200);
        svg.strokeWeight(.1);
      } else if(b.index % 80 == 0) {
        
        svg.stroke(255,255,255,150);
        svg.strokeWeight(.1);
      } else if(b.index % 80 == 0) {
        
        svg.stroke(255,255,255,100);
        svg.strokeWeight(.1);
      } else {
        
          svg.stroke(255,255,255,50);
          svg.strokeWeight(.1);
      }
      
      b.pastposs.forEach(function(pos){
        n++;
        svg.vertex(pos.x, pos.y);
      })
      svg.endShape();
    })
    
      svg.pushMatrix();
    this.sterlings.forEach(function(b){
  
      var theta = b.velocity.heading2D() + radians(90);
    
      svg.pushMatrix();
      svg.translate(b.pos.x, b.pos.y);
      svg.rotate(theta);
      svg.beginShape();
      svg.noFill();
      svg.stroke(255);
      svg.vertex(-1, .5);
      svg.vertex(0, -.2);
      svg.vertex(+1, .5);
      
      svg.endShape();
      
      svg.popMatrix();
    })
    
    svg.popMatrix();
    
    svg.endDraw();
    recording = false;
    println(svg);
  }
}
