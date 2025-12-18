import firebase_admin
from  firebase_admin import credentials

cred = credentials.Certificate("FIREBASE_ADMIN_KEY_PATH")
firebase_admin.initialize_add(cred)