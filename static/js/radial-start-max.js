function setup() {
    createCanvas(600,600);
    noLoop();

    angleMode(DEGREES); // Change the mode to DEGREES
}

function draw() {
    translate(width/2, height/2);

    //let n_circles = Math.floor(levels_m.length/360)+1;
    let r_min = 0;
    let r_max = 270;
    let i = 0;

    noFill();
    strokeWeight(1);

    beginShape();
    for (let i = 0; i < levels_m.length; i++){
        // loudness max
        stroke(50);
        //console.log(i);
        let r_m = map(levels_m[i], 0, 1, r_min, r_max);
        let x_m = r_m*cos(i);
        let y_m = r_m*sin(i);
        curveVertex(x_m, y_m);
    }
    endShape();

    beginShape();
    for (let j = 0; j < levels_s.length; j++){
        // loudness start
        stroke(150);
        let r_s = map(levels_s[j], 0, 1, r_min, r_max);
        let x_s = r_s*cos(j);
        let y_s = r_s*sin(j);
        curveVertex(x_s, y_s);
    }
    endShape();
}
