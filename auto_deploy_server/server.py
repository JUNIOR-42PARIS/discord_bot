#!/usr/bin/env python

from flask import Flask
import subprocess

app = Flask(__name__)

@app.route("/deploy", methods=['POST'])
def auto_deploy():
    p = subprocess.Popen(['git','pull'], cwd='/home/saky/lld_bot_discord')
    p.wait()
	p = subprocess.Popen(['pm2','reload','bot_lld_sudo'], cwd='/home/saky')
    p.wait()
    print("")
	print("Auto deployed !")
	print("")
    return "Deployd"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=4242, debug=True, ssl_context="adhoc")