# printify
A Flask web app that generates art prints based on data from Spotify's Audio Analysis API. 
This is my final project submission for [Harvard's CS50x course](https://cs50.harvard.edu/x/2021/). <br>

Generate a print based on your favourite track in three easy steps:
1. Log in via Spotify
2. Select the desired track
3. Download the print (or try another track to see different results)

**Video demo coming soon**

#### Project Status: _Active_

### Technologies
* Python (Flask back-end, spotipy)
* JavaScript (p5.js)
* HTML
* CSS
* Bootstrap 4

### Files
* **app.py** contains the Flask web application code and details the app's views.
* **helpers.py** contains the functions that help to prepare data in the right format for rendering on the browser.
They help to make the app.py file neater.
* **templates/** contains the HTML files that are rendered in the user's browser by Flask. 
**layout.html** contains the main layout of the web app, which are extended by the other HTML template files.
* **static/** contains the CSS file and the js (Javascript) file, which stores the scripts
used to create the art prints (not all of them are displayed on the browser currently, see Future Features). The images (e.g. Spotify logo) required for the web app are also stored in here.
* **requirements.txt** contains the required Python libraries for the web app.


### Design choices
* Amongst the different JavaScript libraries (paper.js, porcessing.js) for generative art, I chose p5.js because it had 
a large amount of online resources that allowed me to quickly learn how to generate art with code.
* Flask was used for the back-end because it provided a minimal framework which I could easily start my web app from.
* I debated between generating the art print on the client or server side as I had concerns about whether it would 
be too slow to generate it on the client side. However, generating the art on the server-side was also
potentially challenging because I was not sure whether Flask was suitable for dynamic generation of images.
* Eventually I went with client-side generation of the print as I wanted to continue using Flask for the backend and 
use p5.js (a Javascript library) for the generation of the image. So the Flask app was responsible to extracting the 
required data for the API and passing it onto the client side for rendering using p5.js.
* This choice was strongly motivated by my familiarity with Python and Flask, but I wonder 
if using JavaScript for the server-side would have allowed me to generate the image on the back-end.
This would be an improvement to consider, if I wanted to conceal the algorithm for generating the print from users.



### Future features
* Deployment on Heroku
* Multiple print options to choose from per track
* More mobile-friendly display of the canvas
