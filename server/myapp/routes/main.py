import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import base64
import requests
from spotipy.oauth2 import SpotifyClientCredentials, SpotifyOAuth
import pdb
import random
import logging
import time
import psycopg2
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS, cross_origin
from flask import send_from_directory

app = Flask(__name__, static_folder="../../../build", static_url_path="")
CORS(app)

DATABASE_URL = os.environ.get("DATABASE_URL")
DB_USER = os.environ.get("DATABASE_USER")
DB_PASSWORD = os.environ.get("DATABASE_PASSWORD")


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
@cross_origin(origins=["https://spotify-clone-app-fe.onrender.com"])
def catch_all(path):
    return send_from_directory(app.static_folder, "index.html")


app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
# db = SQLAlchemy(app)
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

logging.basicConfig(
    level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s"
)

DATABASE_CONFIG = {
    "dbname": "spotify_test_db",
    "user": "spotify_test_db_user",
    "password": "ptLzwqiqGZmOLnLTX4m4XfWzdxtAnZUh",
    "host": "dpg-ck9314g8s4nc73asr1tg-a.ohio-postgres.render.com",
    "port": "5432",
}


def get_db_connection():
    """Create a new database connection and return a connection object."""
    conn = psycopg2.connect(**DATABASE_CONFIG)
    return conn


db_connection = get_db_connection()
db_cursor = db_connection.cursor()

create_table = ''' CREATE TABLE IF NOT EXISTS public.newtbl(
    id SERIAL PRIMARY KEY,
    email character varying(120) COLLATE pg_catalog."default" NOT NULL,
    userName character varying(80) COLLATE pg_catalog."default" NOT NULL,
    password character varying(120) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT newtbl_pkey PRIMARY KEY (id),
    CONSTRAINT newtbl_email_key UNIQUE (email),
    CONSTRAINT newtbl_username_key UNIQUE (username)); '''

db_cursor.execute(create_table)

def get_auth_token():
    client_id = "ede4392a5dfa4b2a96e1a2333ae406ef"
    client_secret = "30880e79886848928681f17d1ac21f9e"

    auth_header = base64.b64encode(
        f"{client_id}:{client_secret}".encode("ascii")
    ).decode("ascii")

    auth_options = {
        "url": "https://accounts.spotify.com/api/token",
        "headers": {
            "Authorization": "Basic " + auth_header,
        },
        "data": {
            "grant_type": "client_credentials",
        },
    }

    response = requests.post(**auth_options)
    print("Response: ", response)
    print("Response JSON: ", response.json())
    response.raise_for_status()  # Raises a HTTPError if the status is 4xx, 5xx

    return response.json()["access_token"]


from unidecode import unidecode


def get_spotify_client():
    token = get_auth_token()
    return token


def get_artist_id(auth_token, artist_name):
    headers = {
        "Authorization": f"Bearer {auth_token}",
    }

    params = {"q": artist_name, "type": "artist", "market": "US", "limit": 5}

    response = requests.get(
        f"https://api.spotify.com/v1/search", headers=headers, params=params
    )
    results = response.json()

    # Debugging output
    import json

    print(json.dumps(results, indent=4))

    artist_items = results.get("artists", {}).get("items", [])

    # Sort by followers in descending order
    sorted_artists = sorted(
        artist_items, key=lambda x: x.get("followers", {}).get("total", 0), reverse=True
    )

    for artist in sorted_artists:
        cleaned_artist_name = unidecode(artist.get("name", ""))
        if cleaned_artist_name.lower() == artist_name.lower():
            return artist.get("id")

    # If no match found with the above method, try removing non-ASCII characters
    for artist in sorted_artists:
        artist_name_with_unicode = artist.get("name")
        cleaned_artist_name = "".join(
            char for char in artist_name_with_unicode if ord(char) < 128
        )
        if cleaned_artist_name.lower() == artist_name.lower():
            return artist.get("id")

    return None  # If no match found using both methods


def get_artist_image(auth_token, artist_id):
    headers = {
        "Authorization": f"Bearer {auth_token}",
    }

    response = requests.get(
        f"https://api.spotify.com/v1/artists/{artist_id}", headers=headers
    )
    print("Status Code:", response.status_code)
    artist = response.json()

    def clean_string(s):
        try:
            return s.encode("utf-8").decode("utf-8")
        except UnicodeEncodeError:
            return None

    images = artist.get("images", [])
    if images:
        image_url = images[0].get("url", "")

        name = clean_string(artist.get("name", None))
        image_url = clean_string(image_url)
        if name and image_url:
            return {name: image_url}
    return {}


def get_top_track(auth_token, artist_id):
    headers = {
        "Authorization": f"Bearer {auth_token}",
    }
    params = {
        "market": "US",
    }

    response = requests.get(
        f"https://api.spotify.com/v1/artists/{artist_id}/top-tracks",
        headers=headers,
        params=params,
    )
    response.raise_for_status()
    results = response.json()

    if results.get("tracks"):
        first_track = results.get("tracks")[0]

        track_name = first_track.get("name")
        track_image = (
            first_track["album"]["images"][0]["url"]
            if first_track["album"]["images"]
            else None
        )
        track_link = first_track.get("external_urls", {}).get("spotify", "")

        return {
            "track_name": track_name,
            "track_image": track_image,
            "track_link": track_link,
        }
    else:
        return None


def get_artist_page(auth_token, artist_id):
    headers = {
        "Authorization": f"Bearer {auth_token}",
    }

    response = requests.get(
        f"https://api.spotify.com/v1/artists/{artist_id}", headers=headers
    )
    response.raise_for_status()
    results = response.json()

    artist_page = results.get("external_urls", {}).get("spotify", "")

    return {"artist_page": artist_page}


def get_top_song(auth_token, song_id):
    headers = {
        "Authorization": f"Bearer {auth_token}",
    }

    response = requests.get(
        f"https://api.spotify.com/v1/tracks/{song_id}", headers=headers
    )
    response.raise_for_status()
    results = response.json()

    if results.get("tracks"):
        popularity = results.get("popularity")
        track_name = results.get("tracks")[0].get("name")
        track_image = (
            results.get("tracks")[0].get("album").get("images", [])[0].get("url")
        )
        song_page = results.get("tracks")[0].get("external_urls").get("spotify")
        if popularity == max(results.get("popularity")):
            return {
                "track_name": track_name,
                "track_image": track_image,
                "song_page": song_page,
            }


def get_song_id(auth_token, song_name):
    headers = {
        "Authorization": f"Bearer {auth_token}",
    }

    params = {"q": song_name, "type": "track", "market": "US", "limit": 5}

    response = requests.get(
        f"https://api.spotify.com/v1/search", headers=headers, params=params
    )
    results = response.json()

    track_items = results.get("tracks", {}).get("items", [])

    # Sort by popularity in descending order
    sorted_tracks = sorted(
        track_items, key=lambda x: x.get("popularity", 0), reverse=True
    )

    for track in sorted_tracks:
        cleaned_track_name = unidecode(track.get("name", ""))
        if cleaned_track_name.lower() == song_name.lower():
            return track.get("id")

    # If no match found with the above method, try removing non-ASCII characters
    for track in sorted_tracks:
        track_name_with_unicode = track.get("name")
        cleaned_track_name = "".join(
            char for char in track_name_with_unicode if ord(char) < 128
        )
        if cleaned_track_name.lower() == song_name.lower():
            return track.get("id")

    return None  # If no match found using both methods


def get_song_image(auth_token, song_id):
    headers = {
        "Authorization": f"Bearer {auth_token}",
    }

    response = requests.get(
        f"https://api.spotify.com/v1/tracks/{song_id}", headers=headers
    )
    print("Status Code:", response.status_code)
    track = response.json()

    def clean_string(s):
        try:
            return s.encode("utf-8").decode("utf-8")
        except UnicodeEncodeError:
            return None

    album = track.get("album", {})
    images = album.get("images", [])
    if images:
        image_url = images[0].get("url", "")
        print("image_url", image_url)

        name = clean_string(track.get("name", None))
        image_url = clean_string(image_url)
        if name and image_url:
            return {name: image_url}
    return {}


def get_song_page(auth_token, song_id):
    headers = {
        "Authorization": f"Bearer {auth_token}",
    }

    response = requests.get(
        f"https://api.spotify.com/v1/tracks/{song_id}", headers=headers
    )
    response.raise_for_status()
    results = response.json()

    song_page = results.get("external_urls", {}).get("spotify", "")

    return {"song_page": song_page}


def get_album_id(auth_token, album_name):
    headers = {
        "Authorization": f"Bearer {auth_token}",
    }

    params = {"q": album_name, "type": "album", "market": "US", "limit": 5}

    response = requests.get(
        f"https://api.spotify.com/v1/search", headers=headers, params=params
    )
    results = response.json()

    album_items = results.get("albums", {}).get("items", [])

    # Sort by popularity in descending order
    sorted_albums = sorted(
        album_items, key=lambda x: x.get("popularity", 0), reverse=True
    )

    for album in sorted_albums:
        cleaned_album_name = unidecode(album.get("name", ""))
        if cleaned_album_name.lower() == album_name.lower():
            return album.get("id")

    # If no match found with the above method, try removing non-ASCII characters
    for album in sorted_albums:
        album_name_with_unicode = album.get("name")
        cleaned_album_name = "".join(
            char for char in album_name_with_unicode if ord(char) < 128
        )
        if cleaned_album_name.lower() == album_name.lower():
            return album.get("id")

    return None  # If no match found using both methods


def get_album_image(auth_token, album_id):
    headers = {
        "Authorization": f"Bearer {auth_token}",
    }
    response = requests.get(
        f"https://api.spotify.com/v1/albums/{album_id}", headers=headers
    )
    print("Status Code:", response.status_code)
    album = response.json()

    def clean_string(s):
        try:
            return s.encode("utf-8").decode("utf-8")
        except UnicodeEncodeError:
            return None

    images = album.get("images", [])
    if images:
        image_url = images[0].get("url", "")
        print("image_url", image_url)

        name = clean_string(album.get("name", None))
        image_url = clean_string(image_url)
        if name and image_url:
            return {name: image_url}
    return {}


def get_album_page(auth_token, album_id):
    headers = {
        "Authorization": f"Bearer {auth_token}",
    }
    response = requests.get(
        f"https://api.spotify.com/v1/albums/{album_id}", headers=headers
    )
    response.raise_for_status()
    results = response.json()

    album_page = results.get("external_urls", {}).get("spotify")
    if album_page:
        print("album_page", album_page)
        return {"album_page": album_page}
    else:
        print("No external Spotify page found for this album.")
        return None


my_favorite_artists = {
    "Kendrick_Lamar": "2YZyLoL8N0Wb9xBt1NhZWg",
    "Felukah": "0nmukaO2zzwRPEevPJph1F",
    "El_Rass": "70JnprmV5bM5nyZ8YeZbDc",
    "Jhené_Aiko": "5ZS223C6JyBfXasXxrRqOk",
    "Sea_Power": "5zhn89Em2jWUUWdpcLO3YL",
}


def get_random_artist_track(auth_token, fav_artists):
    headers = {
        "Authorization": f"Bearer {auth_token}",
    }

    artist_id = random.choice(list(fav_artists.values()))
    print("aritst_id", artist_id)

    response_albums = requests.get(
        f"https://api.spotify.com/v1/artists/{artist_id}/albums", headers=headers
    )
    albums_data = response_albums.json()
    if not albums_data["items"]:
        return {"error": f"No albums found for artist '{artist_id}'."}, 404

    print("albums_data", albums_data)

    random_album = random.choice(albums_data["items"])
    print("random_album", random_album)

    response_tracks = requests.get(
        f'https://api.spotify.com/v1/albums/{random_album["id"]}/tracks',
        headers=headers,
    )
    tracks_data = response_tracks.json()
    if not tracks_data["items"]:
        return {"error": f"No tracks found for album '{random_album['id']}'."}, 404
    print("tracks_data", tracks_data)

    random_track = random.choice(tracks_data["items"])
    print("random_track", random_track)

    images_data = random_album["images"][0]["url"]
    print("images_data", images_data)

    response_name = random_track.get("name", "")
    print("response_name", response_name)

    response_link = random_track.get("external_urls", {}).get("spotify")
    print("response_link", response_link)

    if not random_track:
        raise Exception("No track found by name of '{response_track}")
    if not response_name:
        raise Exception("No track found by name of '{response_track}")
    if not response_link:
        raise Exception("No track found by name of '{response_track}")

    return {
        "random_track": random_track,
        "response_image": images_data,
        "response_name": response_name,
        "response_link": response_link,
    }


def get_five_random_tracks(auth_token, fav_artists):
    tracks = []

    for _ in range(5):
        if not fav_artists:
            break

        track_info = get_random_artist_track(auth_token, fav_artists)

        if "error" in track_info:
            continue

        artist_id = track_info["random_track"]["artists"][0]["id"]

        existing_artist_ids = [
            track["random_track"]["artists"][0]["id"] for track in tracks
        ]
        if artist_id in existing_artist_ids:
            continue

        tracks.append(track_info)
        if artist_id in fav_artists.values():
            fav_artists = {k: v for k, v in fav_artists.items() if v != artist_id}

    print("tracks: ", tracks)
    return tracks


@app.route("/artist", methods=["GET"])
def get_artist_info():
    auth_token = get_auth_token()
    artist_name = request.args.get("artist_name", default="", type=str)
    artist_id = get_artist_id(auth_token, artist_name)
    artist_name_to_image = get_artist_image(auth_token, artist_id)
    top_track = get_top_track(auth_token, artist_id)

    image_link = artist_name_to_image.get(artist_name)

    artist_page = get_artist_page(auth_token, artist_id)

    if not artist_id or not image_link:
        return {"error": f"No artist found for name '{artist_name}'."}, 404

    return jsonify(
        {
            "name": artist_name,
            "image": image_link,
            "top_track": top_track,
            "artist_page": artist_page,
        }
    )


@app.route("/song", methods=["GET"])
def get_song_info():
    auth_token = get_auth_token()
    print("auth_token", auth_token)
    song_name = request.args.get("song_name", default="", type=str)
    song_id = get_song_id(auth_token, song_name)
    song_name_to_image = get_song_image(auth_token, song_id)
    print("song_name_to_image", song_name_to_image)
    image_link = song_name_to_image.get(song_name)
    print("image_link", image_link)
    song_page = get_song_page(auth_token, song_id)
    print("song_page", song_page)

    if not song_id or not image_link:
        return {"error": f"No artist found for name '{song_name}'."}, 404

    return jsonify({"name": song_name, "image": image_link, "song_page": song_page})


@app.route("/album", methods=["GET"])
def get_album_info():
    auth_token = get_auth_token()
    album_name = request.args.get("album_name", default="", type=str)
    album_id = get_album_id(auth_token, album_name)
    album_name_to_image = get_album_image(auth_token, album_id)

    print("album_name_to_image", album_name_to_image)
    image_link = album_name_to_image.get(album_name)
    print("image_link", image_link)

    album_page = get_album_page(auth_token, album_id)

    if not album_id or not image_link:
        return {"error": f"No album found for name '{album_name}'."}, 404

    return jsonify({"name": album_name, "image": image_link, "album_page": album_page})


@app.route("/randomArtists", methods=["GET"])
def get_random_artists_info():
    auth_token = get_auth_token()
    random_artist_track_info = get_five_random_tracks(auth_token, my_favorite_artists)
    print("random_artist_track_info", random_artist_track_info)

    return random_artist_track_info


# def connect_to_database():
#     try:
#         connection = psycopg2.connect(DATABASE_URL, user=DB_USER, password=DB_PASSWORD)
#         return connection
#     except Exception as e:
#         print(f"Error connecting to the database: {e}")
#         return None


@app.route("/register", methods=["POST"])
def register():
    data = request.json
    hashed_password = generate_password_hash(data["password"], method="sha256")

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            "INSERT INTO NewTBL (email, userName, password) VALUES (%s, %s, %s)",
            (data["email"], data["userName"], hashed_password),
        )
        conn.commit()
        return jsonify({"message": "User registered successfully!"}), 201
    except psycopg2.IntegrityError:
        return jsonify({"message": "Username or email already exists!"}), 400
    finally:
        cur.close()
        conn.close()


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    user_name_or_email = data.get("userName") or data.get("email")
    print("user_name_or_email: ", user_name_or_email)
    password = data.get("password")

    conn = get_db_connection()
    cur = conn.cursor()

    # Fetch the user with the given userName or email
    cur.execute(
        "SELECT id, email, userName, password FROM NewTBL WHERE userName=%s OR email=%s",
        (user_name_or_email, user_name_or_email),
    )
    user = cur.fetchone()

    cur.close()
    conn.close()

    if not user:
        return jsonify({"error": "User not found!"}), 404

    user_id, email, userName, stored_password = user
    print("user: ", user)

    # Now you'll need to check the password. Here I'm assuming you're using werkzeug for hashing
    if check_password_hash(stored_password, password):
        return jsonify({"id": user_id, "email": email, "userName": userName}), 200
    else:
        return jsonify({"error": "Incorrect password!"}), 401


if __name__ == "__main__":
    app.run(debug=False)
