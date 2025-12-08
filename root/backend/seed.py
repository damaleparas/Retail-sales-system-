import asyncio
import pandas as pd
from src.utils.database import sales_collection
from datetime import datetime
import time

CSV_FILE_PATH = "truestate_assignment_dataset.csv"
ROW_LIMIT = 50000  # <--- STOP AFTER THIS MANY ROWS
BATCH_SIZE = 10000 

def clean_phone(value):
    try:
        return str(int(float(value))) if pd.notna(value) else ""
    except:
        return str(value)

async def create_indexes():
    print("⚡ Creating Indexes...")
    await sales_collection.create_index([("customer_name", "text"), ("phone_number", "text")])
    await sales_collection.create_index("region")
    await sales_collection.create_index("date")

async def seed():
    start_time = time.time()
    print(f"⏳ Starting Import (Limited to first {ROW_LIMIT} rows)...")

    # 1. Clear old data
    print("🧹 Clearing existing database...")
    await sales_collection.delete_many({})

    # 2. Process CSV
    total_inserted = 0
    
    # We use nrows=ROW_LIMIT to only read the top 50k lines instantly
    # chunksize is still used to manage memory efficiently
    with pd.read_csv(CSV_FILE_PATH, chunksize=BATCH_SIZE, nrows=ROW_LIMIT) as reader:
        for chunk in reader:
            data_to_insert = []

            # Fast cleaning
            chunk['Date'] = pd.to_datetime(chunk['Date'], errors='coerce').fillna(datetime.now())
            chunk['Phone Number'] = chunk['Phone Number'].apply(clean_phone)
            chunk.fillna({'Age': 0, 'Quantity': 0, 'Total Amount': 0.0}, inplace=True)

            records = chunk.to_dict('records')
            
            for row in records:
                data_to_insert.append({
                    "customer_id": str(row.get('Customer ID')),
                    "customer_name": str(row.get('Customer Name')),
                    "phone_number": row.get('Phone Number'),
                    "gender": str(row.get('Gender')),
                    "age": int(row.get('Age')),
                    "region": str(row.get('Customer Region')),
                    "product_id": str(row.get('Product ID')),
                    "product_name": str(row.get('Product Name')),
                    "category": str(row.get('Product Category')),
                    "tags": str(row.get('Tags', '')).split(',') if pd.notna(row.get('Tags')) else [],
                    "quantity": int(row.get('Quantity')),
                    "total_amount": float(row.get('Final Amount', row.get('Total Amount'))),
                    "date": row.get('Date'),
                    "payment_method": str(row.get('Payment Method')),
                    "order_status": str(row.get('Order Status', 'Completed'))
                })

            if data_to_insert:
                await sales_collection.insert_many(data_to_insert)
                total_inserted += len(data_to_insert)
                print(f"✅ Inserted batch. Total: {total_inserted}")

            if total_inserted >= ROW_LIMIT:
                break

    # 3. Index
    await create_indexes()

    duration = time.time() - start_time
    print(f"🎉 DONE! Imported {total_inserted} rows in {duration:.2f} seconds.")

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(seed())