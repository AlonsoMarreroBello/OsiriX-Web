import { BaseDataRow } from "./CustomTable.interface";

export interface DeveloperData extends BaseDataRow {
  id: number;
  developer: string;
}

export interface DeveloperRequestDto {
  name: string;
}
