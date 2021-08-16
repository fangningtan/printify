// this can be use as a template for other pitch-related plots

function setup() {
    createCanvas(600,600);
    noLoop();

    angleMode(DEGREES); // Change the mode to DEGREES
}

function pitchSegment(pitchVolsList, width, x, y, height) {

    // thickness based on 'volume'
    // end y based on element index

    for (let j = 0; j < pitchVolsList.length; j++){
        strokeWeight(pitchVolsList[j]);
        line(x,y, x+width, y + (j/pitchVolsList.length)*height);
    }
}


function draw() {
    let x = 0;
    let y = 0;
    let t = 0;

    let cWidth = 600;
    let cHeight = 600;

    const secondsPerRow = 10;
    const nRows = 60;
    // think about how these 2 variables change dep on length of song
    const pixelsPerSecond = cWidth/secondsPerRow;
    const rowHeight = cHeight / nRows;

    let timeInRow = 0;
    let totalTime = 0;
    console.log(pitch_segments.length);
    for (let i=0; i < pitch_segments.length; i++) {

        // segment width is proportional to duration
        segmentWidth = durations[i]*pixelsPerSecond;

        console.log(`i: ${i}, duration: ${durations[i]}, totalTime: ${totalTime}`);

        pitchSegment(pitch_segments[i], segmentWidth, x, y, rowHeight);

        timeInRow += durations[i];
        totalTime += durations[i];
        x = timeInRow*pixelsPerSecond;

        if (x > cWidth) {
            x = 0;
            timeInRow = 0;
            y += rowHeight;
        }


    }
}
