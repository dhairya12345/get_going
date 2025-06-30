# firebase.py
import os
from django.conf import settings
import firebase_admin
from firebase_admin import credentials, firestore

def initialize_firebase():
    try:
        # Path to your Firebase service account key
        cred_path = os.path.join(settings.BASE_DIR, 'firebase', 'car-sharing-df3cf-firebase-adminsdk-fbsvc-d3039d38b4.json')
        cred = credentials.Certificate(cred_path)
        
        # Initialize the Firebase Admin SDK
        firebase_admin.initialize_app(cred)
        
        # You can access Firebase services after initialization
        db = firestore.client()
        print("Firebase Initialized successfully")
        return db
    except Exception as e:
        print(f"Error initializing Firebase: {str(e)}")
        return None
