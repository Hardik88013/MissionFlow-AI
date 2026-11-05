import requests

url = "https://missionflow-ai-v0m4.onrender.com/auth/login"
headers = {
    "Content-Type": "application/json",
    "Origin": "https://missionflowai.vercel.app"
}
data = {
    "email": "test@test.com",
    "password": "password"
}

response = requests.post(url, json=data, headers=headers)
print("STATUS:", response.status_code)
print("RESPONSE:", response.text)
