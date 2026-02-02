export interface Laptop {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  brand: string;
  release_date: string | null;
  resolution: string | null;
  aspect_ratio: string | null;
  refresh_rate: number | null;
  hdr: string | null;
  os: string | null;
  keyboard_backlit: boolean | null;
  battery: string | null;
  is_battery_predicted: boolean | null;
  battery_life: string | null;
  is_battery_life_predicted: boolean | null;
  power_efficiency_score: number | null;
  is_power_efficiency_score_predicted: boolean | null;
  weight: number | null;
}
