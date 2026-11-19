from typing import Annotated, List, Literal
from pydantic import BaseModel, Field


class SingleOrderRequest(BaseModel):
    order_id: Annotated[int, Field(description="Unique order identifier (cannot be null)")]
    customer_city: Annotated[str, Field(description="Customer city name")]
    shipping_mode: Annotated[str, Field(description="Shipping mode (e.g., Standard Class, First Class)")]
    order_date: Annotated[str, Field(description="Order placement date string")]


class SingleOrderResponse(BaseModel):
    order_id: int
    is_delayed: Literal[0, 1]
    delay_probability: float = Field(ge=0.0, le=1.0, description="Delay probability between 0.0 and 1.0")
    risk_level: Literal["Low", "Medium", "High"]


class BatchSummary(BaseModel):
    total_orders: int
    delayed_count: int
    on_time_count: int
    delay_rate: float = Field(description="Percentage of delayed orders")
    processing_time_ms: float


class BatchPredictionResponse(BaseModel):
    summary: BatchSummary
    columns: List[str] = Field(default_factory=list, description="Column names for tabular display")
    data: List[SingleOrderResponse]


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    version: str = "0.1.0"
