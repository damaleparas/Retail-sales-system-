from src.utils.database import sales_collection
from src.models.schemas import SaleCreate
from src.services.ml_service import predictor

async def create_sale(sale: SaleCreate):
    sale_dict = sale.dict()
    await sales_collection.insert_one(sale_dict)
    return sale_dict

async def get_filtered_sales(
    page: int,
    limit: int,
    search: str,
    region: list,
    gender: list,
    category: list,
    sort_by: str,
    sort_order: str
):
    query = {}

    if search:
        query["$or"] = [
            {"customer_name": {"$regex": search, "$options": "i"}},
            {"phone_number": {"$regex": search, "$options": "i"}}
        ]

    if region:
        query["region"] = {"$in": region}
    if gender:
        query["gender"] = {"$in": gender}
    if category:
        query["category"] = {"$in": category}

    sort_criteria = [(sort_by, 1 if sort_order == "asc" else -1)]
    
    skip = (page - 1) * limit
    
    cursor = sales_collection.find(query).sort(sort_criteria).skip(skip).limit(limit)
    total_count = await sales_collection.count_documents(query)
    
    sales = []
    async for document in cursor:
        document["_id"] = str(document["_id"])
        sales.append(document)

    if total_count > 0 and not predictor.is_trained:
        all_data = await sales_collection.find().to_list(100)
        predictor.train(all_data)

    return sales, total_count

async def get_sales_stats(search, region, gender, category):
    query = {}

    # 1. Build the filter query (Same as the table)
    if search:
        query["$or"] = [
            {"customer_name": {"$regex": search, "$options": "i"}},
            {"phone_number": {"$regex": search, "$options": "i"}}
        ]
    if region:
        query["region"] = {"$in": region}
    if gender:
        query["gender"] = {"$in": gender}
    if category:
        query["category"] = {"$in": category}

    # 2. Calculate Stats on Filtered Data
    pipeline = [
        {"$match": query},  # <--- Filter FIRST
        {
            "$group": {
                "_id": None,
                "total_revenue": {"$sum": "$total_amount"},
                "total_units": {"$sum": "$quantity"},
                "avg_order_value": {"$avg": "$total_amount"}
            }
        }
    ]

    cursor = sales_collection.aggregate(pipeline)
    result = await cursor.to_list(length=1)

    if not result:
        return {"total_revenue": 0, "total_orders": 0, "avg_order_value": 0}

    data = result[0]
    return {
        "total_revenue": round(data.get("total_revenue", 0), 2),
        "total_orders": data.get("total_units", 0), # Map sum(quantity) -> total_orders
        "avg_order_value": round(data.get("avg_order_value", 0), 2)
    }