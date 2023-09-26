import psycopg2

def connect_to_database():
    """Connects to the PostgreSQL database on Render.com.

    Returns:
        A psycopg2 connection object.
    """

    database_url = "postgres://sign_log_in_user:fKIqbZxP7XCA5lPxdF0DutZECNWUSxT9@dpg-ck616pldrqvc73flvh40-a/sign_log_in"
    user = "sign_log_in_user"
    password = "fKIqbZxP7XCA5lPxdF0DutZECNWUSxT9"

    connection = psycopg2.connect(database_url, user=user, password=password)
    return connection

def close_connection(connection):
    """Closes a psycopg2 connection.

    Args:
        connection: A psycopg2 connection object.
    """

    connection.close()
