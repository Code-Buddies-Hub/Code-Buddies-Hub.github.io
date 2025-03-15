# Code Buddies Hub - Chat Server

This is the chat server for Code Buddies Hub using Flask and Socket.IO.

## Setup Instructions for HTTPS (Required for GitHub Pages)

GitHub Pages uses HTTPS, so your server must also use HTTPS to allow connections from the website.

### 1. Install Dependencies
First, install all required Python packages:
```
pip install -r requirements.txt
pip install pyopenssl  # Required for SSL certificate generation
```

### 2. Generate SSL Certificates
Run the certificate generation script:
```
python generate_cert.py
```
This will create two files:
- `cert.pem` - Your SSL certificate
- `key.pem` - Your private key

### 3. Configure Firewall/Router
Make sure port 5000 is open and forwarded to your server's internal IP address:
- Public IP: 79.161.71.139
- Internal IPv4: 192.168.86.42
- IPv6: 2a01:799:89e:5100:2569:2c9:b64:a357

### 4. Run the Server with HTTPS
Start the chat server by running:
```
python run_server.py
```

The server will start on 0.0.0.0:5000 with HTTPS enabled.

### 5. Testing the Connection
You can test if the server is running correctly by visiting:
https://localhost:5000 (from the server machine)
https://79.161.71.139:5000 (from any other device)

Note: Since you're using a self-signed certificate, browsers will show a security warning. This is normal for development.

## Troubleshooting

### No Connection from GitHub Pages
- Make sure your server is running with HTTPS enabled
- Check that port 5000 is forwarded to your internal IP (192.168.86.42)
- Verify that your SSL certificates are properly configured
- Check the browser console for any connection errors

### Browser Security Warnings
- Self-signed certificates will trigger browser warnings
- For testing, you can proceed past these warnings
- For production, consider getting a proper SSL certificate from Let's Encrypt

### Server Not Starting
- Make sure cert.pem and key.pem exist in the same directory as server.py
- Check that you have installed pyopenssl (`pip install pyopenssl`)
- Verify that port 5000 is not being used by another application