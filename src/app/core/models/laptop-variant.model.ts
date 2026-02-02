export interface LaptopVariant {
  id: number;
  created_at: string;
  updated_at: string;
  laptop_id: number;
  cpu: string;
  gpu: string;
  memory: number;
  storage: number;
  performance_tier: string | null;
  is_performance_tier_predicted: boolean | null;
}
