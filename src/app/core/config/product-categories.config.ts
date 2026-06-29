export interface ProductCategoryOption {
  label: string;
  type: string;
}

export const PRODUCT_CATEGORY_OPTIONS: ProductCategoryOption[] = [
  { label: 'Phones', type: 'phone' },
  { label: 'Laptops', type: 'laptop' },
  { label: 'Chargers', type: 'chargers' },
  { label: 'Headphones', type: 'headsets' },
  { label: 'Keyboards', type: 'keyboards' },
  { label: 'Mice', type: 'mice' },
];

export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  PRODUCT_CATEGORY_OPTIONS.map((category) => [category.type, category.label]),
);
