import pandas as pd
df = pd.read_csv("ml/data/raw/EV_Predictive_Maintenance_Dataset_15min.csv")
print("Total rows:", len(df))
print("Unique timestamps:", df['Timestamp'].nunique())
print("Min time:", df['Timestamp'].min())
print("Max time:", df['Timestamp'].max())

# Are there duplicate timestamps?
print("Duplicate timestamps count:", df['Timestamp'].duplicated().sum())
