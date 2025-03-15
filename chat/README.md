# Code Buddies Hub - Chat Server

This is the chat server for Code Buddies Hub using Flask and Socket.IO.

## Setup Instructions

### 1. Install Dependencies
First, install all required Python packages:
```
pip install -r requirements.txt
```

### 2. Configure Firewall/Router
Make sure port 5000 is open and forwarded to your server's internal IP address:
- Public IP: 79.161.71.139
- Internal IPv4: 192.168.86.42
- IPv6: 2a01:799:89e:5100:2569:2c9:b64:a357

### 3. Run the Server
Start the chat server by running:
```
python run_server.py
```

The server will start on 0.0.0.0:5000, making it accessible from the internet.

### 4. Testing the Connection
You can test if the server is running correctly by visiting:
http://localhost:5000 (from the server machine)
http://79.161.71.139:5000 (from any other device)

## Troubleshooting
- If clients can't connect, check your firewall settings
- Make sure port 5000 is forwarded to your internal IP (192.168.86.42)
- Check that the server is running with the correct host and port settings