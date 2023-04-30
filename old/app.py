from tkinter import simpledialog
from tkinter.messagebox import askyesno
from AccountManager import AccountManager
from tkinter import *
from tkinter import ttk
from old.utils import ScrollableFrame, genSalt, hashPassword

class App(Tk):
    def __init__(self):
        super().__init__()
        self.title("Account Manager")
        self.geometry("300x500+0+150")
        self.resizable(False, False)
        self.icon = PhotoImage(file='./ressources/riot.png')
        self.iconphoto(False, self.icon)
        self.configure(bg='midnight blue')
        self.withdraw()
        encrypted = True
        while True:
            password = simpledialog.askstring("Password", "Enter your password", show="*")
            if not password:
                exit()
            try:
                with open("password.lal", "r", encoding='utf-8') as file:
                    content: str = file.read()
                    if content == hashPassword(password):
                        break
            except:
                with open("password.lal", "w", encoding='utf-8') as file:
                    file.write(hashPassword(password))
                    genSalt()
                    encrypted = False
                    break
        self.deiconify()
        self.__account_manager = AccountManager(password, encrypted)
        self.main_frame = ScrollableFrame(self, bg='light blue')
        self.main_frame.scrollable_frame.configure(bg='light blue')
        self.main_frame.canvas.configure(background='light blue', borderwidth=0, highlightthickness=0)
        self.main_frame.pack(padx=10, pady=10, fill="both", expand="yes")
        self.accounts: list[Button] = []
        self.add_account_button = Button(self, text="Add Account", bg='light blue', command=self.__addAccount)
        self.add_account_button.pack(pady=(0, 10))
        self.__generateAccounts()

    def __delAccount(self, name):
        prompt = askyesno("Delete Account", "Are you sure you want to delete account "+name+"?")
        if prompt:
            self.__account_manager.removeAccount(name)
            self.__generateAccounts()


    def __generateAccounts(self):
        for account in self.accounts:
            account.destroy()
        for account in self.__account_manager.getAccountsInfos():
            self.accounts.append(LabelFrame(self.main_frame.scrollable_frame, text=account["name"], bg='light blue', border=0, highlightbackground="midnight blue", highlightthickness=1))
            self.accounts[-1].pack(pady=10, fill="x", expand="yes", padx=(80,0))
            Label(self.accounts[-1], text=account["description"], bg="light blue").pack()
            Button(self.accounts[-1], text="Login", bg="light blue", command=lambda name=account["name"]: self.__account_manager.login(name)).pack(side=LEFT, expand="yes", fill="x")
            Button(self.accounts[-1], text="Delete", bg="light blue", command=lambda name=account["name"]: self.__delAccount(name)).pack(side=RIGHT, expand="yes", fill="x")

    def __createAccount(self, top, name, username, password, description):
        self.__account_manager.addAccount(name, username, password, description)
        top.destroy()
        self.__generateAccounts()

    def __addAccount(self):
        top = Toplevel(self)
        top.title("Add Account")
        top.resizable(False, False)
        top.iconphoto(False, self.icon)
        top.configure(bg='light blue')
        top.rowconfigure(4, minsize=10)
        Label(top ,text = "name", bg="light blue").grid(row = 0,column = 0)
        Label(top ,text = "username", bg="light blue").grid(row = 1,column = 0)
        Label(top ,text = "password", bg="light blue").grid(row = 2,column = 0)
        Label(top ,text = "description", bg="light blue").grid(row = 3,column = 0)
        name = Entry(top)
        name.grid(row = 0,column = 1)
        username = Entry(top)
        username.grid(row = 1,column = 1)
        password = Entry(top, show='*')
        password.grid(row = 2,column = 1)
        description = Entry(top)
        description.grid(row = 3,column = 1)
        add_button = Button(top, text="Add", bg='light blue', width=10, command= lambda: self.__createAccount(top, name.get(), username.get(), password.get(), description.get()))
        add_button.grid(row=5, column=0, padx=10)
        cancel_button = Button(top, text="Cancel", bg='light blue', width=10, command=top.destroy)
        cancel_button.grid(row=5, column=1, padx=10)

    def run(self):
        self.mainloop()

if __name__ == "__main__":
    app = App()
    app.run()
