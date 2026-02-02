export interface UserWishlistItem {
  id: number;
  created_at: string;
  updated_at: string;
  user_id: number;
  listable_id: number;
  note: string | null;
}
