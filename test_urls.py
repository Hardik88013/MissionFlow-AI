import urllib.request
import os

urls = [
    "https://raw.githubusercontent.com/havakv/pycox/master/datasets/cmapss_train_FD001.txt",
    "https://raw.githubusercontent.com/zariable/Predictive-Maintenance/master/data/train_FD001.txt",
    "https://raw.githubusercontent.com/Anudeep-Vysyaraju/CMAPSS-Data/master/train_FD001.txt",
    "https://raw.githubusercontent.com/JinyuanZ/predictive-maintenance/master/CMAPSSData/train_FD001.txt",
    "https://raw.githubusercontent.com/LucianoBatista/Predictive-Maintenance-CMAPSS/master/data/train_FD001.txt",
    "https://raw.githubusercontent.com/jiaxiang-cheng/PyTorch-CMAPSS/master/data/train_FD001.txt",
    "https://raw.githubusercontent.com/RohanG11/CMAPSS/master/train_FD001.txt"
]

for url in urls:
    try:
        urllib.request.urlretrieve(url, "train_FD001.txt")
        print(f"Success: {url}")
        break
    except:
        pass
