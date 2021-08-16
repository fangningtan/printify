# input audio analysis json file
# get data for constructing waveform
import numpy as np


def get_loudness_m_from_json(analysis_json, n_bars=1000):
    """
    This function returns a list of normalised loudness max values (i.e. max loudness in each segment)
    from the audio analysis json
    which can be used to plot a waveform on the client side using JS.
    n_bars refers to the desired number of bars for the waveform

    for grid designs - n_bars = 1000 is better
    for radial designs - n_bars = 360 so that all points in a circle will be filled
    """
    segments_analysis = analysis_json["segments"]
    track_duration = analysis_json["track"]["duration"]

    # resample loudness from segment to evenly spaced array of length n_bars
    # intialise counters and variables
    n_bars = n_bars
    unit_time = track_duration / n_bars
    j = 0
    t = 0

    loudness_m_levels = []

    for i in range(n_bars):
        loudness_m_levels.append(segments_analysis[j]["loudness_max"])
        i += 1
        t += unit_time
        if t > segments_analysis[j]["duration"] + segments_analysis[j]["start"]:
            j += 1

    # normalise wave form data using min-max normalisation
    # so the min and max will be 0 and 1 respectively
    # TODO decide whether all songs should have the same max and min loudness for normalisation (yes)
    max_l = 0 #max(loudness_m_levels)
    min_l = -60 #min(loudness_m_levels)

    loudness_m_levels_normalised = []
    for level in range(len(loudness_m_levels)):
        normalised = (loudness_m_levels[level] - min_l) / (max_l - min_l)
        loudness_m_levels_normalised.append(normalised)

    return loudness_m_levels_normalised

def get_loudness_s_from_json(analysis_json, n_bars=1000):
    """
    This function returns a list of normalised loudness start (i.e. loudenss level at the start of the segment)
     values from the audio analysis json
    which can be used to plot a waveform on the client side using JS.
    n_bars refers to the desired number of bars for the waveform
    """
    segments_analysis = analysis_json["segments"]
    track_duration = analysis_json["track"]["duration"]

    # resample loudness from segment to evenly spaced array of length n_bars
    # intialise counters and variables
    n_bars = n_bars
    unit_time = track_duration / n_bars
    j = 0
    t = 0

    loudness_s_levels = []

    for i in range(n_bars):
        loudness_s_levels.append(segments_analysis[j]["loudness_start"])
        i += 1
        t += unit_time
        if t > segments_analysis[j]["duration"] + segments_analysis[j]["start"]:
            j += 1

    # normalise wave form data using min-max normalisation
    # so the min and max will be 0 and 1 respectively
    # TODO decide whether all songs should have the same max and min loudness for normalisation (yes)
    max_l = 0
    min_l = -60

    loudness_s_levels_normalised = []
    for level in range(len(loudness_s_levels)):
        normalised = (loudness_s_levels[level] - min_l) / (max_l - min_l)
        loudness_s_levels_normalised.append(normalised)

    return loudness_s_levels_normalised

# get data for constructing print from pitch array
def get_pitch_from_json(analysis_json):
    """This function returns an array containing the pitches vector of a song"""
    segments_analysis = analysis_json["segments"]

    n_segments = len(segments_analysis)

    # save the pitch into a numpy array
    pitch = []
    for i in range(n_segments):
        pitch.append(segments_analysis[i]["pitches"])
    #pitch_array = np.array(pitch)
    return pitch

def get_segment_duration_from_json(analysis_json):
    segments_analysis = analysis_json["segments"]
    n_segments = len(segments_analysis)

    # save the pitch into a numpy array
    durations = []
    for i in range(n_segments):
        durations.append(segments_analysis[i]["duration"])
    return durations

def get_track_duration_from_json(analysis_json):
    track_duration = analysis_json["track"]["duration"]
    return track_duration


