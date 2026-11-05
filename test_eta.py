import requests

url = "https://missionflow-ai-v0m4.onrender.com/predictions/eta"
payload = {
    "straight_line_distance_km": 100,
    "start_longitude": 76.78,
    "start_latitude": 30.73,
    "end_longitude": 77.17,
    "end_latitude": 31.10,
    "hour": 10,
    "day_of_week": 2,
    "is_weekend": 0,
    "CALL_TYPE": "Dispatch",
    "ORIGIN_STAND": 1
}

r = requests.post(url, json=payload)
print("STATUS:", r.status_code)
print("RESPONSE:", r.text)
