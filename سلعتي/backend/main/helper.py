"""
  File: helpers.py
  Description: Contains a collection of functions that simplify the developement process,
               or the functions used in multiple files.
"""
from datetime import datetime
import time
import random
import string
import pyrebase

# TODO: Move this config to safe plalce
config = {
    "apiKey": "AIzaSyBAvjx2gXUJ07bA_-ox-OSUWjOXCh_yJMo",
    "authDomain": "belgro-ab033.firebaseapp.com",
    "databaseURL": "https://belgro-ab033-default-rtdb.asia-southeast1.firebasedatabase.app",
    "projectId": "belgro-ab033",
    "storageBucket": "belgro-ab033.appspot.com",
    "messagingSenderId": "267387796768",
    "appId": "1:267387796768:web:c8ba398e51e220f5bceb45",
    "measurementId": "G-5DRC6J95JJ",
}

# ? pyrebase instance
firebase = pyrebase.initialize_app(config)
# ? Database instance
db = firebase.database()


def newNotification(parent="", username="", data={}):
    if username:
        db.child(parent).child(cleanUsername(username)).set(randomString(10))
    elif data:
        db.child(parent).set(data)


def updateNotification(parent, username, notification):
    # ? Note: the message should be an object
    db.child(parent).child(cleanUsername(username)).set(notification)


def removeNewNotification(parent, username):
    db.child(parent).child(cleanUsername(username)).remove()


def cleanUsername(username):
    return username.replace("-", "").replace(".", "").replace("@", "")


def datetime2timestamp(string):
    tuple = datetime.strptime(string.split("+")[0], "%Y-%m-%d %H:%M:%S.%f").timetuple()
    return time.mktime(tuple)


def randomString(k):
    return "".join(random.choices(string.ascii_lowercase, k=k))
