export interface Charger {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  brand: string;
  wattage: number | null;
  connection_type: string | null;
}
