**Project Overview: Simplified Spotify App**

- **Introduction:**
  This project presents a simplified Spotify-like application, developed as a full-stack solution using React, Flask, and PostgreSQL. The app allows users to explore music genres, artists, songs, and albums. It leverages the Spotify API to fetch data and presents it through a user-friendly interface.

  Here is the [link](https://master--leafy-bunny-e2898f.netlify.app)

- **Features:**

  1. **Home Page:**

     - Displays four distinct music genres.
     - Clicking on a genre reveals four artists from that genre.
     - Further clicking on an artist displays their most popular song.
     - Clicking on the song redirects the user to the actual song link on Spotify.

  https://github.com/Ahmad-ayoub/client/assets/107888495/baa75611-562b-41c7-8c84-99436da0645a

  2. **Search Bar:**

     - Provides three search options: artist, song, and album.
     - Users can enter the name of an artist, song, or album.
     - The search result includes an image and name of the selected item.
     - Users can hover over and click on the result to access the Spotify page for the item.

  https://github.com/Ahmad-ayoub/client/assets/107888495/7744cabf-c938-4216-8bc6-49ab3a841a8c

  3. **Randomizer:**

     - Offers a "Randomize" feature.
     - Clicking on the randomizer generates a page with five random songs from pre-coded artists.

  https://github.com/Ahmad-ayoub/client/assets/107888495/2e8b60c8-395a-45e8-a56a-a4d1f0d125e5

  4. **Login/Register:**
     - Users can register and log in using a username, email, and password.
     - User data is stored in a PostgreSQL database.
     - Flask handles data communication to and from the database.
     - Passwords are securely hashed using the werkzeug.security library for enhanced security.

  https://github.com/Ahmad-ayoub/client/assets/107888495/81db69d4-6db0-4662-b7fd-02e108963d59

- **Technologies Used:**

  - **Frontend: React**
    React is utilized to create a dynamic and responsive user interface. It allows for efficient updating of UI components without requiring full page reloads.

  - **Backend: Flask**
    Flask serves as the backend framework, handling API requests and responses. It interfaces with the Spotify API to retrieve music data and delivers it to the frontend.

  - **Database: PostgreSQL**
    PostgreSQL is used to store user registration information securely. It ensures reliable data storage and retrieval for the login/register feature.

  - **API Integration: Spotify API**
    The Spotify API is accessed via HTTP GET requests to obtain music-related data such as genres, artists, songs, and albums.

  - **RESTful APIs**
    The project adheres to RESTful principles in designing the API endpoints. This ensures a structured and consistent approach to data retrieval and manipulation.

- **Conclusion:**
  This simplified Spotify app demonstrates the integration of React, Flask, and PostgreSQL to provide users with a seamless music exploration experience. It leverages the Spotify API to gather music-related data and presents it in an organized manner through user-friendly features like genre-based artist exploration, search functionality, random song generation, and user registration/login. The project effectively showcases the synergy between frontend and backend technologies to create a cohesive and engaging application.
