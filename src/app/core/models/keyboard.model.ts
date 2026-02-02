export interface Keyboard {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  brand: string;
  vendor_listings_note: string | null;
  model: string | null;
  switch_type: string | null;
  size: string | null;
  backlit: boolean | null;
  color: string | null;
  connectivity: string | null;
}
