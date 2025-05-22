import { BaseDataRow } from "./CustomTable.interface";

export enum CategoryType {
  GAME = "game",
  APP = "app",
}

export interface CategoryData extends BaseDataRow {
  id: number | null;
  name: string;
  categoryType: CategoryType;
}

export interface CategoryRequestDto {
  categoryName: string;
  type: CategoryType;
}

export interface CategoryFormData {
  id: number | null;
  name: string;
  categoryType: CategoryType;
}
