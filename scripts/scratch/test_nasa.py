import urllib.request
import json
url = "https://data.nasa.gov/api/views/y4wa-6t65/rows.json"
try:
    urllib.request.urlretrieve("https://data.nasa.gov/download/y4wa-6t65/application%2Fzip", "CMAPSSData.zip")
    print("Success data.nasa.gov")
except:
    pass
