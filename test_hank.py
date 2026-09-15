import urllib.request
try:
    req = urllib.request.urlopen("https://raw.githubusercontent.com/hankroark/Turbofan-Engine-Degradation/master/CMAPSSData/train_FD001.txt")
    print(req.status)
except Exception as e:
    print(e)
