import pandas as pd
import random
from pathlib import Path

SOURCE = Path(
    "ml/data/taxi+service+trajectory+prediction+challenge+ecml+pkdd+2015/train.csv/train.csv"
)

OUTPUT = Path("ml/data/porto_eta_sample.csv")

SAMPLE_SIZE = 30_000
CHUNK_SIZE = 10_000
RANDOM_SEED = 42

random.seed(RANDOM_SEED)

sample_rows = []
total_rows = 0

print("Scanning the full Porto dataset...")
print(f"Target sample: {SAMPLE_SIZE:,} trips")
print()

for chunk in pd.read_csv(SOURCE, chunksize=CHUNK_SIZE):
    for row in chunk.to_dict("records"):
        total_rows += 1

        if len(sample_rows) < SAMPLE_SIZE:
            sample_rows.append(row)
        else:
            replacement_index = random.randint(0, total_rows - 1)

            if replacement_index < SAMPLE_SIZE:
                sample_rows[replacement_index] = row

    if total_rows % 100_000 == 0:
        print(f"Processed {total_rows:,} rows...")

print()
print(f"Finished scanning {total_rows:,} rows.")

sample = pd.DataFrame(sample_rows)

sample = sample.sample(
    frac=1,
    random_state=RANDOM_SEED,
).reset_index(drop=True)

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
sample.to_csv(OUTPUT, index=False)

print()
print("SUCCESS!")
print(f"Sample rows: {len(sample):,}")
print(f"Sample columns: {len(sample.columns)}")
print(f"Saved to: {OUTPUT}")
