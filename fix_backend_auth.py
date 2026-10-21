import re

# Fix requirements.txt
with open("backend/requirements.txt", "r") as f:
    reqs = f.read()
reqs = reqs.replace("google-auth\n", "")
with open("backend/requirements.txt", "w") as f:
    f.write(reqs)

# Fix auth_service.py
with open("backend/app/services/auth_service.py", "r") as f:
    auth_service = f.read()

auth_service = re.sub(r'from google\.oauth2 import id_token\n', '', auth_service)
auth_service = re.sub(r'from google\.auth\.transport import requests\n', '', auth_service)
auth_service = re.sub(r'GOOGLE_CLIENT_ID = os\.getenv\("GOOGLE_CLIENT_ID", ""\)\n', '', auth_service)

google_verify_func = """def verify_google_token(token: str):
    try:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)
        return idinfo
    except ValueError:
        return None"""
auth_service = auth_service.replace(google_verify_func, "")

with open("backend/app/services/auth_service.py", "w") as f:
    f.write(auth_service)

# Fix auth.py
with open("backend/app/api/auth.py", "r") as f:
    auth_api = f.read()

auth_api = auth_api.replace("GoogleAuth,", "")
auth_api = auth_api.replace("GoogleAuth", "")
auth_api = auth_api.replace("verify_google_token,", "")
auth_api = auth_api.replace("verify_google_token", "")

# Remove the google endpoint
google_endpoint_regex = r'@router\.post\("/google".*?return \{[^\}]+\}[^\}]+\}'
auth_api = re.sub(google_endpoint_regex, '', auth_api, flags=re.DOTALL)

with open("backend/app/api/auth.py", "w") as f:
    f.write(auth_api)

print("Done")
