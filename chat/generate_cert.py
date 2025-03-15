"""
Generate a self-signed certificate for testing HTTPS
Run this script on your server to create cert.pem and key.pem files
"""
from OpenSSL import crypto
import os

def generate_self_signed_cert(cert_file="cert.pem", key_file="key.pem"):
    # Create a key pair
    k = crypto.PKey()
    k.generate_key(crypto.TYPE_RSA, 2048)
    
    # Create a self-signed cert
    cert = crypto.X509()
    cert.get_subject().C = "NO"  # Country
    cert.get_subject().ST = "Norway"  # State
    cert.get_subject().L = "Your City"  # Locality
    cert.get_subject().O = "Code Buddies Hub"  # Organization
    cert.get_subject().OU = "Development"  # Organizational Unit
    cert.get_subject().CN = "79.161.71.139"  # Common Name (your server's IP)
    
    # Add alternative names (important for modern browsers)
    san_list = ["IP:79.161.71.139", 
                "DNS:localhost", 
                "DNS:code-buddies-hub.github.io"]
    
    cert.add_extensions([
        crypto.X509Extension(
            b"subjectAltName", 
            False, 
            ", ".join(san_list).encode()
        )
    ])
    
    cert.set_serial_number(1000)
    cert.gmtime_adj_notBefore(0)
    cert.gmtime_adj_notAfter(10*365*24*60*60)  # 10 years validity
    cert.set_issuer(cert.get_subject())
    cert.set_pubkey(k)
    cert.sign(k, 'sha256')
    
    # Write the certificate and key to files
    with open(cert_file, "wb") as f:
        f.write(crypto.dump_certificate(crypto.FILETYPE_PEM, cert))
    
    with open(key_file, "wb") as f:
        f.write(crypto.dump_privatekey(crypto.FILETYPE_PEM, k))
    
    print(f"Self-signed certificate created: {cert_file} and {key_file}")

if __name__ == "__main__":
    generate_self_signed_cert()
