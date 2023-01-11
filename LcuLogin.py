import requests
from LcuInfo import LcuInfo
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

class LcuLogin(LcuInfo):
    def __init__(self):
        super().__init__()
        self.lcu_port = self.access_port
        self.lcu_endpoint = f'https://127.0.0.1:{self.lcu_port}/rso-auth/v1/session/credentials'
        self.lcu_password = self.remoting_auth_token
        self.lcu_user = 'riot'

    def loginRequest(self, user_nickname, user_password):
        payload = {
        'username': user_nickname,
        'password': user_password,
        'persistLogin': False
        }
        requests.put(self.lcu_endpoint, json=payload, verify=False, auth=(self.lcu_user, self.lcu_password))
