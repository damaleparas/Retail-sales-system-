from fastapi import APIRouter, Query
from typing import List, Optional
from src.services.sales_service import get_filtered_sales, create_sale
from src.models.schemas import PaginatedResponse, SaleCreate, SaleResponse
from src.services.ml_service import predictor

router = APIRouter()

@router.get("/sales", response_model=PaginatedResponse)
async def read_sales(
    page: int = 1,
    limit: int = 10,
    search: Optional[str] = None,
    region: Optional[List[str]] = Query(None),
    gender: Optional[List[str]] = Query(None),
    category: Optional[List[str]] = Query(None),
    sort_by: str = "date",
    sort_order: str = "desc"
):
    sales, total = await get_filtered_sales(
        page, limit, search, region, gender, category, sort_by, sort_order
    )
    return {
        "data": sales,
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit
    }

@router.post("/sales", response_model=SaleCreate)
async def add_sale(sale: SaleCreate):
    return await create_sale(sale)


@router.get("/sales/stats")
async def read_stats():
    pipeline = [
        {
            "$group": {
                "_id": None,
                "total_revenue": {"$sum": "$total_amount"},
                "total_orders": {"$sum": 1},
                "avg_order_value": {"$avg": "$total_amount"}
            }
        }
    ]
    cursor = sales_collection.aggregate(pipeline)
    stats = await cursor.to_list(length=1)
    
    if not stats:
        return {"total_revenue": 0, "total_orders": 0, "avg_order_value": 0}
        
    result = stats[0]
    return {
        "total_revenue": round(result["total_revenue"], 2),
        "total_orders": result["total_orders"],
        "avg_order_value": round(result["avg_order_value"], 2)
    }

@router.get("/sales/predict")
async def predict_sales_value(quantity: int):
    predicted_val = predictor.predict_revenue(quantity)
    return {"quantity": quantity, "predicted_total_revenue": predicted_val}