from server import app, socketio
from database import init_db

if __name__ == "__main__":
    # Initialize the database
    init_db()
    # Run the server on all interfaces (0.0.0.0) so it's accessible from outside
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
