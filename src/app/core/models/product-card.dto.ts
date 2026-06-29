export interface ProductCardDto {
  title: string;
  subtitle: string;
  price: string;
  priceValue?: number | null;
  rating: string;
  imageUrl: string;
  imageAlt: string;
  showMatchBadge: boolean;
  mainSpecs?: string[];
}
