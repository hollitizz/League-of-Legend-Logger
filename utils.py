import base64
import hashlib
import os
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.fernet import Fernet

def hashPassword(password):
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def genSalt():
    salt = os.urandom(16)
    with open("salt.lal", "wb") as file:
        file.write(salt)

def _getSalt():
    with open("salt.lal", "rb") as file:
        salt = file.read()
    return salt

KEY =""
SALT = ""

def encrypt(password, data):
    """Encrypts a string of data using Fernet with the given password.

    password:
        The password to use for the encrypting the data.

    data:
        The data to encrypt.
    """
    salt = _getSalt()
    global SALT
    SALT = salt

    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )
    key = kdf.derive(password.encode())
    global KEY
    KEY = key
    fernet = Fernet(base64.urlsafe_b64encode(key))
    encrypted_data = fernet.encrypt(data)
    return encrypted_data

# Example usage

def decrypt(password, encrypted_data):
    """Decrypts a string of encrypted data using Fernet with the given password.

    password:
        The password to use for the decrypting the data.

    encrypted_data:
        The encrypted data to decrypt.
    """
    salt = _getSalt()
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )
    key = kdf.derive(password.encode())
    fernet = Fernet(base64.urlsafe_b64encode(key))
    decrypted_data = fernet.decrypt(encrypted_data)
    return decrypted_data.decode()

# Example usage
if __name__ == '__main__':
    genSalt()
    encrypted_data = encrypt('password', b'Hello, World!')
    print(encrypted_data)
    data = decrypt('password', encrypted_data)
    print(data)