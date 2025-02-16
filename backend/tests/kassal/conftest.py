import os
import pytest
from dotenv import load_dotenv

from src.kassal.kassal_service import KassalAPI

load_dotenv()


@pytest.fixture(scope="session")
def real_api() -> KassalAPI:
    """
    Provides a KassalAPI instance using the real token from the environment.
    Skips tests if the token is missing.
    """
    token = os.getenv("KASSAL_API_TOKEN")
    if not token:
        pytest.skip(
            "No KASSAL_API_TOKEN set in environment. Skipping integration tests."
        )
    return KassalAPI(token=token)
