import mysql.connector

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Krishn@_2707",  # Use your MySQL password if set
        database="skillbuddy"
    )
