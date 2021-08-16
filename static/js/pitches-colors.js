function setup() {
    createCanvas(1000,1000);
    noLoop();

    angleMode(DEGREES); // Change the mode to DEGREES
}

// TODO weird edges can possibly be avoided if the entire pitch can be drawn rectangle by rectangle (instead entire 12 shapes)

function pitchRect(pitchVolsList, j, width, height, x, y) {

    // rectangles filled with different colors for each pitch (initialise a color scheme)
    colors = ['#c37263', '#e87d85', '#ff7b59', '#e59741', '#f4bf13', '#288c4e', '#be6075', '#52789b', '#76d5e4', '#95bca8', '#7a9597', '#6a6f80']

    // fill transparency determined by pitch volume (need to setAlpha if color string is used)
    // width determined by segment duration; length of each will be sectionWidth/12
    // height determined by total song length?
    c = color(colors[j]);
    c.setAlpha(255*(pitchVolsList[j]));
    noStroke();
    fill(c);

    rect(x,y,width, height); // flip y and x; height and width if you want vertical lines

}


function draw() {

    let cWidth = 1000;
    let cHeight = 1000;

    // check whether the print is centered
//    strokeWeight(3); // Make the points 10 pixels in size
//    point(29, 569);
//    point(29,29);
//    point(569,29);
//    point(569,569);


    songDuration = track_duration;
    // it doesn't really matter whether secondsPerRow is 3 or 2 for longer songs
    // all the pitches will still fit in

    if (songDuration > 270) {
        var secondsPerRow = 2;
    }
    else{
        var secondsPerRow = 3;
    }
    //const secondsPerRow = 1;
    const nRows = Math.ceil(songDuration/secondsPerRow);

    // adjust start y coord based on songDuration
    let paddingSide = 0.05*cWidth;
    let x = paddingSide;
    let y = paddingSide;

    // think about how these 2 variables change dep on length of song, these should be more dynamic
    const pixelsPerSecond = (cWidth - 2*paddingSide )/secondsPerRow;
    const rowHeight = (cHeight - 2*paddingSide )/ nRows;

    //console.log(pitch_segments.length);
    for (let i=0; i < pitch_segments.length; i++) {
        // segment width is proportional to duration
        segmentWidth = durations[i]*pixelsPerSecond;

        // draw each rectangle at a time (instead of all 12) of a segment
        // j indicates which rectangle out of 12
        for (let j=0; j < 12; j++) {
            //console.log(`i: ${i}, j: ${j}, x: ${x}`)
            //console.log(`i: ${i}, j: ${j}, x: ${x}, y: ${y}`);
            if (x+(segmentWidth/12) > cWidth - paddingSide) {
                x = paddingSide; // this needs to be changed, maybe need to divide by cwidth to get position of x
                //timeInRow = 0;
                y += rowHeight;
            }
            pitchRect(pitch_segments[i], j, segmentWidth/12, rowHeight, x, y)
            x += (segmentWidth/12);

        }
    }
}