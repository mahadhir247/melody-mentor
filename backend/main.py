from flask import Flask
import pyrebase
import os
from song_parser import parseSong

config = {
    "apiKey": "AIzaSyAFwhzUx49em5qCpHEkXgZd7CwdgTdJcQM",
    "authDomain": "fir-basics-96f5a.firebaseapp.com",
    "projectId": "fir-basics-96f5a",
    "storageBucket": "fir-basics-96f5a.appspot.com",
    "messagingSenderId": "472568474061",
    "appId": "1:472568474061:web:cac10c72116833f087fc84",
    "measurementId": "G-WP7T27LQCN",
    "databaseURL": ""
}

firebase = pyrebase.initialize_app(config)
storage = firebase.storage()

app = Flask(__name__)

@app.route('/')
def get(name):
    fileName = name + ".gp3"
    storage.child("/gp3/" + fileName).download("", fileName)
    parseSong(fileName)
    os.remove(fileName)
    return f"Successfully Downloaded {name}.gp3"

if __name__ == "__main__":
    app.run(debug=True)