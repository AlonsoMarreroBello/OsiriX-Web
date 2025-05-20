import { BaseDataRow } from "./CustomTable.interface";

export type CategoryType = "game" | "app";

export interface CategoryData extends BaseDataRow {
  id: number | null;
  name: string;
  categoryType: CategoryType;
}
