# command to convert to exe  

```bash
pip install pyinstaller
pyinstaller --noconfirm --onedir --windowed --icon "path/to/cloned/dir/League-of-Legend-autologger/ressources/riot.ico" --name "Account Manager" --add-data "path/to/cloned/dir/League-of-Legend-autologger/LICENSE;." --add-data "path/to/cloned/dir/League-of-Legend-autologger/ressources;ressources/"  "path/to/cloned/dir/League-of-Legend-autologger/app.py"
```