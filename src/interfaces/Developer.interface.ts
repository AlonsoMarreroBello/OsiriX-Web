import { BaseDataRow } from "./CustomTable.interface";

export interface DeveloperData extends BaseDataRow {
  id: number;
  name: string;
}

export interface DeveloperRequestDto {
  name: string;
}
