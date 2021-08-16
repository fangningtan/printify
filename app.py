"""
Prerequisites
    pip3 install spotipy Flask Flask-Session
    // from your [app settings](https://developer.spotify.com/dashboard/applications)
    export SPOTIPY_CLIENT_ID=client_id_here
    export SPOTIPY_CLIENT_SECRET=client_secret_here
    export SPOTIPY_REDIRECT_URI='http://127.0.0.1:8080' // must contain port
    // SPOTIPY_REDIRECT_URI must be added to your [app settings](https://developer.spotify.com/dashboard/applications)
    OPTIONAL
    // redirect URI
    // in development environment for debug output
    export FLASK_ENV=development
    // so that you can invoke the app outside of the file's directorey include
    export FLASK_APP=/path/to/spotipy/examples/app.py

    // on Windows, use `SET` instead of `export`
Run app.py
    python3 app.py OR python3 -m flask run
    Note to self I ran: python -m flask run --port=8080
    to ensure that the port is the same as the one specified in the redirect uri
    but running python app.py without the port also seems to work
    this seems to explain why: https://stackoverflow.com/questions/41940663/why-cant-i-change-the-host-and-port-that-my-flask-app-runs-on/41940807
    NOTE: If receiving "port already in use" error, try other ports: 5000, 8090, 8888, etc...
        (will need to be updated in your Spotify app and SPOTIPY_REDIRECT_URI variable)
"""


from flask import Flask, render_template, redirect, request, session, flash
from flask import url_for
from flask_session import Session
import spotipy
import os
import uuid
from functools import wraps
#from cred import client_ID, client_SECRET, redirect_uri # TODO find out how to import these credentials from a file
import helpers

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(64)
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_FILE_DIR'] = './.flask_session/'
Session(app)

caches_folder = './.spotify_caches/'
if not os.path.exists(caches_folder):
    os.makedirs(caches_folder)
#TODO limit session lifetime for app
def session_cache_path():
    # Creates a cache for the current user
    return caches_folder + session.get('uuid')

def login_required(f):
    """
    Decorate routes to require login.
    https://flask.palletsprojects.com/en/1.1.x/patterns/viewdecorators/
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get("uuid") or not session.get("spotify_logged_in"):
            return redirect(url_for("login"))
        return f(*args, **kwargs)

    return decorated_function


@app.route('/')
def index():
    # Check if user is logged in
    if not session.get("uuid") or not session.get("spotify_logged_in"):
        return redirect(url_for(("login")))

    return redirect(url_for("search"))

@app.route("/about")
def more_info():
    """Simply show the about page."""
    return render_template("about.html")


@app.route("/login")
def login():
    # Log in user to Spotify
    if not session.get('uuid'):
        # Step 1. Visitor is unknown, give random ID
        session['uuid'] = str(uuid.uuid4())

    cache_handler = spotipy.cache_handler.CacheFileHandler(cache_path=session_cache_path())
    # note the SpotifyOAuth gets the client_id, client_secret, redirect_uri from the environment
    # TODO edit spotify scope
    auth_manager = spotipy.oauth2.SpotifyOAuth(scope='user-read-recently-played user-top-read',
                                               cache_handler=cache_handler,
                                               show_dialog=True)
    if request.args.get("code"):
        # Step 3. Being redirected from Spotify auth page
        auth_manager.get_access_token(request.args.get("code"))
        return redirect("/")

    if not auth_manager.validate_token(cache_handler.get_cached_token()):
        # Step 2. Display sign in link when no token
        auth_url = auth_manager.get_authorize_url()
        return render_template("login.html", auth_url=auth_url)
        #return f'<h2><a href="{auth_url}">Sign in</a></h2>'

    # Step 4. Signed in, display data
    spotify_client = spotipy.Spotify(auth_manager=auth_manager)

    # The following code seems to help make the login_required decorator works
    # This was taken from https://github.com/TiceWise/SpotifyDivide/blob/main/app.py , which stated:
    # There's a bug in the current version of spotipy; if user is not registered
    # it will cause an error which is not yet caught by spotipy, so check this way.
    try:
        user = spotify_client.me()
    except spotipy.exceptions.SpotifyException:
        session["log_in_failed"] = True
        return redirect("/logout")

    username = user["display_name"]

    session["spotify_logged_in"] = True

    flash(f"Logged in to Spotify as {username}", "success")
    return redirect("/")

@app.route('/logout')
@login_required
def logout():
    try:
        # Remove the CACHE file (.cache-test) so that a new user can authorize.
        os.remove(session_cache_path())
        session.clear()
    except OSError as e:
        print("Error: %s - %s." % (e.filename, e.strerror))
    return redirect('/')


@app.route("/search", methods=["GET", "POST"])
@login_required
def search():
    # if the user clicked the search bar, return the track page
    #import pdb; pdb.set_trace()
    if request.method == "POST":
        # Ensure that search bar contains input before submitting
        # If the input is None, flash a message and 'redirect' to the search page again
        if not request.form.get("search_str"):
            flash("Enter a search term", "danger")
            return render_template("search.html")
        # else use the search term to query the spotify api
        session["search_str"] = request.form.get("search_str")

        cache_handler = spotipy.cache_handler.CacheFileHandler(cache_path=session_cache_path())
        auth_manager = spotipy.oauth2.SpotifyOAuth(cache_handler=cache_handler)
        if not auth_manager.validate_token(cache_handler.get_cached_token()):
            return redirect('/')

        spotify = spotipy.Spotify(auth_manager=auth_manager)

        # render the results from the json on the html page
        # TODO think about search type, number of results to display
        results = spotify.search(q=session["search_str"], limit=10, type="track")
        return render_template(("search_results.html"), results=results)
    else:
        # the user has been redirected to this page after logging in
        return render_template("search.html")

@app.route("/track/<string:trackid>", methods=["GET"])
@login_required
def track(trackid):
    """
    This route obtains the json file containing the audio analysis of a particular track
    using the Spotify Tracks API.
    If no trackID is passed as an argument, a 404 page is returned
    """
    # create spotify object
    cache_handler = spotipy.cache_handler.CacheFileHandler(cache_path=session_cache_path())
    auth_manager = spotipy.oauth2.SpotifyOAuth(cache_handler=cache_handler)
    if not auth_manager.validate_token(cache_handler.get_cached_token()):
        return redirect('/')

    spotify = spotipy.Spotify(auth_manager=auth_manager)

    # get audio analysis for the track
    # Note: if track id is not valid, a HTTP 500 error page will be shown
    analysis = spotify.audio_analysis(trackid)
    track_name = spotify.track(trackid)["name"]
    artist_name = spotify.track(trackid)["artists"][0]["name"] # TODO check if it is poor practice to call api wrapper function twice?

    # extract timbre data from analysis JSON using helper function

    #loudness_m = helpers.get_loudness_m_from_json(analysis, n_bars=360)
    #loudness_s = helpers.get_loudness_s_from_json(analysis, n_bars=360)
    pitch_segments = helpers.get_pitch_from_json(analysis)
    durations = helpers.get_segment_duration_from_json(analysis)
    track_duration = helpers.get_track_duration_from_json(analysis)

    # TODO figure out whether best practice is to convert json on the client side or before passi
    return render_template("track_print.html", pitch_segments=pitch_segments, durations=durations,
                           track_duration=track_duration,
                           artist_name=artist_name,
                           track_name=track_name)
    #return render_template("track_print.html", loudness_m=loudness_m, loudness_s=loudness_s, artist_name=artist_name, track_name=track_name)




# Since the selected song is passed via a get function, users might break the app
# So a custom error page (http 500) is needed to bring the user back to the right track
# Source: https://flask.palletsprojects.com/en/2.0.x/errorhandling/
@app.errorhandler(500)
def internal_server_error(e):
    # note that we set the 500 status explicitly
    return render_template('500.html'), 500

@app.errorhandler(404)
def internal_server_error(e):
    # note that we set the 500 status explicitly
    return render_template('404.html'), 400

'''
Following lines allow application to be run more conveniently with
`python app.py` (Make sure you're using python3)
(Also includes directive to leverage pythons threading capacity.)
'''
if __name__ == '__main__':
    app.run(port=int(os.environ.get("PORT", 8080))) # might add threaded=True to allow for multiple users at once?
    # try getting the port from the spotipy redirect uri set in the terminal
    #app.run(threaded=True, port=int(os.environ.get("PORT", os.environ.get("SPOTIPY_REDIRECT_URI", 8080).split(":")[-1])))





