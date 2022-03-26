class Sterling {
  
    //var index;
    //var pastposs = [];
    //var pos;
    //var velocity;
    //var acceleration;
    //var r;
    //var maxforce;    // Maximum steering force
    //var maxspeed;    // Maximum speed
      
    constructor(x, y, i) {
      
      this.acceleration = createVector(0, 0);
      this.index = i;
        
      this.pastposs = [];
  
      this.myRandom = pow(random(),2);
  
      // This is a new PVector method not yet implemented in JS
      // velocity = p5.Vector.random2D();
  
      // Leaving the code temporarily this way so that this example runs in JS
      var angle = random(TWO_PI);
      this.velocity = createVector(cos(angle), sin(angle));
  
      this.pos = createVector(x,y);
      this.r = 2.0;
      this.maxspeed = 1;
      this.maxforce = 0.025;
      
      this.resetLineColor();
      
      this.i = 0;
    }
  
    run(sterlings) {
      this.resetLineColor();
      if (!pause) {
          if (murmur) this.murmuration(sterlings);
          this.update();
      }
      //borders();
      this.render();
    }
    
    renderLine() {
      
      if (this.pastposs.length<10) console.log("igen")

      noFill();
      var strokeWidth = maxStrokeWidth*pow(this.myRandom,50)+minStrokeWidth;
      strokeWeight(strokeWidth);
      if(dashed) {
        if(strokeWidth > .5){
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
          if(dashed || !fancyLine) {
            vertex(p.x, p.y);
          } else if (fancyLine) {
            stroke(color(red(strokeColor) , green(strokeColor), blue(strokeColor)));
            var noiseRatio = 10 * (fractalZoom/30)
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
      this.sep.mult(this.myRandom*3);
      
      this.applyForce(this.sep);
    }
  
    resetLineColor() {
      if(typeof lineColor === 'string') {
        this.strokeColor = lineColor
      } else {
        this.strokeColor = lineColor[(this.index + floor(this.myRandom*10)) % lineColor.length]
        if(disco) {
          this.strokeColor = lineColor[floor(random(lineColor.length))]
        }
      }
    };
  
    // Method to update pos
    update() {
      // Update velocity
      this.velocity.add(this.acceleration);
      // Limit speed
      this.velocity.limit(this.myRandom+.5);
      
      this.pos.add(this.velocity);
      // Reset accelertion to 0 each cycle
      this.acceleration.mult(0);
  
      var mult = 50;
      var dir = p5.Vector.sub(center, this.pos);  
      dir.normalize();   //process that changes the range of pixel intensity values                     
      dir.mult(0.1);                         
      this.acceleration = dir;                              
  
      this.velocity.add(this.acceleration);
      this.velocity.limit(this.maxspeed);
      
      if(fractal) this.addPerlin()
      this.pos.add(this.velocity);
      
      
      this.pos.add(createVector(random(-.2,.2),random(-.2,.2)));
  
      if (this.index % 1 == 0) {
        append(this.pastposs, this.pos.copy());
        if (this.pastposs.length > 200) {
          this.pastposs.splice(0,1);
        }
      }
      var n = this.pastposs.length;
      this.pastposs.forEach(function(p){
        n-= 1/100;
      });
    }
  
    addPerlin() {
      var x = this.pos.x/10 * (fractalZoom/30)
      var y = this.pos.y/10 * (fractalZoom/30)
  
      var z = time/10
  
      var _noise = noise(x,y,z)*noise(x,y,z)-0.5
  
      this.velocity.rotate( _noise*fractalStrength/30 );
    }
  
    seek(target) {
      var desired = p5.Vector.sub(target, this.pos);  // A vector pointing from the pos to the target
      // Scale to maximum speed
      desired.normalize();
      desired.mult(this.maxspeed);
  
  
      // Steering = Desired minus Velocity
      var steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);  // Limit to maximum steering force
      return steer;
    }
  
    render() {
  
  
      var theta = this.velocity.heading() + radians(90);
      
      noFill();
      strokeWeight(1)
      stroke(this.strokeColor);
      stroke(birdColor);
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
      var desiredseparation = 100.0;
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
        // First two lines of code below could be condensed with new PVector setMag() method
        // Not using this method until Processing.js catches up
        // sum.setMag(maxspeed);
  
        // Implement Reynolds: Steering = Desired - Velocity
        sum.normalize();
        sum.mult(this.maxspeed);
        var steer2 = p5.Vector.sub(sum, this.velocity);
        steer2.limit(this.maxforce);
  
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
        // steer.setMag(maxspeed);
  
        // Implement Reynolds: Steering = Desired - Velocity
        steer.normalize();
        steer.mult(this.maxspeed);
        steer.sub(this.velocity);
        steer.limit(this.maxforce);
      }
      return steer;
    }
  }