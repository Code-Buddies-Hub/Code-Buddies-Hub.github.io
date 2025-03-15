from flask import Flask, render_template, request, send_from_directory
from flask_socketio import SocketIO, emit
import sqlite3
import os
import base64
import time
from database import init_db, get_db_connection  # Importere funksjonene fra database.py

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins=["https://code-buddies-hub.github.io", "http://79.161.71.139:5000", "*"])

# Opprett mappe for bilder hvis den ikke finnes
UPLOAD_FOLDER = "static/bilder"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Lagrer aktive brukere
users = {}

@app.route("/")
def index():
    return render_template("index.html")

# Rute for å hente lagrede bilder
@app.route("/static/bilder/<path:filename>")
def get_image(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

# Når en bruker kobler til
@socketio.on("connect")
def handle_connect():
    print(f"Bruker koblet til: {request.sid}")

# Lagrer ID til brukeren permanent
@socketio.on("register")
def register(data):
    username = data["username"]
    
    # Hvis brukeren allerede er registrert, oppdater `sid`
    if username in users:
        print(f"{username} oppdaterte session ID til {request.sid}")
    else:
        print(f"{username} registrert med ID {request.sid}")
    
    users[username] = request.sid  # Oppdater ID-en til brukeren

# Når en melding sendes
@socketio.on("private_message")
def private_message(data):
    sender = data["from"]
    receiver = data["to"]
    message = data["message"]

    if receiver in users:
        receiver_sid = users[receiver]
        print(f"Sender melding fra {sender} til {receiver} (ID: {receiver_sid})")
        emit("message", {"from": sender, "message": message}, to=receiver_sid)
    else:
        print(f"{receiver} ikke funnet!")

    # Lagre meldingen i databasen
    conn = get_db_connection()
    conn.execute("INSERT INTO messages (sender, receiver, message) VALUES (?, ?, ?)",
                 (sender, receiver, message))
    conn.commit()
    conn.close()

# Håndterer sending av bilder
@socketio.on("send_image")
def handle_image(data):
    sender = data["from"]
    receiver = data["to"]
    image_data = data["image"]
    file_format = data.get("format", "png")  # Standard til PNG hvis ikke oppgitt

    if file_format not in ["png", "jpg", "jpeg", "gif"]:  # Tillatte formater
        print(f"Ugyldig filformat: {file_format}")
        return

    if receiver in users:
        receiver_sid = users[receiver]

        # Lag et unikt filnavn med riktig format
        image_filename = f"{sender}_{receiver}_{int(time.time())}.{file_format}"
        image_path = os.path.join(UPLOAD_FOLDER, image_filename)

        # Lagre bildet som en fil
        with open(image_path, "wb") as img_file:
            img_file.write(base64.b64decode(image_data))

        image_url = f"/static/bilder/{image_filename}"  # Korrekt sti for Flask

        # Send bildet til mottakeren
        emit("receive_image", {"from": sender, "image_url": image_url}, to=receiver_sid)
        print(f"Bilde sendt fra {sender} til {receiver} ({image_url})")
    else:
        print(f"{receiver} ikke funnet!")

# Når en bruker kobler fra
@socketio.on("disconnect")
def handle_disconnect():
    disconnected_user = None
    for username, sid in list(users.items()):
        if sid == request.sid:
            disconnected_user = username
            del users[username]
            break

    if disconnected_user:
        print(f"{disconnected_user} koblet fra")
    else:
        print(f"Ukjent bruker koblet fra: {request.sid}")

if __name__ == "__main__":
    # For development
    # socketio.run(app, host="0.0.0.0", port=5000, debug=True)
    
    # For production with SSL/HTTPS
    import ssl
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    # You'll need to create or obtain SSL certificates
    # Replace with the path to your certificate and key files
    context.load_cert_chain('cert.pem', 'key.pem')
    socketio.run(app, host="0.0.0.0", port=5000, ssl_context=context, debug=False)
