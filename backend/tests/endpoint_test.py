from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_get_message():
    """
    Test file upload with different authentication tokens
    """
    response = client.get("/message")
    assert response.status_code == 200
