function setup() {
    createCanvas(550,550);

//    rectMode(CENTER);
//    fill(100);
//    rect(width/2, width/2, 500, 500);

    noLoop();
}



function draw() {
    stroke('black');
    strokeWeight(1);
    fill(50);
    //noFill();

    const rowHeight = 100;  // this affects the maximum height of the line
    const paddingTop = 50; // this affects the distance between the lines
    const paddingSide = 25;
    const shift = 50; // try if this shifts everything down
    var cwidth = 550;
    var n_lines = levels.length / (cwidth-2*paddingSide) + 1;


    // TODO add padding around image (temporarily done)
    var i = 0;
    console.log(i);
    for (var current_line = 0; current_line < n_lines; current_line++) {
        beginShape();
        for (var x = 0+paddingSide; x < cwidth-paddingSide; x++) {
            //console.log(i);
            var vertex_y = map(levels[i], 0, 1, rowHeight+(paddingTop*current_line)+shift, 0 + (paddingTop*current_line)+shift);
            console.log(`${i}th y coord: ${vertex_y}`)
            // var vertex_y_rel = vertex_y + current_line*rowHeight;
            vertex(x, vertex_y)
//            curveVertex(x, vertex_y);
            //console.log(i, vertex_y);
            i++;
        }
        endShape();
    }
}