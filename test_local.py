import requests

url = "http://localhost:8000/auth/register"
headers = {
    "Content-Type": "application/json"
}
data = {
    "email": "test@test.com",
    "password": "password",
    "full_name": "Test User"
}

try:
    response = requests.post(url, json=data, headers=headers)
    print("STATUS:", response.status_code)
    print("RESPONSE:", response.text)
except Exception as e:
    print("ERROR:", e)
