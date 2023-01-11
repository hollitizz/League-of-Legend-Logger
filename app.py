from tkinter import simpledialog
from AccountManager import AccountManager
from tkinter import *
from tkinter import ttk
from utils import genSalt, hashPassword

class App(Tk):
    def __init__(self):
        super().__init__()
        self.title("Account Manager")
        self.geometry("300x500")
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
        self.main_frame = Frame(self, bg='midnight blue', border=0)
        self.main_frame.pack(fill="both", expand="yes")
        self.canvas = Canvas(self.main_frame, bg='light blue', width=250, height=400)
        self.canvas.pack(side=LEFT, fill=BOTH, expand="yes", padx=10, pady=(10, 10))
        self.scrollbar = ttk.Scrollbar(self.canvas, orient="vertical", command=self.canvas.yview)
        self.scrollbar.place(x=505,y=0,height=400)
        self.canvas.configure(yscrollcommand=self.scrollbar.set)
        self.canvas.bind('<Configure>', lambda e: self.canvas.configure(scrollregion=self.canvas.bbox("all")))
        def on_mousewheel(event):
            self.canvas.yview_scroll(int(-1*(event.delta/120)), "units")
        self.canvas.bind_all("<MouseWheel>", on_mousewheel)
        self.second_frame = Frame(self.canvas, bg='light blue', border=0, width=250, height=400)
        self.second_frame.pack(fill="both", expand="yes")
        self.canvas.create_window((0, 0), window=self.second_frame, anchor='nw')
        self.add_account_button = Button(self, text="Add Account", bg='light blue', command=self.addAccount)
        self.add_account_button.pack(pady=(0, 10))
        self.accounts = []
        self.generateAccounts()

    def generateAccounts(self):
        for account in self.accounts:
            account.destroy()
        for account in self.__account_manager.getAccountsInfos():
            self.accounts.append(LabelFrame(self.second_frame, text=account["name"], bg='light blue', border=0, highlightbackground="midnight blue", highlightthickness=1))
            self.accounts[-1].pack(pady=10, fill="x", expand="yes", padx=(80,0))
            Label(self.accounts[-1], text=account["description"], bg="light blue").pack()
            Button(self.accounts[-1], text="Login", bg="light blue", command=lambda name=account["name"]: self.__account_manager.login(name)).pack()

    def addAccount(self):
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
        add_button = Button(top, text="Add", bg='light blue', width=10, command= lambda: [self.__account_manager.addAccount(name.get(), username.get(), password.get(), description.get()), self.generateAccounts(), top.destroy()])
        add_button.grid(row=5, column=0, padx=10)
        cancel_button = Button(top, text="Cancel", bg='light blue', width=10, command=top.destroy)
        cancel_button.grid(row=5, column=1, padx=10)

    def run(self):
        self.mainloop()

if __name__ == "__main__":
    app = App()
    app.run()
