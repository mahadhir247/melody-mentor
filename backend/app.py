from flask import Flask
import pyrebase
import os
from song_parser import parseSong

config = {
    "apiKey": "AIzaSyC0oRGRLhfnZdQtsweJ1Q7VG1fHDLid5ws",
    "authDomain": "orbitalapp-4da0d.firebaseapp.com",
    "projectId": "orbitalapp-4da0d",
    "storageBucket": "orbitalapp-4da0d.appspot.com",
    "messagingSenderId": "991219715789",
    "appId": "1:991219715789:web:7edb6e7a1f9adf6d8a2384",
    "measurementId": "G-7WV1X1TPMS",
    "databaseURL": ""
}

firebase = pyrebase.initialize_app(config)
storage = firebase.storage()

app = Flask(__name__)

@app.route('/')
def launch():
    return "Successfully Launched"

@app.route('/<name>')
def get(name):
    fileName = name + ".gp3"
    storage.child("/gp3/" + fileName).download("", fileName)
    parseSong(fileName)
    os.remove(fileName)
    return f"Successfully Downloaded {name}.gp3"

if __name__ == "__main__":
    app.run(debug=True)
