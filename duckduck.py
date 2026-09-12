import urllib.request
import re

search_url = "https://html.duckduckgo.com/html/?q=train_FD001.txt+site:raw.githubusercontent.com"
req = urllib.request.Request(search_url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        links = re.findall(r'href="([^"]+)"', html)
        for link in links:
            if 'train_FD001.txt' in link and 'raw.githubusercontent' in link:
                print("Found:", link)
except Exception as e:
    print(e)
