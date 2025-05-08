from rest_framework.views import APIView, Request, Response
from rest_framework import status
from django.contrib.auth import authenticate
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.asymmetric import padding
import base64
import json

def load_private_key():
        with open("private_key.pem", "rb") as key_file:
            return serialization.load_pem_private_key(key_file.read(), password=None)

def decrypt_incoming_data(encrypted_b64):

    encrypted_bytes = base64.b64decode(encrypted_b64)
    private_key = load_private_key()
    decrypted = private_key.decrypt(
        encrypted_bytes,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None,
        ),
    )
    data = json.loads(decrypted.decode())
    # email = credentials.get("email")
    #password = credentials.get("password")
    return data
