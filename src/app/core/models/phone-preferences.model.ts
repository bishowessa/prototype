export interface PhonePreferences {
  id: number;
  created_at: string;
  updated_at: string;
  user_id: number;
  battery: number | null;
  camera: string | null;
  display: string | null;
  processor: string | null;
  storage: number | null;
  ram: number | null;
  gpu: string | null;
  brand: string | null;
  model: string | null;
  price_range: string | null;
}
