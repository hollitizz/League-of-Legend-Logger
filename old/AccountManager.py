import json
from utils import encrypt, decrypt, logToLeague

class AccountManager():
    def __init__(self, password, encrypted):
        super().__init__()
        self.__password: str = password
        if not encrypted:
            try:
                with open("accounts.lal", "rb") as r_file:
                    datas = r_file.read()
            except:
                with open("accounts.lal", "w") as w_file:
                    w_file.write("{}")
                with open("accounts.lal", "rb") as r_file:
                    datas = r_file.read()
            with open("accounts.lal", "wb") as w_file:
                w_file.write(encrypt(password, datas))
        with open("accounts.lal", "rb") as f:
            self.__accounts: dict = json.loads(decrypt(password, f.read()))

    def __getAccountCredentials(self, name):
        return {
            "username": self.__accounts[name]["username"],
            "password": self.__accounts[name]["password"]
        }

    def __save(self):
        with open("accounts.lal", "wb") as f:
            datas = json.dumps(self.__accounts, indent=4).encode()
            f.write(encrypt(self.__password, datas))

    def addAccount(self, name, username, password, description = ""):
        self.__accounts[name] = {
            "description": description,
            "username": username,
            "password": password
        }
        self.__save()

    def removeAccount(self, name):
        del self.__accounts[name]
        self.__save()

    def getAccountsInfos(self):
        return [
            {
                "name": name,
                "description": self.__accounts[name]["description"]
            }
            for name in self.__accounts.keys()
        ]

    def login(self, name):
        credentials = self.__getAccountCredentials(name)
        logToLeague(credentials["username"], credentials["password"])

if __name__ == "__main__":
    logger = AccountManager()
