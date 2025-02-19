import os
from dotenv import load_dotenv

load_dotenv()


KASSAL_API_KEY = os.environ.get("KASSAL_API_KEY")
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.environ.get("GOOGLE_REDIRECT_URI")

if not KASSAL_API_KEY:
    raise Exception("KASSAL_API_KEY environment variable is not set.")

if not GOOGLE_CLIENT_ID:
    raise Exception("GOOGLE_CLIENT_ID environment variable is not set.")

if not GOOGLE_CLIENT_SECRET:
    raise Exception("GOOGLE_CLIENT_SECRET environment variable is not set.")

if not GOOGLE_REDIRECT_URI:
    raise Exception("GOOGLE_REDIRECT_URI environment variable is not set.")
