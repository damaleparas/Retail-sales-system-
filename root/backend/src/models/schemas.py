from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Union
from datetime import datetime

class SaleBase(BaseModel):
    customer_id: str
    customer_name: str
    phone_number: str
    gender: str
    age: int
    region: str
    product_id: str
    product_name: str
    category: str
    tags: List[str]
    quantity: int
    total_amount: float
    date: datetime
    payment_method: str
    order_status: str  # <--- Make sure this line exists!
    
class SaleCreate(SaleBase):
    pass

class SaleResponse(SaleBase):
    id: str = Field(..., alias="_id")

    class Config:
        populate_by_name = True
        json_encoders = {datetime: lambda v: v.isoformat()}

class PaginatedResponse(BaseModel):
    data: List[SaleResponse]
    total: int
    page: int
    pages: int