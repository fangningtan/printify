
// Source: https://www.youtube.com/watch?v=h_aTgOl9J5I&ab_channel=TheCodingTrain

function setup() {
    createCanvas(600,600);
    noLoop();

    angleMode(DEGREES); // Change the mode to DEGREES
}

function draw() {
    translate(width/2, height/2);

    let n_circles = Math.floor(levels_m.length/360)+1;
    let r_min = 0;
    let r_max = 250;
    let i = 0;

    for (let current_line = 0; current_line < n_circles; current_line++) {

        // this is the 'base' line
        noFill();
        stroke(220);
        strokeWeight(1);
        beginShape();
        for (let a = 0; a <360; a++) {
            let x_n = r_min*cos(a);
            let y_n = r_min*sin(a);
            curveVertex(x_n, y_n);
        }
        endShape();

        // this is the normalised amplitude
        noFill();
        stroke(50);
        strokeWeight(1);

        beginShape();
        for (let p = 0; p < 360; p++) {
            console.log(i);
            let r = map(levels_m[i], 0, 1, r_min, r_max);
            let x = r*cos(i);
            let y = r*sin(i);
            curveVertex(x, y);
            i++;
        }
        curveVertex
        endShape();

        r_min = r_min+50;
        r_max = r_max+50;
    }
}