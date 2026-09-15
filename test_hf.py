import urllib.request
try:
    req = urllib.request.urlopen("https://huggingface.co/datasets/Xenova/cmapss/resolve/main/train_FD001.txt")
    print(req.status)
except Exception as e:
    print(e)
