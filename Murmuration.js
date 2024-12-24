
var time = 0;
// The Murmuration (a list of Sterling objects)


class Murmuration {

  constructor() {
    this.sterlings = []; // Initialize the ArrayList
    this.records = 0;
    this.distances = [];
  }
  run(fft) {

    time++;
    //center = createVector(width/2+sin(this.index%2*4*PI/4+time/100)*100*sin(time/20), height/2+cos(this.index%2*4*PI/4+time/100)*100*cos(time/20));

    
    if(_line) {
      for(var i = 0; i<this.sterlings.length; i+=parameters['boid']['nrLines']){
        var bird = this.sterlings[floor(i)]
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
    // Calculate bounding box of all paths
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    for(let i = 0; i < this.sterlings.length; i+=parameters['boid']['nrLines']) {
      let bird = this.sterlings[floor(i)];
      let history = bird.pastposs;
      
      for(let j = 0; j < history.length; j++) {
        minX = Math.min(minX, history[j].x);
        minY = Math.min(minY, history[j].y); 
        maxX = Math.max(maxX, history[j].x);
        maxY = Math.max(maxY, history[j].y);
      }
    }
    
    // Add some padding
    let padding = 10;
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;
    
    let svgWidth = maxX - minX;
    let svgHeight = maxY - minY;
    
    let svgHeader = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n';
    svgHeader += '<svg xmlns="http://www.w3.org/2000/svg" ';
    svgHeader += 'width="' + (svgWidth * 3) + '" height="' + (svgHeight * 3) + '" ';
    svgHeader += 'viewBox="' + minX + ' ' + minY + ' ' + svgWidth + ' ' + svgHeight + '">\n';
    
    // Add white background
    let bgContent = '<rect x="' + minX + '" y="' + minY + '" ';
    bgContent += 'width="' + svgWidth + '" height="' + svgHeight + '" ';
    bgContent += 'fill="white"/>\n';
    
    let pathsContent = '<g id="paths">\n';
    let arrowheadsContent = '<g id="arrowheads">\n';
    
    // Draw each line
    for(let i = 0; i < this.sterlings.length; i+=parameters['boid']['nrLines']) {
      let bird = this.sterlings[floor(i)];
      
      // Get positions from bird's history
      let pos = bird.pos;
      let history = bird.pastposs;
      
      // Create path for the line
      if (history.length > 1) {
        // Draw the main path
        pathsContent += '  <path d="M';
        pathsContent += history[0].x + ',' + history[0].y + ' L';
        
        for(let j = 1; j < history.length; j++) {
          pathsContent += history[j].x + ',' + history[j].y + ' ';
        }
        
        pathsContent += '" fill="none" ';
        pathsContent += 'stroke="' + parameters['boid']['strokeColor'] + '" ';
        pathsContent += 'stroke-width="' + parameters['boid']['strokeWidthMin'] + '" ';
        pathsContent += 'opacity="' + parameters['boid']['strokeAlpha'] + '" ';
        pathsContent += 'fill-rule="nonzero"/>\n';

        // Add arrowhead triangle at the end
        let lastPoint = history[history.length-1];
        let secondLastPoint = history[history.length-2];
        
        // Calculate angle of line end
        let angle = Math.atan2(lastPoint.y - secondLastPoint.y, lastPoint.x - secondLastPoint.x);
        
        // Calculate triangle points
        let x1 = lastPoint.x - 2 * Math.cos(angle - Math.PI/6);
        let y1 = lastPoint.y - 2 * Math.sin(angle - Math.PI/6);
        let x2 = lastPoint.x - 2 * Math.cos(angle + Math.PI/6);
        let y2 = lastPoint.y - 2 * Math.sin(angle + Math.PI/6);
        
        arrowheadsContent += '  <path d="M' + lastPoint.x + ',' + lastPoint.y + ' L';
        arrowheadsContent += x1 + ',' + y1 + ' L';
        arrowheadsContent += x2 + ',' + y2 + ' Z" ';
        arrowheadsContent += 'fill="' + parameters['boid']['strokeColor'] + '" ';
        arrowheadsContent += 'opacity="' + parameters['boid']['strokeAlpha'] + '"/>\n';
      }
    }
    
    pathsContent += '</g>\n';
    arrowheadsContent += '</g>\n';
    let svgFooter = '</svg>';
    let svg = svgHeader + bgContent + pathsContent + arrowheadsContent + svgFooter;
    
    // Save the SVG file
    let filename = 'murmuration_' + year() + month() + day() + '_' + hour() + minute() + second() + '.svg';
    save([svg], filename, 'svg');

    console.log(svg);
  }
}
