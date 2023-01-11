import json
import win32gui
from LcuLogin import LcuLogin

from utils import encrypt, decrypt

class AccountManager(LcuLogin):
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

    def __windowEnumerationHandler(self, hwnd, top_windows):
        top_windows.append((hwnd, win32gui.GetWindowText(hwnd)))

    def __focusRiotClient(self):
        is_found = False
        top_windows = []
        win32gui.EnumWindows(self.__windowEnumerationHandler, top_windows)
        for i in top_windows:
            if "riot client" in i[1].lower():
                win32gui.ShowWindow(i[0],5)
                win32gui.SetForegroundWindow(i[0])
                is_found = True
                break
        if not is_found:
            raise Exception("Riot Client not found")

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
        self.loginRequest(credentials["username"], credentials["password"])
        try:
            self.__focusRiotClient()
        except:
            print("Riot Client not found")
            return


if __name__ == "__main__":
    logger = AccountManager()
