export interface SetUserPreferenceRequest {
  productCategoryId: number;
  preferences: string;
}

export interface UserPreferenceResponse {
  id: number;
  productCategoryId: number;
  preferences: string;
}

export interface BudgetRangeOption {
  min: number | null;
  max: number | null;
}

export interface CategoryPreferenceOptions {
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  budgetRange: BudgetRangeOption;
  fields: Record<string, Array<string | number | boolean>>;
  ranges: Record<string, BudgetRangeOption>;
}

export interface PreferenceOptionsResponse {
  budgetTiers: string[];
  categories: CategoryPreferenceOptions[];
}
