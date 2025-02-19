import os
from dotenv import load_dotenv

load_dotenv()


KASSAL_API_KEY = os.environ.get("KASSAL_API_KEY")
if not KASSAL_API_KEY:
    raise Exception("KASSAL_API_KEY environment variable is not set.")
