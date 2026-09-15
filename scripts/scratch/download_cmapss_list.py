import urllib.request
import urllib.error
import os

urls = [
    "https://raw.githubusercontent.com/zariable/Predictive-Maintenance/master/data/train_FD001.txt",
    "https://raw.githubusercontent.com/umbertogriffo/Predictive-Maintenance-using-LSTM/master/Dataset/train_FD001.txt",
    "https://raw.githubusercontent.com/SimonCK666/Predictive-Maintenance-using-LSTM/master/Dataset/train_FD001.txt",
    "https://raw.githubusercontent.com/vikrantbrs/Predictive-Maintenance/master/data/train_FD001.txt",
    "https://raw.githubusercontent.com/Samim-M/Predictive-Maintenance/master/data/train_FD001.txt"
]

out_dir = "ml/data/raw/CMAPSS"
os.makedirs(out_dir, exist_ok=True)
success = False

for url in urls:
    try:
        print(f"Trying {url}...")
        urllib.request.urlretrieve(url, os.path.join(out_dir, "train_FD001.txt"))
        
        # If train succeeds, get test and RUL
        urllib.request.urlretrieve(url.replace("train_FD001", "test_FD001"), os.path.join(out_dir, "test_FD001.txt"))
        urllib.request.urlretrieve(url.replace("train_FD001", "RUL_FD001"), os.path.join(out_dir, "RUL_FD001.txt"))
        print(f"Success with {url}!")
        success = True
        break
    except urllib.error.HTTPError:
        print("404 Not Found")
    except Exception as e:
        print(f"Error: {e}")

if not success:
    print("Could not find dataset.")
