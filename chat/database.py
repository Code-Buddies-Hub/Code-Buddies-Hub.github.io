import sqlite3

# Init database ved oppstart
def init_db():
    conn = sqlite3.connect("chat.db")
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS messages (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        sender TEXT,
                        receiver TEXT,
                        message TEXT
                    )''')
    conn.commit()
    conn.close()

# Hente database-tilkobling
def get_db_connection():
    conn = sqlite3.connect("chat.db")
    conn.row_factory = sqlite3.Row
    return conn