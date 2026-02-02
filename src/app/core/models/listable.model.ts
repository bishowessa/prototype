export interface Listable {
  id: number;
  created_at: string;
  updated_at: string;
  phone_variant_id: number | null;
  laptop_variant_id: number | null;
  charger_id: number | null;
  keyboard_id: number | null;
  mouse_id: number | null;
  headphones_id: number | null;
}
