import urllib.request

urls = [
    "https://raw.githubusercontent.com/dayyass/predictive_maintenance/master/CMAPSSData/train_FD001.txt",
    "https://raw.githubusercontent.com/Andras7/predictive-maintenance/master/CMAPSSData/train_FD001.txt",
    "https://raw.githubusercontent.com/yuningS/RUL-prediction/master/CMAPSSData/train_FD001.txt",
    "https://raw.githubusercontent.com/biswajitsahoo1111/rul_codes_open/master/CMAPSSData/train_FD001.txt"
]

for url in urls:
    try:
        urllib.request.urlretrieve(url, "train_FD001.txt")
        print(f"Success: {url}")
        break
    except:
        pass
