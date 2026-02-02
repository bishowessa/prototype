export interface VendorListing {
  id: number;
  created_at: string;
  updated_at: string;
  vendor_id: number;
  listable_id: number;
  price: number;
  original_price: number | null;
  url: string | null;
}
