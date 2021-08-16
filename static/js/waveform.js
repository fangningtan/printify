// convert python list to json array (this is done in a preceding script on the HTML page)

// render amplitude
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;

var bar_width = 4;
var bar_plus_space = 2*bar_width;

for (let x=0; x<width; x++) {
    if (x % bar_plus_space == 0) {
        var i = Math.ceil(levels.length * (x/width));
        var bar_height = ((levels[i] * height) / 2).toFixed(5);
        ctx.fillStyle = 'black';

        ctx.fillRect(x, (height / 2) - bar_height, bar_width, bar_height);
        ctx.fillRect(x, (height / 2), bar_width, bar_height);

    }
}