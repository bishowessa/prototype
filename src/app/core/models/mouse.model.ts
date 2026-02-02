export interface Mouse {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  brand: string;
  model: string | null;
  type: string | null;
  interface: string | null;
  grip_style: string | null;
  tracking_method: string | null;
  dpi: number | null;
  hand_orientation: string | null;
  buttons: number | null;
  adjustable_weight: boolean | null;
  scrolling_capability: string | null;
}
