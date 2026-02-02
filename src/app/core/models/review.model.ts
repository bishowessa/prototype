export interface Review {
  id: number;
  created_at: string;
  updated_at: string;
  listable_id: number;
  title: string;
  body: string | null;
  rating: number | null;
  url: string | null;
}
