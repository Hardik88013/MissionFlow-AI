import requests
import json

url = "https://missionflow-ai-v0m4.onrender.com/routes/optimize"
payload = {
    "distance_matrix": [
        [0, 10, 20],
        [10, 0, 15],
        [20, 15, 0]
    ],
    "vehicle_count": 2,
    "depot": 0,
    "vehicle_capacities": [10, 10],
    "demands": [0, 5, 5],
    "time_windows": [
        [0, 100],
        [0, 100],
        [0, 100]
    ],
    "travel_speed_kmh": 40,
    "service_time_minutes": 10
}

r = requests.post(url, json=payload)
print(r.status_code)
print(r.text)
