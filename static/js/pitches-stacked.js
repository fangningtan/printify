let scaleOutput = 1;
let output;
let canvas;
let buttonDownload;
var font;
console.log(artistName);
console.log(trackName);
var trackTitle = artistName + ' - ' + trackName

function preload() {
    // TODO check whether this path can be made relative?
    font = loadFont("http://127.0.0.1:8080/static/Inconsolata_ExtraCondensed-Light.ttf")
}

function setup() {
    canvas = createCanvas(650,650);
    // Specify where the sketch will be held https://github.com/processing/p5.js/wiki/Positioning-your-canvas
    canvas.parent('sketch-holder');

    // this is the actual dimension of the image
    // how to scale p5js images https://stackoverflow.com/questions/55211647/how-do-i-save-a-p5-js-canvas-as-a-very-large-png
    output = createGraphics(3000,3000);

    // no animation
    noLoop();

}

function pitchRect(pitchVolsList, width, rowHeight, x, y) {

    // rectangles filled with different colors for each pitch (initialise a color scheme)
    colors = ['#c37263', '#e87d85', '#ff7b59', '#e59741', '#f4bf13', '#288c4e', '#be6075', '#52789b', '#76d5e4', '#95bca8', '#7a9597', '#6a6f80']

    // fill transparency determined by pitch volume (need to setAlpha if color string is used)
    // width determined by segment duration; length of each will be sectionWidth/12
    // height determined by total song length?
    for (let j = 0; j<pitchVolsList.length; j++) {
        c = color(colors[j]);
        c.setAlpha(255*(pitchVolsList[j]));
        output.noStroke();
        output.fill(c);

        output.rect(x,y,width, rowHeight/12);
        y += rowHeight/12
    }

}

function addText(x,y){
        // add text
    output.textSize(60);
    output.textFont(font);
    output.fill(50);
    output.text(trackTitle.toUpperCase(),x, y);
}


function draw() {

    // set scale
    output.push();

    // test cwidth meaning the real-life export size
    let cWidth = 3000;
    let cHeight = 3000;

    let iWidth = 650;
    let iHeight = 650;

    // check whether the print is centered
//    strokeWeight(3); // Make the points 10 pixels in size
//    point(29, 569);
//    point(29,29);
//    point(569,29);
//    point(569,569);


    songDuration = track_duration;
    // it doesn't really matter whether secondsPerRow is 3 or 2 for longer songs
    // all the pitches will still fit in

    const secondsPerRow = 12;
    //const secondsPerRow = 1;
    const nRows = Math.ceil(songDuration/secondsPerRow);

    // adjust start y coord based on songDuration
    let paddingSide = 0.1*cWidth;
    let paddingTop = 0.1*cHeight;
    let x = paddingSide;
    let y = paddingTop;

    // think about how these 2 variables change dep on length of song, these should be more dynamic
    const pixelsPerSecond = (cWidth - 2*paddingSide )/secondsPerRow;
    const rowHeight = (cHeight - 2*paddingSide)/ nRows;

    // Add song name at the bottom
    // Note: distance of text from end of print currently differs slightly for shorter (< 3min) vs longer songs
    // but this is still acceptable aesthetically
    const textYPos = rowHeight*nRows + paddingTop + 0.35*rowHeight;
    addText(0.1*cWidth, textYPos);

    // Draw rectangles
    for (let i=0; i < pitch_segments.length; i++) {
        // segment width is proportional to duration
        segmentWidth = durations[i]*pixelsPerSecond;
        // draw each rectangle at a time (instead of all 12) of a segment
        // j indicates which rectangle out of 12

        // check how to regulate padding
        if (x+(segmentWidth) <= cWidth - paddingSide) {
           //timeInRow=0
           pitchRect(pitch_segments[i], segmentWidth, rowHeight, x, y)
           x += segmentWidth;

        }
        else {
           x = paddingSide;
           y += rowHeight;
        }
    }

    output.pop();

    // Show on canvas
    image(output, 0, 0, iWidth, iHeight);
}


// Export when key is pressed
function saveImage() {
        output.save("print.png");
}


