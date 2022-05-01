class Sterling {
  
    //var index;
    //var pastposs = [];
    //var pos;
    //var velocity;
    //var acceleration;
    //var r;
    //var maxforce;    // Maximum steering force
    //var parameters.sterling.maxspeed;    // Maximum speed
      
    constructor(x, y, i) {
      
      this.acceleration = createVector(0, 0);
      this.index = i;
        
      this.pastposs = [];
  
      this.myRandom = pow(random(-1,1),2);
  
      // This is a new PVector method not yet implemented in JS
      // velocity = p5.Vector.random2D();
  
      // Leaving the code temporarily this way so that this example runs in JS
      var angle = random(TWO_PI);
      this.velocity = createVector(cos(angle), sin(angle)).mult(300);
  
      this.pos = createVector(x,y);
      
      this.resetLineColor();
      
      this.i = 0;
    }
  
    run(sterlings) {
      this.updateEquality();
      this.resetLineColor();
      if (!parameters.paused) {
          if (parameters.boid.murmur) this.murmuration(sterlings);
          this.update();
      }
      //borders();
      if(parameters.sterling.bird) {
        this.render();
      }
    }
    
    renderLine() {
      

      noFill();
      var strokeWidth = parameters.boid.strokeWidthMax*pow(this.myRandom,50)+parameters.boid.strokeWidthMin;
      strokeWeight(strokeWidth);
      if(parameters.boid.dashed) {
        if(strokeWidth > .01){
            drawingContext.setLineDash([strokeWidth*2, strokeWidth*4]);
        } else {
            drawingContext.setLineDash([0]);
        }
      } else {
        drawingContext.setLineDash([0]);
      }
  
  
      beginShape();
      var t = 0
      var lastP;
      var strokeColor = this.strokeColor;
      stroke(this.strokeColor)
      this.pastposs.forEach(function(p){
        if(lastP){
          if(parameters.boid.dashed || !parameters.boid.fancy) {
            vertex(p.x, p.y);
          } else if (parameters.boid.fancy) {
            stroke(color(red(strokeColor) , green(strokeColor), blue(strokeColor)));
            var noiseRatio = 10 * (parameters.boid.fractalZoom/30)
            strokeWeight(strokeWidth * (t/100))
            line(lastP.x, lastP.y, p.x, p.y)
          }
          t++;
        }
        lastP = p;
      });
      endShape();
    }
  
    applyForce(force) {
      // We could add mass here if we want A = F / M
      this.acceleration.add(force);
    }
  
    // We accumulate a new acceleration each time based on three rules
    murmuration(sterlings) {
      this.sep = this.separate(sterlings);   // Separation
      this.sep.mult(this.myWeightedRandom*3);
      
      this.applyForce(this.sep);
    }
  
    resetLineColor() {
      if(typeof lineColor === 'string') {
        this.strokeColor = parameters.boid.strokeColor
      } else {
        this.strokeColor = lineColor[(this.index + floor(this.myRandom*10)) % lineColor.length]
        if(disco) {
          this.strokeColor = lineColor[floor(random(lineColor.length))]
        }
      }
    };

    updateEquality(){
      var equality = parameters.boid.equality
      if(equality >= 0) {
        this.myWeightedRandom = 1- (this.myRandom) * (equality/100)
        
      } else {
        this.myWeightedRandom = 1+ (1-this.myRandom) * (equality/100)
      }
    }
  
    // Method to update pos
    update() {
      // Update velocity
      this.velocity.add(this.acceleration);
      // Limit speed
      this.velocity.limit(this.myWeightedRandom+.5);
      
      this.pos.add(this.velocity);
      // Reset accelertion to 0 each cycle
      this.acceleration.mult(0);
  
      var dir = p5.Vector.sub(center, this.pos);  
      dir.normalize();   //process that changes the range of pixel intensity values                     
      dir.mult(0.1);                         
      this.acceleration = dir;                              
  
      this.velocity.add(this.acceleration);
      this.velocity.limit(parameters.sterling.maxspeed);
      
      if(parameters.boid.fractal) this.addPerlin()
      this.pos.add(this.velocity);
      
      
      this.pos.add(createVector(random(-.2,.2),random(-.2,.2)));
  
      if (this.index % 1 == 0) {
        append(this.pastposs, this.pos.copy());
        if (this.pastposs.length > parameters.boid.lineLength) {
          this.pastposs.splice(0,1);
        }
        this.pastposs.splice(0,(this.pastposs.length-parameters.boid.lineLength));
      }
      var n = this.pastposs.length;
      this.pastposs.forEach(function(p){
        n-= 1/100;
      });
    }
  
    addPerlin() {
      var x = this.pos.x/10 * (parameters.boid.fractalZoom/30)
      var y = this.pos.y/10 * (parameters.boid.fractalZoom/30)
  
      var z = time/10
  
      var _noise = (noise(x,y,z)-.5)*2
      // _noise = pow(_noise, 2)
  
      this.velocity.rotate( _noise*parameters.boid.fractalStrength/30 * (this.myWeightedRandom)) ;
    }
  
    seek(target) {
      var desired = p5.Vector.sub(target, this.pos);  // A vector pointing from the pos to the target
      // Scale to maximum speed
      desired.normalize();
      desired.mult(parameters.sterling.maxspeed);
  
  
      // Steering = Desired minus Velocity
      var steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(maxforce);  // Limit to maximum steering force
      return steer;
    }
  
    render() {
  
  
      var theta = this.velocity.heading() + radians(90);

      noFill();
      strokeWeight(1)
      stroke(this.strokeColor);
      stroke(parameters.sterling.birdColor);
      push();
      translate(this.pos.x, this.pos.y);
      rotate(theta);
      beginShape();
      vertex(-1, .5);
      vertex(0, -.2);
      vertex(1, .5);
      endShape();
      pop();
    }
  
    // Wraparound
    borders() {
      (this.pos.x < -r) ? this.pos.x = width+r : "";
      if (this.pos.y < -r) this.pos.y = height+r;
      if (this.pos.x > width+r) this.pos.x = -r;
      if (this.pos.y > height+r) this.pos.y = -r;
    }
  
    // Separation
    // Method checks for nearby sterlings and steers away
    separate (sterlings) {
      //separate

      var steer = createVector(0, 0, 0);
      var countSeparate = 0;
  
      var sepMult = 20;
      var alMult = 25;
      var cohMult = 9;
  
  
      //align
      var neighbordist = 5;
      var sum = createVector(0, 0);
      var countAlign = 0;
  
      //coh
      var neighbordistCoh = 5;
      var sumCoh = createVector(0, 0);   // Start with empty vector to accumulate all poss
      var countCoh = 0;
  
      // For every sterling in the system, check if it's too close
      var pos = this.pos;
      var index = this.index;
      sterlings.forEach(function(other){

        var d = p5.Vector.dist(pos, other.pos);
        // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
        if ((d > 0) && (d < desiredseparation)) {
          // Calculate vector pointing away from neighbor
          var diff = p5.Vector.sub(pos, other.pos);
          diff.normalize();
          diff.div(d);        // Weight by distance
          steer.add(diff);
          countSeparate++;            // Keep track of how many
        }
  
        if ((d > 0) && (d < neighbordist)) {
          sum.add(other.velocity);
          countAlign++;
        }
  
  
        if ((d > 0) && (d < neighbordistCoh)) {
          sumCoh.add(other.pos); // Add pos
          countCoh++;
        }
      })
      // Average -- divide by how many
      if (countSeparate > 0) {
        steer.div(countSeparate);
      }
      steer.mult(sepMult);
  
      if (countAlign>0 ) {
        sum.div(countAlign);
        sum.setMag(parameters.sterling.maxspeed);
  
        // Implement Reynolds: Steering = Desired - Velocity
        // sum.normalize();
        sum.mult(parameters.sterling.maxspeed);
        var steer2 = p5.Vector.sub(sum, this.velocity);
        steer2.limit(maxforce);
  
        steer2.mult(alMult);
        steer.add(steer2);
      }
      if (countCoh > 0) {
        sumCoh.div(countCoh);
        steer.add( this.seek(sumCoh).mult(cohMult));
      } 
  
  
      // As long as the vector is greater than 0
      if (steer.mag() > 0) {
        // First two lines of code below could be condensed with new PVector setMag() method
        // Not using this method until Processing.js catches up
        // steer.setMag(parameters.sterling.maxspeed);
  
        // Implement Reynolds: Steering = Desired - Velocity
        steer.normalize();
        steer.mult(parameters.sterling.maxspeed);
        steer.sub(this.velocity);
        steer.limit(maxforce);
      }
      return steer;
    }
  }