import spotipy
import requests
from flask import Blueprint, request, jsonify

bp = Blueprint('songs', __name__)

CLIENT_ID = "your_spotify_client_id"
CLIENT_SECRET = "your_spotify_client_secret"

# This could be a dictionary, a database query, etc.
SONG_MAP = {
    1: "Pop",
    2: "Rock",
    3: "Country",
    4: "Hip-Hop",
    5: "Jazz",
}

@bp.route('/songs/<int:id>', methods=['POST'])
def song(id):
    song = SONG_MAP.get(id)
    if not song:
        return jsonify({'error': 'Invalid genre ID'}), 400

    # Create a Spotify client object
    client = spotipy.Spotify()

    # Get the access token
    token = client.get_access_token(client_id=CLIENT_ID,
                                 client_secret=CLIENT_SECRET,
                                 redirect_uri='http://localhost:8080')

    # Make the API request
    headers = {
        "Authorization": f"Bearer {token}"
    }
    # Use genre in the endpoint, you need to adapt this to match the correct Spotify endpoint
    endpoint = f"https://api.spotify.com/v1/browse/genres/{song}" 
    data = requests.get(endpoint, headers=headers).json()

    # Get the tracks from the API response
    tracks = data['tracks']

    # Get the names of the tracks
    song_names = [track['name'] for track in tracks]

    # Return the names of the songs
    return jsonify(song_names)
