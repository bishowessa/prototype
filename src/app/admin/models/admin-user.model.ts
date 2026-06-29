export type UserType = 'ADMIN' | 'USER';

export interface AdminUserPreferenceDto {
  id: number;
  productCategoryId: number;
  categoryName: string;
  categorySlug: string;
  preferences: string;
}

export interface AdminUserListItemDto {
  id: number;
  email: string;
  type: UserType;
  preferences: AdminUserPreferenceDto[];
}
