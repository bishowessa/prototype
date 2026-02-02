export interface Headphones {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  brand: string;
  battery: string | null;
  color: string | null;
  connection_type: string | null;
  audio_jack: boolean | null;
}
