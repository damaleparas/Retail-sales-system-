from fastapi import APIRouter, Query
from typing import List, Optional
from src.services.sales_service import get_filtered_sales, create_sale
from src.models.schemas import PaginatedResponse, SaleCreate, SaleResponse
from src.services.ml_service import predictor
from src.services.sales_service import get_filtered_sales, create_sale, get_sales_stats
# from fastapi import APIRouter, Query # <--- Make sure Query is imported
# from typing import List, Optional
# from src.services.sales_service import get_filtered_sales, create_sale, get_sales_stats

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


from fastapi import APIRouter, Query # <--- Make sure Query is imported
from typing import List, Optional
from src.services.sales_service import get_filtered_sales, create_sale, get_sales_stats

# ... (other code)

@router.get("/sales/stats")
async def read_stats(
    search: Optional[str] = None,
    # Query(None) is required for receiving lists like ?region=North&region=South
    region: Optional[List[str]] = Query(None), 
    gender: Optional[List[str]] = Query(None),
    category: Optional[List[str]] = Query(None)
):
    return await get_sales_stats(search, region, gender, category)

@router.get("/sales/predict")
async def predict_sales_value(quantity: int):
    predicted_val = predictor.predict_revenue(quantity)
    return {"quantity": quantity, "predicted_total_revenue": predicted_val}