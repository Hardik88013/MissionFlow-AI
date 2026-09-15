import urllib.request
import os

base_url = "https://raw.githubusercontent.com/hankroark/Turbofan-Engine-Degradation/master/CMAPSSData/"
files = ["train_FD001.txt", "test_FD001.txt", "RUL_FD001.txt"]

out_dir = "ml/data/raw/CMAPSS"
os.makedirs(out_dir, exist_ok=True)

for file in files:
    print(f"Downloading {file}...")
    urllib.request.urlretrieve(base_url + file, os.path.join(out_dir, file))
print("Done!")
