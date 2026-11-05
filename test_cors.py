import requests

url = "https://missionflow-ai-v0m4.onrender.com/auth/register"
headers = {
    "Content-Type": "application/json",
    "Origin": "https://missionflowai.vercel.app"
}
data = {
    "email": "test@test.com",
    "password": "password",
    "full_name": "Test User"
}

try:
    response = requests.post(url, json=data, headers=headers)
    print("STATUS:", response.status_code)
    print("HEADERS:", response.headers)
    print("RESPONSE:", response.text)
except Exception as e:
    print("ERROR:", e)
