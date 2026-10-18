import os

def create_desktop_shortcut():
    desktop = os.path.join(os.path.expanduser('~'), 'Desktop')
    target = os.path.abspath('Open Site.bat')
    icon = os.path.abspath('ax.png')
    cwd = os.path.abspath('.')

    vbs_path = os.path.join(cwd, '_make_shortcut.vbs')
    shortcut_path = os.path.join(desktop, 'Alphaxen Foundry - Open Site.lnk')

    vbs_code = f'''
Set oWS = WScript.CreateObject("WScript.Shell")
sLinkFile = "{shortcut_path}"
Set oLink = oWS.CreateShortcut(sLinkFile)
oLink.TargetPath = "{target}"
oLink.WorkingDirectory = "{cwd}"
oLink.Description = "Auto-Publish Alphaxen Foundry Site on Localhost"
oLink.Save
'''

    with open(vbs_path, 'w', encoding='utf-8') as f:
        f.write(vbs_code)

    os.system(f'cscript //nologo "{vbs_path}"')

    if os.path.exists(vbs_path):
        os.remove(vbs_path)

    if os.path.exists(shortcut_path):
        print(f"[SUCCESS] Shortcut created at: {shortcut_path}")
    else:
        print("[NOTE] Completed shortcut creation.")

if __name__ == '__main__':
    create_desktop_shortcut()
