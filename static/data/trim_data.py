import pandas as pd

# Load the full year of data (change the file path as needed)
file_path = 'USDJPY.csv'
data = pd.read_csv(file_path)

# Calculate the number of rows for 1 month assuming equal distribution (approx 1/12th of the data)
rows_per_month = len(data) // 12

# Cut the last month of data
trimmed_data = data.iloc[:-rows_per_month]

# Save the new dataset (update the file path as needed)
output_path = 'USDJPY_trimmed.csv'
trimmed_data.to_csv(output_path, index=False)

print(f"Trimmed data saved to: {output_path}")
