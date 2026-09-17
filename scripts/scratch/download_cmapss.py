import urllib.request
import zipfile
import os

url = "https://ti.arc.nasa.gov/m/project/prognostic-repository/CMAPSSData.zip"
output_dir = "ml/data/raw/CMAPSS"
os.makedirs(output_dir, exist_ok=True)
zip_path = os.path.join(output_dir, "CMAPSSData.zip")

print("Downloading...")
urllib.request.urlretrieve(url, zip_path)
print("Extracting...")
with zipfile.ZipFile(zip_path, 'r') as zip_ref:
    zip_ref.extractall(output_dir)
print("Done!")
