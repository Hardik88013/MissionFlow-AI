import urllib.request
import json
import time

url = "https://api.github.com/search/code?q=filename:train_FD001.txt"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode('utf-8'))
        
        for item in data.get('items', []):
            raw_url = item['html_url'].replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/')
            print(raw_url)
except Exception as e:
    print(e)
