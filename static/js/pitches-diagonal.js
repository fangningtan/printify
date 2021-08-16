function setup() {
    createCanvas(600,600);
    noLoop();

    angleMode(DEGREES); // Change the mode to DEGREES
}

// TODO weird edges can possibly be avoided if the entire pitch can be drawn rectangle by rectangle (instead entire 12 shapes)
function pitchSegment(pitchVolsList, width, x, y, height) {

    // rectangles filled with different colors for each pitch (initialise a color scheme)
    colors = ['#c37263', '#e87d85', '#ff7b59', '#e59741', '#f4bf13', '#288c4e', '#be6075', '#52789b', '#76d5e4', '#95bca8', '#7a9597', '#6a6f80']

    // fill transparency determined by pitch volume (need to setAlpha if color string is used)
    // width determined by segment duration; length of each will be sectionWidth/12
    // height determined by total song length?

    for (let j = 0; j < pitchVolsList.length; j++){


        c = color(colors[j]);
        c.setAlpha(255*(1-pitchVolsList[j]));
        stroke(c);
        fill(c);

        // how to make rectangles not overlapping?
        rect(x+j*width, y, width, height);
    }
}


function draw() {
    let paddingSide = 30;
    let x = 0;
    let y = 0;
    let t = 0;

    let cWidth = 600;
    let cHeight = 600;

    songDuration = track_duration;
    // because longer songs look nicer with very thin lines? (but this makes the print rather small)
    if (songDuration > 240) {
        var secondsPerRow = 2;
    }
    else{
        var secondsPerRow = 3;
    }

    //const secondsPerRow = 1;
    const nRows = Math.ceil(songDuration/secondsPerRow);

    // think about how these 2 variables change dep on length of song, these should be more dynamic
    const pixelsPerSecond = (cHeight - 2*paddingSide )/secondsPerRow;
    const rowHeight = (cHeight - 2*paddingSide )/ nRows;

    let timeInRow = 0;
    //let totalTime = 0;
    console.log(pitch_segments.length);
    for (let i=0; i < pitch_segments.length; i++) {

        // segment width is proportional to duration
        segmentWidth = durations[i]*pixelsPerSecond;

        //console.log(`i: ${i}, duration: ${durations[i]}, totalTime: ${totalTime}`);

        pitchSegment(pitch_segments[i], segmentWidth/12, x+paddingSide, y+paddingSide, rowHeight);

        timeInRow += durations[i];
        //totalTime += durations[i];
        x = timeInRow*pixelsPerSecond;

        // need to figure out way to calculate border
        if (x > cWidth) {
            x = 0;
            timeInRow = 0;
            y += rowHeight;
        }


    }
}