// convert python list to json array (this is done in a preceding script on the HTML page)

// try varying the direction of the line based on whether it's above or below 0.5
function setup() {
    createCanvas(900,900);
    noLoop();
}

function draw() {
    var step = 30;


// how to iterate over the levels list?
var i = 0;

for (var y=0; y<900; y=y+step) {
    for (var x=0; x<900; x=x+step) {

        if (levels[i] > 0.9) {
           line(x,y, x+step, y+step);
        }
        else {
            line(x+step, y, x, y+step);
        }

        i++;
        }
}

}
