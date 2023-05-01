import base64
import hashlib
import os
from league_connection import LeagueConnection
from tkinter import Canvas, Frame, ttk
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


class ScrollableFrame(Frame):
    def __init__(self, container, *args, **kwargs):
        super().__init__(container, *args, **kwargs)
        self.canvas = Canvas(self)
        scrollbar = ttk.Scrollbar(self, orient="vertical", command=self.canvas.yview)
        self.scrollable_frame = Frame(self.canvas)
        self.scrollable_frame.bind(
            "<Configure>",
            lambda e: self.canvas.configure(
                scrollregion=self.canvas.bbox("all")
            )
        )
        def _on_mousewheel(event):
            self.canvas.yview_scroll(int(-1*(event.delta/120)), "units")
        self.canvas.bind_all("<MouseWheel>", _on_mousewheel)
        self.scrollable_frame.bind_all("<MouseWheel>", _on_mousewheel)
        self.canvas.create_window((0, 0), window=self.scrollable_frame, anchor="nw")

        self.canvas.configure(yscrollcommand=scrollbar.set)

        self.canvas.pack(side="left", fill="both", expand=True)
        scrollbar.place(x=400, y=0, height=500)


def logToLeague(username, password):
    lockfile = os.path.expanduser('~\\AppData\\Local\\Riot Games\\Riot Client\\Config\\lockfile')
    connection = LeagueConnection(lockfile, timeout=10)
    data = {'username': username, 'password': password, 'persistLogin': False}
    connection.request('PUT', '/rso-auth/v1/session/credentials', json=data)

# Example usage
if __name__ == '__main__':
    genSalt()
    encrypted_data = encrypt('password', b'Hello, World!')
    print(encrypted_data)
    data = decrypt('password', encrypted_data)
    print(data)