import spotipy
import requests
from flask import Blueprint, request, jsonify

bp = Blueprint('genre', __name__)

CLIENT_ID = "your_spotify_client_id"
CLIENT_SECRET = "your_spotify_client_secret"

# This could be a dictionary, a database query, etc.
GENRE_MAP = {
    1: "hiphop",
    2: "jazz",
    3: "metal",
    4: "pop"
}

@bp.route('/genre/<int:id>', methods=['POST'])
def genre(id):
    genre = GENRE_MAP.get(id)
    if not genre:
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
    endpoint = f"https://api.spotify.com/v1/browse/genres/{genre}" 
    data = requests.get(endpoint, headers=headers).json()

    # Get the top 5 artists
    top_artists = data['artists']['items'][:5]

    # Return the top 5 artists
    return jsonify(top_artists)
