export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface SingleOrderRequest {
  order_id: number;
  customer_city: string;
  shipping_mode: string;
  order_date: string;
}

export interface SingleOrderResponse {
  order_id: number;
  is_delayed: 0 | 1;
  delay_probability: number;
  risk_level: RiskLevel;
  // Optional metadata enriched from CSV row or form for richer UI displays
  customer_city?: string;
  shipping_mode?: string;
  order_date?: string;
  order_region?: string;
  delivery_status?: string;
}

export interface BatchSummary {
  total_orders: number;
  delayed_count: number;
  on_time_count: number;
  delay_rate: number;
  processing_time_ms: number;
}

export interface BatchPredictionResponse {
  summary: BatchSummary;
  columns: string[];
  data: SingleOrderResponse[];
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  version: string;
}

export interface FilterOptions {
  riskLevel: 'All' | 'Low' | 'Medium' | 'High';
  searchQuery: string;
  sortBy: 'order_id' | 'delay_probability' | 'risk_level' | 'is_delayed';
  sortDirection: 'asc' | 'desc';
}

export interface PredictionState {
  data: BatchPredictionResponse | null;
  isLoading: boolean;
  error: string | null;
  isFallback: boolean;
  activeFilter: FilterOptions;
}
